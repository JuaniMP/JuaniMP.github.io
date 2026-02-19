---
title: 'PL/SQL 10: FOR para Raíz Entera'
description: 'Encontrar si existe raíz cuadrada entera de un número X.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
A partir de un valor `X`, encontrar un número entero cuyo cuadrado sea igual a `X`.

## Solución PL/SQL
```sql
SET SERVEROUTPUT ON;

DECLARE
    vn_x NUMBER := 64;
BEGIN
    FOR i IN 1..vn_x LOOP
        IF i * i = vn_x THEN
            DBMS_OUTPUT.PUT_LINE('La raíz es: ' || i);
            RETURN;
        END IF;
    END LOOP;

    DBMS_OUTPUT.PUT_LINE('No hay raíz entera');
END;
/
```

## Explicación
- Recorre números desde `1` hasta `X`.
- Si encuentra `i * i = X`, imprime la raíz y termina con `RETURN`.
- Si no encuentra coincidencia, informa que no hay raíz entera.

## Resultado en consola
```text
Para X = 64:
La raíz es: 8

PL/SQL procedure successfully completed.
```
