---
title: 'Ejercicio 4: Importar Información y Tablas'
description: 'Creación de tablas a partir de datos existentes en Oracle Database.'
pubDate: 'Feb 9 2026'
icon: 'web'
tags: ['Oracle', 'DDL']
---

## Enunciado
Crear una nueva tabla importando la estructura y los datos de una tabla existente en el esquema HR de Oracle Database.

## Contexto
En Oracle Database, una de las formas más eficientes de crear tablas con datos existentes es mediante la sentencia `CREATE TABLE ... AS SELECT` (CTAS). Esta técnica permite:

- **Copiar estructura**: Replica automáticamente la estructura de columnas de la tabla origen, incluyendo tipos de datos y precisión
- **Importar datos**: Copia todos los registros que cumplan con la condición del SELECT en una sola operación
- **Optimización**: Es más rápida que crear la tabla vacía y luego insertar los datos con INSERT
- **Flexibilidad**: Permite seleccionar columnas específicas, aplicar filtros o realizar transformaciones durante la creación

Esta técnica es comúnmente utilizada para crear tablas de respaldo, tablas temporales de trabajo, o para migrar datos entre esquemas en Oracle.

## Solución Oracle
```sql
CREATE TABLE Employees
AS SELECT *
FROM HR.employees;
```

## Explicación
La sentencia anterior crea una nueva tabla llamada `Employees` en tu esquema actual, copiando toda la estructura y los datos de la tabla `employees` del esquema `HR`. El asterisco (*) indica que se copiarán todas las columnas con sus datos.

**Nota**: Las restricciones como claves primarias, índices y constraints no se copian automáticamente con CTAS, solo la estructura básica de columnas y los datos.
