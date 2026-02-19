---
title: 'PL/SQL 01: Hola Mundo'
description: 'Primer bloque anónimo en Oracle con DBMS_OUTPUT.PUT_LINE.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
Mostrar en consola el mensaje **Hello, world** utilizando un bloque anónimo de PL/SQL.

## Solución Oracle
```sql
SET SERVEROUTPUT ON;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Hello, world');
END;
/
```

## Explicación
- `SET SERVEROUTPUT ON` habilita la impresión por consola.
- `BEGIN ... END;` define un bloque anónimo.
- `DBMS_OUTPUT.PUT_LINE` imprime el texto.

## Resultado en consola
```text
Hello, world

PL/SQL procedure successfully completed.
```
