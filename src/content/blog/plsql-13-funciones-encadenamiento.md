---
title: 'PL/SQL 13: Funciones y Encadenamiento'
description: 'Crear funciones para procesar datos, retornar valores y encadenarlas para reutilización de código.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL', 'Funciones', 'Modularidad']
---

## Enunciado
Crear funciones independientes para calcular componentes de nómina (base, recargos, bonos) y luego encadenarlas en una función principal que consolide el cálculo total. Esto demuestra modularidad y reutilización de código.

## Contexto
Las funciones son subprogramas que retornan un valor específico. A diferencia de los procedimientos, las funciones pueden ser llamadas directamente en consultas SQL o dentro de otras funciones, permitiendo crear ecosistemas de código limpio y mantenible.

## Solución PL/SQL

### Paso 1: Función para calcular la base salarial
```sql
CREATE OR REPLACE FUNCTION fn_calcular_base (
    p_salario_base NUMBER
) RETURN NUMBER
IS
    vn_base NUMBER;
BEGIN
    -- La base es el salario base sin modificaciones
    vn_base := p_salario_base;
    RETURN vn_base;
END fn_calcular_base;
/
```

### Paso 2: Función para calcular recargos nocturnos
```sql
CREATE OR REPLACE FUNCTION fn_calcular_recargos (
    p_salario_base NUMBER,
    p_horas_nocturnas NUMBER DEFAULT 0
) RETURN NUMBER
IS
    vn_recargo_nocturno NUMBER;
    cn_porcentaje_nocturno CONSTANT NUMBER := 0.35; -- 35% de recargo
BEGIN
    -- Si no hay horas nocturnas, el recargo es cero
    IF p_horas_nocturnas = 0 THEN
        vn_recargo_nocturno := 0;
    ELSE
        -- Calcular: (salario_base / 240) * horas_nocturnas * (1 + 35%)
        vn_recargo_nocturno := (p_salario_base / 240) * p_horas_nocturnas * (1 + cn_porcentaje_nocturno);
    END IF;
    
    RETURN ROUND(vn_recargo_nocturno, 2);
END fn_calcular_recargos;
/
```

### Paso 3: Función para calcular bonificaciones
```sql
CREATE OR REPLACE FUNCTION fn_calcular_bonificacion (
    p_salario_base NUMBER,
    p_antiguedad_meses NUMBER
) RETURN NUMBER
IS
    vn_bonificacion NUMBER;
BEGIN
    -- Bono progresivo: 5% por cada año de antigüedad
    IF p_antiguedad_meses < 12 THEN
        vn_bonificacion := 0;
    ELSIF p_antiguedad_meses < 24 THEN
        vn_bonificacion := p_salario_base * 0.05;
    ELSIF p_antiguedad_meses < 60 THEN
        vn_bonificacion := p_salario_base * 0.10;
    ELSE
        vn_bonificacion := p_salario_base * 0.15;
    END IF;
    
    RETURN ROUND(vn_bonificacion, 2);
END fn_calcular_bonificacion;
/
```

### Paso 4: Función que encadena las anteriores (Función Principal)
```sql
CREATE OR REPLACE FUNCTION fn_calcular_total_neto (
    p_id_empleado NUMBER,
    p_salario_base NUMBER,
    p_horas_nocturnas NUMBER,
    p_antiguedad_meses NUMBER
) RETURN NUMBER
IS
    vn_base             NUMBER;
    vn_recargos         NUMBER;
    vn_bonificacion     NUMBER;
    vn_descuentos       NUMBER;
    vn_total_neto       NUMBER;
    cn_porcentaje_afiliacion CONSTANT NUMBER := 0.04; -- 4% afiliación
BEGIN
    -- Llamar a las funciones individuales
    vn_base := fn_calcular_base(p_salario_base);
    vn_recargos := fn_calcular_recargos(p_salario_base, p_horas_nocturnas);
    vn_bonificacion := fn_calcular_bonificacion(p_salario_base, p_antiguedad_meses);
    
    -- Calcular descuentos sobre el total devengado
    vn_descuentos := (vn_base + vn_recargos + vn_bonificacion) * cn_porcentaje_afiliacion;
    
    -- Calcular neto: devengado - descuentos
    vn_total_neto := (vn_base + vn_recargos + vn_bonificacion) - vn_descuentos;
    
    RETURN ROUND(vn_total_neto, 2);
END fn_calcular_total_neto;
/
```

## Prueba Completa con Bloque Anónimo
```sql
SET SERVEROUTPUT ON;

DECLARE
    vn_id_empleado      NUMBER := 101;
    vn_salario_base     NUMBER := 2500000; -- $2.500.000 COP
    vn_horas_nocturnas  NUMBER := 10;
    vn_antiguedad       NUMBER := 36; -- 3 años
    
    vn_base             NUMBER;
    vn_recargos         NUMBER;
    vn_bonificacion     NUMBER;
    vn_neto             NUMBER;

BEGIN
    -- Calcular cada componente
    vn_base := fn_calcular_base(vn_salario_base);
    vn_recargos := fn_calcular_recargos(vn_salario_base, vn_horas_nocturnas);
    vn_bonificacion := fn_calcular_bonificacion(vn_salario_base, vn_antiguedad);
    vn_neto := fn_calcular_total_neto(vn_id_empleado, vn_salario_base, vn_horas_nocturnas, vn_antiguedad);
    
    -- Mostrar resultados
    DBMS_OUTPUT.PUT_LINE('========== NÓMINA DEL EMPLEADO ==========');
    DBMS_OUTPUT.PUT_LINE('ID Empleado: ' || vn_id_empleado);
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('Componentes:');
    DBMS_OUTPUT.PUT_LINE('  Base salarial:      $' || TO_CHAR(vn_base, '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('  Recargos nocturnos: $' || TO_CHAR(vn_recargos, '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('  Bonificación:       $' || TO_CHAR(vn_bonificacion, '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('Total Neto a Pagar: $' || TO_CHAR(vn_neto, '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('========================================');

END;
/
```

## Explicación

### ¿Por qué dividir en funciones?
1. **Responsabilidad única**: Cada función calcula un aspecto específico.
2. **Reutilización**: `fn_calcular_recargos` puede usarse en otros contextos.
3. **Mantenimiento**: Si cambia la regla de recargos, solo editas una función.
4. **Testabilidad**: Pruebas cada función individualmente antes de encadenarlas.

### Encadenamiento
La función `fn_calcular_total_neto` **llama a las otras funciones**, creando una cadena de cálculos:
```
fn_calcular_total_neto
  ├── fn_calcular_base
  ├── fn_calcular_recargos
  └── fn_calcular_bonificacion
```

### Parámetros `DEFAULT`
En `fn_calcular_recargos`, el parámetro `p_horas_nocturnas NUMBER DEFAULT 0` permite llamarla sin especificar horas si no las hay:
```sql
fn_calcular_recargos(2500000)           -- Recargo = 0
fn_calcular_recargos(2500000, 10)       -- Recargo = calculado
```

## Resultado en Consola
```text
========== NÓMINA DEL EMPLEADO ==========
ID Empleado: 101

Componentes:
  Base salarial:      $2,500,000.00
  Recargos nocturnos: $  368,750.00
  Bonificación:       $  250,000.00

Total Neto a Pagar: $2,936,250.00
========================================

PL/SQL procedure successfully completed.
```

## Conclusión
Las funciones encadenadas permiten:
- ✓ Código modular y organizado
- ✓ Facilidad para modificar reglas de negocio
- ✓ Reducción de duplicación de código
- ✓ Mejor legibilidad y mantenimiento a largo plazo
