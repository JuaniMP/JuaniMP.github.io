---
title: 'SQL 08: CTEs, Funciones Analiticas y Gap Analysis'
description: 'WITH, DENSE_RANK/ROW_NUMBER y calculo de brechas salariales con reglas CASE.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['SQL', 'Oracle', 'CTE', 'Analiticas']
---

## Enunciado
Construir una consulta avanzada para clasificar empleados por salario dentro de su departamento, calcular la brecha contra el promedio del area y definir elegibilidad con `CASE`.

## Contexto
El objetivo es escribir SQL legible y reutilizable con bloques `WITH` para evitar consultas largas y dificiles de mantener.

## Solucion SQL
```sql
WITH base_emp AS (
    SELECT
        e.employee_id,
        e.first_name,
        e.last_name,
        e.department_id,
        e.salary
    FROM T1_EMPLOYEES e
    WHERE e.department_id IS NOT NULL
),
avg_dept AS (
    SELECT
        department_id,
        AVG(salary) AS avg_salary,
        COUNT(*) AS dept_size
    FROM base_emp
    GROUP BY department_id
),
ranked AS (
    SELECT
        b.employee_id,
        b.first_name,
        b.last_name,
        b.department_id,
        b.salary,
        a.avg_salary,
        a.dept_size,
        DENSE_RANK() OVER (
            PARTITION BY b.department_id
            ORDER BY b.salary DESC
        ) AS salary_dense_rank,
        ROW_NUMBER() OVER (
            PARTITION BY b.department_id
            ORDER BY b.salary DESC, b.employee_id
        ) AS salary_rownum
    FROM base_emp b
    JOIN avg_dept a
      ON a.department_id = b.department_id
)
SELECT
    r.employee_id,
    r.first_name,
    r.last_name,
    r.department_id,
    r.salary,
    ROUND(r.avg_salary, 2) AS dept_avg_salary,
    ROUND((r.salary - r.avg_salary), 2) AS gap_amount,
    ROUND(((r.salary - r.avg_salary) / r.avg_salary) * 100, 2) AS gap_pct,
    r.salary_dense_rank,
    r.salary_rownum,
    CASE
        WHEN r.dept_size < 3 THEN 'N'
        WHEN r.salary >= (r.avg_salary * 1.20) THEN 'N'
        WHEN r.salary_dense_rank <= 2 THEN 'N'
        ELSE 'Y'
    END AS eligibility_flag
FROM ranked r
ORDER BY r.department_id, r.salary DESC;
```

## Explicacion
1. `WITH` separa la logica en capas (`base_emp`, `avg_dept`, `ranked`).
2. `DENSE_RANK` y `ROW_NUMBER` clasifican salarios sin perder detalle por empleado.
3. `gap_amount` y `gap_pct` miden distancia entre salario individual y promedio del area.
4. `CASE` aplica reglas de negocio para `eligibility_flag`.

## Ejemplo de Lectura del Resultado
- Si `gap_pct = 30`, el empleado esta 30% por encima del promedio.
- Si `dept_size < 3`, queda no elegible (`N`) por regla de estabilidad estadistica.
- Si aparece en top 2 salario del departamento, tambien queda no elegible.
