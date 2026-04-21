---
title: 'PL/SQL 00: Estándares de Nomenclatura y Abreviaciones'
description: 'Convenciones de nombrado para variables, constantes y objetos de base de datos en PL/SQL.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL', 'Convenciones']
---

## Enunciado
Establecer y seguir convenciones consistentes de nomenclatura en PL/SQL para mantener el código legible, ordenado y fácil de mantener a través de diferentes subprogramas y esquemas.

## Convenciones Implementadas

### 1. Variables Locales (Prefijo `v`)
Se utiliza la letra `v` seguida de la inicial del tipo de dato, un guion bajo `_` y el nombre descriptivo:

- **`vn_xxxxx`**: Variable Numérica
  - Ejemplo: `vn_salario`, `vn_base_q`, `vn_sanciones`
  
- **`vv_xxxxx`**: Variable Varchar / Cadena de texto
  - Ejemplo: `vv_contrato`, `vv_estado`, `vv_nombre`
  
- **`vd_xxxxx`**: Variable Date / Fecha
  - Ejemplo: `vd_ingreso`, `vd_nacimiento`
  
- **`vdo_xxxxx`**: Variable Double / Decimal de alta precisión
  - Ejemplo: `vdo_promedio`, `vdo_interes`

### 2. Constantes (Prefijo `c`)
- **`cn_xxxxx`**: Constante Numérica para valores que no cambian en la ejecución
  - Ejemplo: `cn_tasa_impuesto = 0.19`, `cn_descuento_maximo = 0.15`

### 3. Objetos de Base de Datos
Cada subprograma u objeto en el esquema lleva un prefijo que define su naturaleza:

- **`fn_xxxxx`**: Función (Function)
  - Retorna un valor
  - Ejemplo: `fn_bruto`, `fn_recargos`, `fn_calcular_antiguedad`
  - Máximo 30 caracteres
  
- **`sp_xxxxx`**: Procedimiento Almacenado (Stored Procedure)
  - Ejecuta acciones
  - Ejemplo: `sp_liquidar_empleado`, `sp_actualizar_salario`
  - Máximo 30 caracteres
  
- **`pkg_xxxx`**: Paquete (Package)
  - Agrupa funciones y procedimientos relacionados
  - Ejemplo: `pkg_nomina`, `pkg_rrhh`
  
- **`tgr_xxxx`**: Trigger o Disparador
  - Ejemplo: `tgr_auditoria_empleados`

### 4. Parámetros de Subprogramas
Se utiliza la convención `p_` para parámetros:

- **`p_id_empleado`**, **`p_salario`**, **`p_fecha`**
- Si no se especifica el modo, por defecto se asume como parámetro de entrada (`IN`)
- Ejemplo: `PROCEDURE sp_actualizar_salario(p_id_empleado NUMBER, p_nuevo_salario NUMBER)`

## Ejemplo Práctico Completo

```sql
CREATE OR REPLACE PROCEDURE sp_calcular_nomina(
    p_id_empleado NUMBER,
    p_mes NUMBER,
    p_year NUMBER
) AS
    -- Variables locales
    vn_salario          NUMBER;
    vn_descuentos       NUMBER := 0;
    vn_devengado        NUMBER;
    vv_nombre_empleado  VARCHAR2(100);
    vd_fecha_proceso    DATE;
    vdo_tasa_descuento  DECIMAL(5,2);
    
    -- Constantes
    cn_tasa_impuesto    CONSTANT NUMBER := 0.19;
    cn_maxima_hora      CONSTANT NUMBER := 8;
    
BEGIN
    -- Asignar valores a variables
    vd_fecha_proceso := TRUNC(SYSDATE);
    
    -- Consultar datos del empleado
    SELECT nombre, salario 
    INTO vv_nombre_empleado, vn_salario
    FROM empleados 
    WHERE id_empleado = p_id_empleado;
    
    -- Calcular descuentos
    vdo_tasa_descuento := vn_salario * cn_tasa_impuesto;
    vn_descuentos := ROUND(vdo_tasa_descuento, 2);
    
    -- Calcular devengado
    vn_devengado := vn_salario - vn_descuentos;
    
    -- Registrar en nómina
    INSERT INTO nomina VALUES(
        p_id_empleado,
        vv_nombre_empleado,
        vn_salario,
        vn_descuentos,
        vn_devengado,
        vd_fecha_proceso
    );
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('Nómina procesada para: ' || vv_nombre_empleado);
    DBMS_OUTPUT.PUT_LINE('Devengado: $' || vn_devengado);
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Error: Empleado no encontrado');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLCODE || ' - ' || SQLERRM);
        ROLLBACK;
END sp_calcular_nomina;
/
```

## Ventajas de Estas Convenciones

✓ **Claridad inmediata**: Al leer `vn_salario`, sabes que es una variable numérica  
✓ **Mantenimiento**: Facilita identificar errores de tipo de dato  
✓ **Escalabilidad**: Permite que múltiples desarrolladores trabajen consistentemente  
✓ **Debugging**: Simplifica el seguimiento de variables durante la depuración  
✓ **Documentación viva**: El código se autodocumenta con los prefijos  

## Resultado en Consola

```text
Nómina procesada para: Juan García
Devengado: $8100

PL/SQL procedure successfully completed.
```

## Conclusión

Seguir estas convenciones de nomenclatura desde el inicio del desarrollo garantiza:
- Código más legible y profesional
- Reducción de errores relacionados con tipos de datos
- Facilita la colaboración en equipo
- Acelera el mantenimiento futuro del código
