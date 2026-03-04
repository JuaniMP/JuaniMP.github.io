---
title: 'PL/SQL 04: Uso de %TYPE'
description: 'Heredar tipos de datos desde columnas de la tabla HR.EMPLOYEES.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
Realizar la misma consulta del ejercicio anterior, pero declarando variables con `%TYPE` para heredar tipos de datos de la tabla `HR.EMPLOYEES`.

## Solución Oracle
```sql
SET SERVEROUTPUT ON;

DECLARE
    vv_nombre   HR.EMPLOYEES.FIRST_NAME%TYPE;
    vv_apellido HR.EMPLOYEES.LAST_NAME%TYPE;
BEGIN
    SELECT FIRST_NAME, LAST_NAME
      INTO vv_nombre, vv_apellido
      FROM HR.EMPLOYEES
     WHERE EMPLOYEE_ID = 110;

    DBMS_OUTPUT.PUT_LINE('El nombre del empleado es: ' || vv_nombre || ' ' || vv_apellido);
END;
/
```

## Explicación
- `%TYPE` toma automáticamente el tipo de dato de la columna.
- Evita cambios manuales cuando el esquema se modifica.
- Mantiene el bloque más robusto frente a cambios de longitud o tipo en la tabla.

## Resultado en consola
```text
El nombre del empleado es: John Chen

PL/SQL procedure successfully completed.
```
