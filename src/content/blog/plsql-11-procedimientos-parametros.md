---
title: 'PL/SQL 11: Procedimientos con Parámetros y Default'
description: 'Crear, ejecutar y eliminar procedimientos almacenados en Oracle.'
pubDate: 'Mar 4 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL', 'Procedimientos']
---

## Enunciado
Crear un procedimiento almacenado para saludar, ejecutarlo con y sin parámetro, y luego eliminarlo.

## Contexto
Clase del **23/02/2026**. Se practicó:
- `CREATE OR REPLACE PROCEDURE`
- Parámetros de entrada (`IN`)
- Valores por defecto (`DEFAULT`)
- Ejecución desde bloque anónimo
- Eliminación de objetos con `DROP PROCEDURE`

## Solución PL/SQL
```sql
SET SERVEROUTPUT ON;

CREATE OR REPLACE PROCEDURE sp_saludar (
    param_texto IN VARCHAR2 DEFAULT 'Freya'
)
/*
    Autor: Juanita Mejía
    Fecha: 23/02/2026
    Descripción: este procedimiento genera un texto saludando a alguien.
*/
IS
    vv_texto_concatenado VARCHAR2(100);
BEGIN
    vv_texto_concatenado := 'Hola Mundo ' || param_texto || ' tu mamá';
    DBMS_OUTPUT.PUT_LINE(vv_texto_concatenado);
END sp_saludar;
/

-- Respetando el parámetro de entrada
BEGIN
    sp_saludar('Javier');
END;
/

-- Lanzando el valor por defecto
BEGIN
    sp_saludar();
END;
/

-- Borrar el procedimiento
DROP PROCEDURE sp_saludar;
```

## Consulta adicional (viernes previo al cierre de mes)
```sql
SELECT NEXT_DAY(LAST_DAY(SYSDATE) - 7, 'VIERNES') AS viernes_referencia
FROM DUAL;
```

## Explicación
- `CREATE OR REPLACE` crea el procedimiento o lo reemplaza si ya existe.
- `DEFAULT 'Freya'` permite llamar `sp_saludar()` sin enviar argumento.
- `DBMS_OUTPUT.PUT_LINE` imprime el resultado en consola.
- `DROP PROCEDURE` elimina el objeto cuando ya no se necesita.
- `NEXT_DAY(LAST_DAY(SYSDATE)-7, 'VIERNES')` ayuda a obtener un viernes de referencia del mes actual.

## Resultado en consola
```text
Hola Mundo Javier tu mamá
Hola Mundo Freya tu mamá

PL/SQL procedure successfully completed.
```
