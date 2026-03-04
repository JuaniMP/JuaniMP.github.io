---
title: 'PL/SQL 01: Hola Mundo'
description: 'Primer bloque anónimo en Oracle con DBMS_OUTPUT.PUT_LINE.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
Primer bloque anónimo en PL/SQL para mostrar en consola el mensaje **Hello, world**.

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
