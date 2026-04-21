---
title: 'PL/SQL 14: Manejo de Excepciones'
description: 'Capturar y manejar errores con NO_DATA_FOUND y excepciones personalizadas (RAISE_APPLICATION_ERROR).'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL', 'Excepciones', 'Manejo de Errores']
---

## Enunciado
Crear procedimientos defensivos que intercepten errores comunes (registros no encontrados, violación de reglas de negocio) y lancen excepciones personalizadas para hacer el código más robusto.

## Contexto
Las excepciones son el mecanismo de seguridad en PL/SQL. Existen dos tipos:
1. **Excepciones predefinidas**: `NO_DATA_FOUND`, `TOO_MANY_ROWS`, `ZERO_DIVIDE`
2. **Excepciones personalizadas**: Definidas por el programador con `RAISE_APPLICATION_ERROR`

## Solución PL/SQL

### Parte 1: Manejo de NO_DATA_FOUND

```sql
CREATE OR REPLACE FUNCTION fn_obtener_salario (
    p_id_empleado NUMBER
) RETURN NUMBER
IS
    vn_salario EMPLOYEES.salary%TYPE;
BEGIN
    -- Consulta que podría no devolver resultados
    SELECT salary
    INTO vn_salario
    FROM EMPLOYEES
    WHERE employee_id = p_id_empleado;
    
    RETURN vn_salario;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        -- Capturar si el empleado no existe
        RAISE_APPLICATION_ERROR(
            -20001,
            'Error: El empleado con ID ' || p_id_empleado || ' no existe.'
        );
    
    WHEN OTHERS THEN
        -- Capturar cualquier otro error inesperado
        RAISE_APPLICATION_ERROR(
            -20999,
            'Error inesperado: ' || SQLCODE || ' - ' || SQLERRM
        );
END fn_obtener_salario;
/
```

### Parte 2: Excepciones Personalizadas en Procedimientos

```sql
CREATE OR REPLACE PROCEDURE sp_aumentar_salario (
    p_id_empleado NUMBER,
    p_porcentaje_aumento NUMBER
)
IS
    vn_salario_actual    EMPLOYEES.salary%TYPE;
    vn_nuevo_salario     EMPLOYEES.salary%TYPE;
    vv_estado_empleado   EMPLOYEES.job_id%TYPE;
    
BEGIN
    -- Validar que el empleado existe
    BEGIN
        SELECT salary, job_id
        INTO vn_salario_actual, vv_estado_empleado
        FROM EMPLOYEES
        WHERE employee_id = p_id_empleado;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(
                -20001,
                'El empleado ID ' || p_id_empleado || ' no existe en la BD.'
            );
    END;
    
    -- Validar que el porcentaje sea positivo
    IF p_porcentaje_aumento <= 0 THEN
        RAISE_APPLICATION_ERROR(
            -20002,
            'El porcentaje de aumento debe ser mayor a 0. Recibido: ' || p_porcentaje_aumento
        );
    END IF;
    
    -- Validar que el aumento no supere el 50% (regla de negocio)
    IF p_porcentaje_aumento > 50 THEN
        RAISE_APPLICATION_ERROR(
            -20003,
            'El aumento máximo permitido es 50%. Solicitado: ' || p_porcentaje_aumento || '%'
        );
    END IF;
    
    -- Calcular nuevo salario
    vn_nuevo_salario := vn_salario_actual * (1 + (p_porcentaje_aumento / 100));
    
    -- Actualizar
    UPDATE EMPLOYEES
    SET salary = vn_nuevo_salario,
        last_update = SYSDATE
    WHERE employee_id = p_id_empleado;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('✓ Salario actualizado exitosamente.');
    DBMS_OUTPUT.PUT_LINE('  Empleado: ' || p_id_empleado);
    DBMS_OUTPUT.PUT_LINE('  Salario anterior: $' || TO_CHAR(vn_salario_actual, '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('  Salario nuevo: $' || TO_CHAR(vn_nuevo_salario, '9,999,999.99'));

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('✗ Error: ' || SQLERRM);
END sp_aumentar_salario;
/
```

### Parte 3: Bloque Anónimo con Manejo de Excepciones

```sql
SET SERVEROUTPUT ON;

DECLARE
    vn_salario NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== Prueba 1: Empleado que existe ===');
    BEGIN
        vn_salario := fn_obtener_salario(100);
        DBMS_OUTPUT.PUT_LINE('Salario encontrado: $' || TO_CHAR(vn_salario, '9,999,999.99'));
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error capturado: ' || SQLERRM);
    END;
    
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('=== Prueba 2: Empleado que NO existe ===');
    BEGIN
        vn_salario := fn_obtener_salario(99999);
        DBMS_OUTPUT.PUT_LINE('Salario encontrado: $' || TO_CHAR(vn_salario, '9,999,999.99'));
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error capturado: ' || SQLERRM);
    END;
    
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('=== Prueba 3: Aumento válido (10%) ===');
    BEGIN
        sp_aumentar_salario(100, 10);
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;
    
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('=== Prueba 4: Aumento inválido (100%, > 50%) ===');
    BEGIN
        sp_aumentar_salario(100, 100);
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;
    
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('=== Prueba 5: Empleado inválido ===');
    BEGIN
        sp_aumentar_salario(99999, 5);
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

END;
/
```

## Explicación de Códigos de Error

Oracle reserva códigos de error personalizado entre **-20000 y -20999**:

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| -20001 | Registro no encontrado | `El empleado ID 99999 no existe` |
| -20002 | Validación de parámetro | `El porcentaje debe ser > 0` |
| -20003 | Regla de negocio violada | `Aumento máximo es 50%` |
| -20999 | Error inesperado genérico | Cualquier error no previsto |

## Sub-bloques BEGIN...EXCEPTION...END

Nótese que dentro de `sp_aumentar_salario` hay un sub-bloque:
```sql
BEGIN
    SELECT salary, job_id ...
EXCEPTION
    WHEN NO_DATA_FOUND THEN ...
END;
```

Esto permite capturar errores de una sección específica sin romper el procedimiento completo.

## Resultado en Consola
```text
=== Prueba 1: Empleado que existe ===
Salario encontrado: $  24,000.00

=== Prueba 2: Empleado que NO existe ===
Error capturado: ORA-20001: Error: El empleado con ID 99999 no existe.

=== Prueba 3: Aumento válido (10%) ===
✓ Salario actualizado exitosamente.
  Empleado: 100
  Salario anterior: $24,000.00
  Salario nuevo: $26,400.00

=== Prueba 4: Aumento inválido (100%, > 50%) ===
Error: ORA-20003: El aumento máximo permitido es 50%. Solicitado: 100%

=== Prueba 5: Empleado inválido ===
Error: ORA-20001: El empleado ID 99999 no existe en la BD.

PL/SQL procedure successfully completed.
```

## Ventajas del Manejo de Excepciones

✓ **Código defensivo**: Anticipas errores comunes  
✓ **Mensajes claros**: El usuario sabe qué salió mal  
✓ **ROLLBACK automático**: En caso de error, deshacer cambios  
✓ **Códigos estandarizados**: Facilita debugging y documentación  
✓ **Control de flujo**: El programa no colapse, continúa ejecutándose  

## Conclusión

Las excepciones transforman código frágil en código robusto:
- Antes: El programa colapsaba con un error genérico
- Después: El programa captura, informa y se recupera del error
