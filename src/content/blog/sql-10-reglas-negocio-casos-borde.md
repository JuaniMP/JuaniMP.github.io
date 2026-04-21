---
title: 'SQL 10: Reglas de Negocio y Casos Borde'
description: 'Filtrar elegibles considerando job history, departamentos pequenos, nulls y topes salariales.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['SQL', 'Oracle', 'Reglas de Negocio']
---

## Enunciado
Determinar empleados elegibles para ajuste salarial excluyendo casos borde:
1. Sin departamento (`NULL`)
2. Departamento con menos de 3 personas
3. Salario ya en tope
4. Cambio de puesto reciente (JOB_HISTORY)

## Contexto
Este filtro endurece el escenario real para evitar ajustes incorrectos y reducir riesgo operativo.

## Solucion SQL
```sql
WITH dept_size AS (
    SELECT department_id, COUNT(*) AS total_emp
    FROM T1_EMPLOYEES
    WHERE department_id IS NOT NULL
    GROUP BY department_id
),
recent_job_change AS (
    SELECT DISTINCT jh.employee_id
    FROM HR.JOB_HISTORY jh
    WHERE jh.end_date >= ADD_MONTHS(TRUNC(SYSDATE), -6)
),
base AS (
    SELECT
        e.employee_id,
        e.first_name,
        e.last_name,
        e.department_id,
        e.salary,
        ds.total_emp,
        CASE
            WHEN e.department_id IS NULL THEN 'N'
            WHEN ds.total_emp < 3 THEN 'N'
            WHEN e.salary >= 20000 THEN 'N'
            WHEN rjc.employee_id IS NOT NULL THEN 'N'
            ELSE 'Y'
        END AS eligibility_flag
    FROM T1_EMPLOYEES e
    LEFT JOIN dept_size ds
      ON ds.department_id = e.department_id
    LEFT JOIN recent_job_change rjc
      ON rjc.employee_id = e.employee_id
)
SELECT
    employee_id,
    first_name,
    last_name,
    department_id,
    salary,
    total_emp,
    eligibility_flag
FROM base
ORDER BY eligibility_flag DESC, department_id, salary;
```

## Explicacion
1. `dept_size` calcula tamano real por departamento.
2. `recent_job_change` marca quienes cambiaron de rol en ultimos 6 meses.
3. `CASE` centraliza reglas para `eligibility_flag`.
4. Se excluyen nulls, departamentos chicos, topes y cambios recientes.

## Ejemplo de Criterio
- Empleado con `department_id IS NULL` => `eligibility_flag = 'N'`
- Empleado con salario `>= 20000` => `eligibility_flag = 'N'`
- Empleado con cambio en `JOB_HISTORY` en 6 meses => `eligibility_flag = 'N'`
- Solo quienes pasan todas las reglas quedan con `Y`

## Resultado Esperado
Reporte final de elegibilidad con reglas de negocio aplicadas de forma consistente.
