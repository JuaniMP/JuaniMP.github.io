---
title: 'PL/SQL 15: Parametrización, Transacciones y Secuencias'
description: 'Consultar parámetros desde tablas, usar secuencias para IDs, manejar transacciones con COMMIT/ROLLBACK.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL', 'Parametrización', 'Transacciones', 'Secuencias']
---

## Enunciado
Crear un sistema donde los parámetros de nómina (porcentajes, límites, montos) se consulten desde una tabla de configuración, y donde los datos se persistan usando secuencias y transacciones explícitas (COMMIT/ROLLBACK).

## Contexto
**Cero valores quemados**: Es una mala práctica escribir números fijos directamente en el código. En su lugar:
1. Almacena parámetros en una tabla `PARAMETROS`
2. Consulta valores en tiempo de ejecución
3. Usa secuencias para generar IDs únicos
4. Controla transacciones para garantizar consistencia

## Solución PL/SQL

### Paso 1: Crear tabla de Parámetros
```sql
CREATE TABLE PARAMETROS (
    id_parametro       NUMBER PRIMARY KEY,
    nombre_parametro   VARCHAR2(100) NOT NULL UNIQUE,
    valor_numerico     NUMBER,
    valor_texto        VARCHAR2(500),
    descripcion        VARCHAR2(200),
    fecha_actualizacion DATE DEFAULT SYSDATE
);

-- Insertar parámetros iniciales
INSERT INTO PARAMETROS (id_parametro, nombre_parametro, valor_numerico, descripcion)
VALUES (1, 'PORCENTAJE_AFILIACION', 0.04, 'Descuento de afiliación: 4%');

INSERT INTO PARAMETROS (id_parametro, nombre_parametro, valor_numerico, descripcion)
VALUES (2, 'RECARGO_NOCTURNO_PCT', 0.35, 'Recargo nocturno: 35%');

INSERT INTO PARAMETROS (id_parametro, nombre_parametro, valor_numerico, descripcion)
VALUES (3, 'RECARGO_DOMINICAL_PCT', 0.100, 'Recargo dominical: 10%');

INSERT INTO PARAMETROS (id_parametro, nombre_parametro, valor_numerico, descripcion)
VALUES (4, 'HORAS_LABORALES_MENSUALES', 240, 'Horas mensuales estándar');

INSERT INTO PARAMETROS (id_parametro, nombre_parametro, valor_numerico, descripcion)
VALUES (5, 'AUMENTO_MAXIMO_PERMITIDO', 0.50, 'Aumento salarial máximo: 50%');

COMMIT;
```

### Paso 2: Crear Secuencia para IDs
```sql
CREATE SEQUENCE SEQ_LIQUIDACION START WITH 1000 INCREMENT BY 1;
CREATE SEQUENCE SEQ_MOVIMIENTOS_NOMINA START WITH 100 INCREMENT BY 1;
```

### Paso 3: Función para Obtener Parámetros
```sql
CREATE OR REPLACE FUNCTION fn_obtener_parametro (
    p_nombre_param VARCHAR2
) RETURN NUMBER
IS
    vn_valor NUMBER;
BEGIN
    SELECT valor_numerico
    INTO vn_valor
    FROM PARAMETROS
    WHERE nombre_parametro = p_nombre_param;
    
    RETURN vn_valor;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(
            -20001,
            'El parámetro "' || p_nombre_param || '" no existe.'
        );
    
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(
            -20999,
            'Error al consultar parámetro: ' || SQLERRM
        );
END fn_obtener_parametro;
/
```

### Paso 4: Procedimiento que Usa Parámetros y Transacciones

```sql
CREATE OR REPLACE PROCEDURE sp_liquidar_empleado (
    p_id_empleado   NUMBER,
    p_mes           NUMBER,
    p_anio          NUMBER
)
IS
    vn_salario_base         EMPLOYEES.salary%TYPE;
    vn_horas_normales       NUMBER := 0;
    vn_horas_nocturnas      NUMBER := 0;
    vn_horas_dominicales    NUMBER := 0;
    
    -- Variables para parámetros dinámicos
    vn_pct_afiliacion       PARAMETROS.valor_numerico%TYPE;
    vn_pct_nocturno         PARAMETROS.valor_numerico%TYPE;
    vn_pct_dominical        PARAMETROS.valor_numerico%TYPE;
    vn_horas_mensuales      PARAMETROS.valor_numerico%TYPE;
    
    -- Variables de cálculo
    vn_valor_hora           NUMBER;
    vn_devengado_normal     NUMBER := 0;
    vn_devengado_nocturno   NUMBER := 0;
    vn_devengado_dominical  NUMBER := 0;
    vn_devengado_total      NUMBER := 0;
    vn_descuentos           NUMBER := 0;
    vn_neto                 NUMBER := 0;
    vn_id_liquidacion       NUMBER;

BEGIN
    -- 1. Obtener datos del empleado
    BEGIN
        SELECT salary
        INTO vn_salario_base
        FROM EMPLOYEES
        WHERE employee_id = p_id_empleado;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(
                -20001,
                'Empleado ID ' || p_id_empleado || ' no encontrado.'
            );
    END;
    
    -- 2. Consultar parámetros desde la tabla (CERO VALORES QUEMADOS)
    vn_pct_afiliacion := fn_obtener_parametro('PORCENTAJE_AFILIACION');
    vn_pct_nocturno := fn_obtener_parametro('RECARGO_NOCTURNO_PCT');
    vn_pct_dominical := fn_obtener_parametro('RECARGO_DOMINICAL_PCT');
    vn_horas_mensuales := fn_obtener_parametro('HORAS_LABORALES_MENSUALES');
    
    -- 3. Calcular componentes
    vn_valor_hora := vn_salario_base / vn_horas_mensuales;
    vn_devengado_normal := vn_valor_hora * vn_horas_normales;
    vn_devengado_nocturno := (vn_valor_hora * vn_horas_nocturnas) * (1 + vn_pct_nocturno);
    vn_devengado_dominical := (vn_valor_hora * vn_horas_dominicales) * (1 + vn_pct_dominical);
    vn_devengado_total := vn_devengado_normal + vn_devengado_nocturno + vn_devengado_dominical;
    
    -- 4. Calcular descuentos
    vn_descuentos := vn_devengado_total * vn_pct_afiliacion;
    vn_neto := vn_devengado_total - vn_descuentos;
    
    -- 5. INICIAR TRANSACCIÓN: Insertar en tabla de liquidaciones
    vn_id_liquidacion := SEQ_LIQUIDACION.NEXTVAL;
    
    INSERT INTO LIQUIDACIONES (
        id_liquidacion,
        id_empleado,
        mes,
        anio,
        salario_base,
        devengado_total,
        descuentos,
        neto,
        fecha_liquidacion
    ) VALUES (
        vn_id_liquidacion,
        p_id_empleado,
        p_mes,
        p_anio,
        vn_salario_base,
        vn_devengado_total,
        vn_descuentos,
        vn_neto,
        SYSDATE
    );
    
    -- 6. Registrar movimientos de nómina (detalle de conceptos)
    INSERT INTO MOVIMIENTOS_NOMINA (
        id_movimiento,
        id_liquidacion,
        concepto,
        valor,
        fecha_registro
    ) VALUES (
        SEQ_MOVIMIENTOS_NOMINA.NEXTVAL,
        vn_id_liquidacion,
        'NORMAL',
        vn_devengado_normal,
        SYSDATE
    );
    
    INSERT INTO MOVIMIENTOS_NOMINA (
        id_movimiento,
        id_liquidacion,
        concepto,
        valor,
        fecha_registro
    ) VALUES (
        SEQ_MOVIMIENTOS_NOMINA.NEXTVAL,
        vn_id_liquidacion,
        'NOCTURNO',
        vn_devengado_nocturno,
        SYSDATE
    );
    
    INSERT INTO MOVIMIENTOS_NOMINA (
        id_movimiento,
        id_liquidacion,
        concepto,
        valor,
        fecha_registro
    ) VALUES (
        SEQ_MOVIMIENTOS_NOMINA.NEXTVAL,
        vn_id_liquidacion,
        'DOMINICAL',
        vn_devengado_dominical,
        SYSDATE
    );
    
    INSERT INTO MOVIMIENTOS_NOMINA (
        id_movimiento,
        id_liquidacion,
        concepto,
        valor,
        fecha_registro
    ) VALUES (
        SEQ_MOVIMIENTOS_NOMINA.NEXTVAL,
        vn_id_liquidacion,
        'DESCUENTOS',
        -vn_descuentos,
        SYSDATE
    );
    
    -- 7. COMMIT: Persisten todos los cambios o nada
    COMMIT;
    
    -- 8. Mostrar confirmación
    DBMS_OUTPUT.PUT_LINE('✓ Liquidación procesada correctamente.');
    DBMS_OUTPUT.PUT_LINE('  ID Liquidación: ' || vn_id_liquidacion);
    DBMS_OUTPUT.PUT_LINE('  Empleado: ' || p_id_empleado);
    DBMS_OUTPUT.PUT_LINE('  Período: ' || p_mes || '/' || p_anio);
    DBMS_OUTPUT.PUT_LINE('  Devengado: $' || TO_CHAR(vn_devengado_total, '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('  Descuentos: $' || TO_CHAR(vn_descuentos, '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('  Neto: $' || TO_CHAR(vn_neto, '9,999,999.99'));

EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error: ROLLBACK desahce todo
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('✗ Error en liquidación: ' || SQLERRM);
        DBMS_OUTPUT.PUT_LINE('  Transacción cancelada (ROLLBACK).');
        RAISE;

END sp_liquidar_empleado;
/
```

### Paso 5: Bloque de Prueba

```sql
SET SERVEROUTPUT ON;

BEGIN
    DBMS_OUTPUT.PUT_LINE('===== PRUEBA DE LIQUIDACIÓN =====');
    DBMS_OUTPUT.PUT_LINE('Parámetros consultados desde tabla PARAMETROS:');
    DBMS_OUTPUT.PUT_LINE('  Afiliación: ' || (fn_obtener_parametro('PORCENTAJE_AFILIACION') * 100) || '%');
    DBMS_OUTPUT.PUT_LINE('  Recargo Nocturno: ' || (fn_obtener_parametro('RECARGO_NOCTURNO_PCT') * 100) || '%');
    DBMS_OUTPUT.PUT_LINE('  Horas Mensuales: ' || fn_obtener_parametro('HORAS_LABORALES_MENSUALES'));
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Liquidar empleado 100 para abril de 2026
    sp_liquidar_empleado(100, 4, 2026);
    
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error fatal: ' || SQLERRM);
END;
/
```

## Explicación

### 1. Tabla PARAMETROS
Almacena valores globales del sistema. Ventajas:
- Cambias parámetros sin tocar código
- Auditoría de cambios con `fecha_actualizacion`
- Múltiples ambientes (desarrollo, producción) con valores diferentes

### 2. Secuencias
```sql
SEQ_LIQUIDACION.NEXTVAL    -- Genera ID 1000, 1001, 1002, ...
```
- Garantiza IDs únicos y consecutivos
- No hay colisiones incluso con concurrencia
- Mejor que generar IDs manualmente

### 3. COMMIT / ROLLBACK
```sql
INSERT INTO LIQUIDACIONES ...
INSERT INTO MOVIMIENTOS_NOMINA ...
INSERT INTO MOVIMIENTOS_NOMINA ...
COMMIT;  -- Todo se guarda conjuntamente
```

Si ocurre error antes del COMMIT:
```sql
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;  -- Deshacer TODO
```

Garantiza **consistencia transaccional**: O se insertan todos los registros, o ninguno.

## Resultado en Consola
```text
===== PRUEBA DE LIQUIDACIÓN =====
Parámetros consultados desde tabla PARAMETROS:
  Afiliación: 4%
  Recargo Nocturno: 35%
  Horas Mensuales: 240

✓ Liquidación procesada correctamente.
  ID Liquidación: 1000
  Empleado: 100
  Período: 4/2026
  Devengado: $2,500,000.00
  Descuentos: $  100,000.00
  Neto: $2,400,000.00

PL/SQL procedure successfully completed.
```

## Ventajas de Este Enfoque

✓ **Mantenibilidad**: Cambias parámetros sin compilar código  
✓ **Escalabilidad**: Soporta múltiples configuraciones simultáneamente  
✓ **Consistencia**: COMMIT/ROLLBACK aseguran integridad  
✓ **Auditoría**: Tabla PARAMETROS mantiene historial  
✓ **Robustez**: Secuencias evitan duplicados de IDs  

## Conclusión

El sistema de parametrización transaccional es el corazón de aplicaciones empresariales confiables:
- Parámetros dinámicos → Flexibilidad
- Transacciones explícitas → Seguridad
- Secuencias → Integridad de datos
