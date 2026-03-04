---
title: 'PL/SQL 03: SELECT INTO por Employee ID'
description: 'Consultar nombre y apellido de un empleado por su ID.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
Buscar el nombre y apellido del empleado con `EMPLOYEE_ID = 110` usando `SELECT ... INTO`.

## Solución Oracle
```sql
SET SERVEROUTPUT ON;

DECLARE
    vv_nombre   VARCHAR2(50);
    vv_apellido VARCHAR2(50);
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
- `SELECT ... INTO ...` guarda columnas en variables.
- El `WHERE EMPLOYEE_ID = 110` asegura traer una sola fila.
- Si no hay fila, ocurre `NO_DATA_FOUND`; si hay más de una, `TOO_MANY_ROWS`.

## Resultado en consola
```text
El nombre del empleado es: John Chen

PL/SQL procedure successfully completed.
```
