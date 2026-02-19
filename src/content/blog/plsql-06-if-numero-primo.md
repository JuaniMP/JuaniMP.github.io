---
title: 'PL/SQL 06: IF para Número Primo'
description: 'Validar si el día actual es primo usando IF en un bloque anónimo.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
Con la fecha del sistema, calcular si el día actual es un número primo. Si lo es, imprimir **HOLA PRIMO**.

## Solución PL/SQL
```sql
SET SERVEROUTPUT ON;

DECLARE
    vd_current_date NUMBER := TO_NUMBER(TO_CHAR(SYSDATE, 'DD'));
BEGIN
    IF vd_current_date IN (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31) THEN
        DBMS_OUTPUT.PUT_LINE('HOLA PRIMO');
    ELSE
        DBMS_OUTPUT.PUT_LINE('NO ES PRIMO');
    END IF;
END;
/
```

## Explicación
- `TO_CHAR(SYSDATE, 'DD')` obtiene el día del mes.
- Se convierte a número y se evalúa con `IF`.
- Si el día pertenece a la lista de primos válidos (1–31), imprime el mensaje correspondiente.

## Resultado en consola
```text
Depende del día actual del sistema:
- Si el día es primo: HOLA PRIMO
- Si el día no es primo: NO ES PRIMO

PL/SQL procedure successfully completed.
```
