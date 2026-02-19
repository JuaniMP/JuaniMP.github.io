---
title: 'PL/SQL 09: WHILE para MCM'
description: 'Calcular el mínimo común múltiplo usando el algoritmo de Euclides.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
Calcular el **MCM** de dos números cualesquiera usando un ciclo `WHILE`.

## Solución PL/SQL
```sql
SET SERVEROUTPUT ON;

DECLARE
    a   NUMBER := 12;
    b   NUMBER := 18;
    mcd NUMBER;
    mcm NUMBER;
    x   NUMBER;
    y   NUMBER;
BEGIN
    x := a;
    y := b;

    WHILE y != 0 LOOP
        mcd := MOD(x, y);
        x := y;
        y := mcd;
    END LOOP;

    mcd := x;
    mcm := (a * b) / mcd;

    DBMS_OUTPUT.PUT_LINE('El MCM es: ' || mcm);
END;
/
```

## Explicación
- Primero calcula el `MCD` con Euclides (`MOD` en un `WHILE`).
- Luego usa la fórmula: `MCM = (a * b) / MCD`.

## Resultado en consola
```text
El MCM es: 36

PL/SQL procedure successfully completed.
```
