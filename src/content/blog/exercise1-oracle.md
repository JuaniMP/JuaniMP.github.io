---
title: 'Ejercicio 1: Historial de Cargos'
description: 'Consulta para identificar empleados con múltiples roles en la empresa.'
pubDate: 'Feb 12 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Oracle']
---

## Enunciado
El empleado debe haber ocupado mínimo dos cargos a lo largo de su historia en la empresa.

## Contexto
Este ejercicio fue desarrollado en **Oracle Live SQL**, una plataforma en línea que proporciona acceso a un entorno Oracle Database completo. Utilizamos el esquema **HR (Human Resources)** que viene precargado con datos de ejemplo de empleados, departamentos, ubicaciones y más.

### Esquema HR - Tablas Utilizadas:

**HR.JOB_HISTORY**: Almacena el historial de puestos de trabajo de los empleados
- `EMPLOYEE_ID`: ID del empleado
- `START_DATE`: Fecha de inicio en el cargo
- `END_DATE`: Fecha de finalización del cargo
- `JOB_ID`: ID del puesto de trabajo
- `DEPARTMENT_ID`: ID del departamento

**HR.EMPLOYEES**: Contiene la información actual de los empleados
- `EMPLOYEE_ID`: ID único del empleado
- `FIRST_NAME`: Nombre del empleado
- `LAST_NAME`: Apellido del empleado
- Y más campos...

## Solución Oracle
```sql
SELECT E.FIRST_NAME, H.EMPLOYEE_ID, COUNT(*) AS job_count
FROM HR.JOB_HISTORY H 
JOIN HR.EMPLOYEES E ON H.EMPLOYEE_ID = E.EMPLOYEE_ID
GROUP BY E.FIRST_NAME, H.EMPLOYEE_ID
HAVING COUNT (*) > 1;
```

## Explicación de la Consulta

1. **FROM HR.JOB_HISTORY H**: Partimos de la tabla de historial de empleos
2. **JOIN HR.EMPLOYEES E**: Unimos con la tabla de empleados para obtener sus nombres
3. **GROUP BY**: Agrupamos por nombre y ID de empleado para contar sus registros
4. **COUNT(*)**: Contamos cuántos trabajos ha tenido cada empleado
5. **HAVING COUNT(*) > 1**: Filtramos solo aquellos con más de un cargo en su historial

## Resultado Esperado

La consulta retorna una tabla con empleados que han tenido múltiples cargos:

| FIRST_NAME | EMPLOYEE_ID | JOB_COUNT |
|------------|-------------|----------|
| Jennifer   | 200         | 2        |
| Jonathon   | 176         | 2        |
| John       | 200         | 3        |

