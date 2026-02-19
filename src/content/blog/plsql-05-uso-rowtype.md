---
title: 'PL/SQL 05: Uso de %ROWTYPE'
description: 'Cargar una fila completa de HR.EMPLOYEES en un registro.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
Consultar todos los datos del empleado con `EMPLOYEE_ID = 110` usando `%ROWTYPE` y mostrar su nombre.

## Solución Oracle
```sql
SET SERVEROUTPUT ON;

DECLARE
    vv_empleado HR.EMPLOYEES%ROWTYPE;
BEGIN
    SELECT *
      INTO vv_empleado
      FROM HR.EMPLOYEES
     WHERE EMPLOYEE_ID = 110;

    DBMS_OUTPUT.PUT_LINE('El nombre del empleado es: ' || vv_empleado.FIRST_NAME);
END;
/
```

## Explicación
- `%ROWTYPE` crea una variable con todas las columnas de la tabla.
- Puedes acceder a cada campo con notación punto, por ejemplo `vv_empleado.FIRST_NAME`.

## Resultado en consola
```text
El nombre del empleado es: John

PL/SQL procedure successfully completed.
```
