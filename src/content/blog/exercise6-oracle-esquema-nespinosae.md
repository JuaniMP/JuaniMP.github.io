---
title: 'Ejercicio 6: Exploración del Esquema NESPINOSAE'
description: 'Consulta de tablas base HR y tablas de nómina en el esquema nespinosae.'
pubDate: 'Mar 4 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Oracle', 'Esquemas', 'Nómina']
---

## Enunciado
Explorar las tablas del esquema `NESPINOSAE`, incluyendo tablas heredadas de HR y tablas funcionales de nómina.

## Contexto
Estos ejercicios se trabajaron en Oracle usando el esquema `NESPINOSAE`.
En este esquema hay dos grupos de tablas:

1. **Tablas base HR** (estructura organizacional: regiones, países, ubicaciones, departamentos, empleados, cargos).
2. **Tablas de nómina** (tipos de nómina, conceptos, periodos, contratos, marcaciones, novedades y desprendibles).

## Solución Oracle
```sql
-- Consultar tablas del modelo base HR en el esquema NESPINOSAE
SELECT * FROM NESPINOSAE.REGIONS;
SELECT * FROM NESPINOSAE.COUNTRIES;
SELECT * FROM NESPINOSAE.LOCATIONS;
SELECT * FROM NESPINOSAE.DEPARTMENTS;
SELECT * FROM NESPINOSAE.JOBS;
SELECT * FROM NESPINOSAE.EMPLOYEES;
SELECT * FROM NESPINOSAE.JOB_HISTORY;

-- Configuración y periodos de nómina
SELECT * FROM NESPINOSAE.PAY_PAYROLL_TYPES;
SELECT * FROM NESPINOSAE.PAY_CONCEPTS;
SELECT * FROM NESPINOSAE.PAY_PERIODS;

-- Gestión de empleados y tiempo
SELECT * FROM NESPINOSAE.PAY_EMP_CONTRACTS;
SELECT * FROM NESPINOSAE.PAY_TIME_ENTRIES;
SELECT * FROM NESPINOSAE.PAY_LEAVE_REQUESTS;
SELECT * FROM NESPINOSAE.PAY_EMP_EVENTS;

-- Resultados de nómina (desprendibles)
SELECT * FROM NESPINOSAE.PAY_PAYSLIPS;
SELECT * FROM NESPINOSAE.PAY_PAYSLIP_LINES;

-- Base para cálculo de nómina del mes
SELECT *
FROM NESPINOSAE.PAY_EMP_EVENTS;
```

## Explicación de la Consulta
- Cada `SELECT *` permite validar rápidamente estructura y datos de una tabla.
- Es una fase inicial clave antes de construir procedimientos, cursores o cálculos de nómina.
- El bloque de nómina permite entender el flujo completo:
  - Configuración (`PAY_PAYROLL_TYPES`, `PAY_CONCEPTS`)
  - Periodos (`PAY_PERIODS`)
  - Movimiento y novedades (`PAY_TIME_ENTRIES`, `PAY_LEAVE_REQUESTS`, `PAY_EMP_EVENTS`)
  - Resultado final (`PAY_PAYSLIPS`, `PAY_PAYSLIP_LINES`)
- Para iniciar el cálculo de nómina mensual, `PAY_EMP_EVENTS` funciona como tabla base de eventos por empleado.

## Resultado Esperado
- Visualización de registros existentes por cada tabla.
- Confirmación de qué tablas tienen datos cargados y cuáles están listas para procesos de cálculo de nómina.
