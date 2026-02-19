---
title: 'PL/SQL 08: LOOP Serie Fibonacci'
description: 'Imprimir la serie Fibonacci menor o igual a 1000 con LOOP.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
En un bloque anónimo, imprimir la serie de Fibonacci con valores menores o iguales a **1000**.

## Solución PL/SQL
```sql
SET SERVEROUTPUT ON;

DECLARE
    vn_actual    NUMBER := 0;
    vn_siguiente NUMBER := 1;
    vn_temporal  NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Serie Fibonacci hasta 1000:');
    DBMS_OUTPUT.PUT_LINE(vn_actual);

    LOOP
        EXIT WHEN vn_siguiente > 1000;
        DBMS_OUTPUT.PUT_LINE(vn_siguiente);

        vn_temporal  := vn_actual + vn_siguiente;
        vn_actual    := vn_siguiente;
        vn_siguiente := vn_temporal;
    END LOOP;
END;
/
```

## Explicación
- Se inicia con `0` y `1`.
- En cada vuelta, se imprime el valor actual y se calcula el siguiente.
- `EXIT WHEN vn_siguiente > 1000` corta el ciclo.

## Resultado en consola
```text
Serie Fibonacci hasta 1000:
0
1
1
2
3
5
8
13
21
34
55
89
144
233
377
610
987

PL/SQL procedure successfully completed.
```
