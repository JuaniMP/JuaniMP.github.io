---
title: 'PL/SQL 02: Asignación de Variable'
description: 'Declarar variable, asignar valor e imprimir en consola.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
Declarar una variable de texto, asignarle el valor **Hello World** y mostrarlo en consola.

## Solución Oracle
```sql
SET SERVEROUTPUT ON;

DECLARE
    vv_miPrimeraVariable VARCHAR2(50);
BEGIN
    vv_miPrimeraVariable := 'Hello World';
    DBMS_OUTPUT.PUT_LINE(vv_miPrimeraVariable);
END;
/
```

## Explicación
- `DECLARE` se usa para crear variables locales.
- `:=` asigna el valor a la variable.
- `PUT_LINE` muestra el contenido en consola.

## Resultado en consola
```text
Hello World

PL/SQL procedure successfully completed.
```
