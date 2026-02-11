---
title: 'Ejercicio 1: Historial de Cargos'
description: 'Consulta para identificar empleados con múltiples roles en la empresa.'
pubDate: 'Feb 12 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['SQL', 'Oracle']
---

## Enunciado
El empleado debe haber ocupado mínimo dos cargos a lo largo de su historia en la empresa.

## Solución SQL
```sql
SELECT E.FIRST_NAME, H.EMPLOYEE_ID, COUNT(*) AS job_count
FROM HR.JOB_HISTORY H 
JOIN HR.EMPLOYEES E ON H.EMPLOYEE_ID = E.EMPLOYEE_ID
GROUP BY E.FIRST_NAME, H.EMPLOYEE_ID
HAVING COUNT (*) > 1;