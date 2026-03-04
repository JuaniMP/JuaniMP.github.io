---
title: 'PL/SQL 07: GOTO con Etiquetas'
description: 'Control de flujo con GOTO para evaluar si el día del sistema es primo.'
pubDate: 'Feb 18 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL']
---

## Enunciado
Resolver la misma validación de número primo, pero usando `GOTO` y etiquetas.

## Solución PL/SQL
```sql
SET SERVEROUTPUT ON;

DECLARE
    vd_current_date NUMBER := TO_NUMBER(TO_CHAR(SYSDATE, 'DD'));
BEGIN
    IF vd_current_date IN (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31) THEN
        GOTO primo;
    ELSE
        GOTO no_primo;
    END IF;

<<primo>>
    DBMS_OUTPUT.PUT_LINE('HOLA PRIMO');
    RETURN;

<<no_primo>>
    DBMS_OUTPUT.PUT_LINE('NO ES PRIMO');
END;
/
```

## Explicación
- `GOTO` transfiere la ejecución a una etiqueta (`<<primo>>` o `<<no_primo>>`).
- Se comporta como una bifurcación de flujo (similar a un `switch` simple con saltos).
- Se usa `RETURN` después del bloque primo para evitar que siga ejecutando la siguiente etiqueta.

## Resultado en consola
```text
Depende del día actual del sistema:
- Si el día es primo: HOLA PRIMO
- Si el día no es primo: NO ES PRIMO

PL/SQL procedure successfully completed.
```
