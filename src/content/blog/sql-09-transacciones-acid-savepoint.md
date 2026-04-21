---
title: 'SQL 09: Transacciones ACID, SAVEPOINT y Validacion'
description: 'Aplicar atomicidad con rollback parcial y validacion antes de commit final.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['SQL', 'Oracle', 'ACID', 'Transacciones']
---

## Enunciado
Aplicar ajuste salarial por lote cumpliendo atomicidad: o se actualiza todo y se audita, o no se persiste nada. Usar `SAVEPOINT` para rollback parcial y validar topes antes del `COMMIT`.

## Contexto
Este ejercicio simula un proceso controlado de incremento salarial con reglas de negocio por variante.

## Solucion SQL
```sql
-- Parametros de ejemplo de variante
-- tope_salarial: no permitir salario final > 20000
-- incremento_pct: aumentar 5%

SAVEPOINT inicio_proceso;

-- 1) Candidatos elegibles (ejemplo)
CREATE GLOBAL TEMPORARY TABLE TMP_ELIGIBLES_T1 (
    EMPLOYEE_ID NUMBER PRIMARY KEY
) ON COMMIT DELETE ROWS;

INSERT INTO TMP_ELIGIBLES_T1 (EMPLOYEE_ID)
SELECT e.employee_id
FROM T1_EMPLOYEES e
WHERE e.department_id IS NOT NULL
  AND e.salary < 20000;

SAVEPOINT despues_candidatos;

-- 2) Actualizacion de salarios
UPDATE T1_EMPLOYEES e
SET e.salary = ROUND(e.salary * 1.05, 2)
WHERE EXISTS (
    SELECT 1
    FROM TMP_ELIGIBLES_T1 t
    WHERE t.employee_id = e.employee_id
);

SAVEPOINT despues_update;

-- 3) Auditoria del ajuste
INSERT INTO AUDIT_SALARY_ADJ_T1 (
    AUDIT_ID, EMPLOYEE_ID, OLD_SALARY, NEW_SALARY, ADJ_PCT, VARIANT_CODE
)
SELECT
    AUDIT_SALARY_ADJ_T1_SEQ.NEXTVAL,
    e.employee_id,
    ROUND(e.salary / 1.05, 2) AS old_salary,
    e.salary AS new_salary,
    5 AS adj_pct,
    'V1' AS variant_code
FROM T1_EMPLOYEES e
WHERE EXISTS (
    SELECT 1
    FROM TMP_ELIGIBLES_T1 t
    WHERE t.employee_id = e.employee_id
);

-- 4) Validacion intermedia antes del commit
-- Si alguien supera tope, deshacer hasta punto seguro
DECLARE
    v_invalid_count NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_invalid_count
    FROM T1_EMPLOYEES
    WHERE salary > 20000;

    IF v_invalid_count > 0 THEN
        ROLLBACK TO despues_candidatos;
    ELSE
        COMMIT;
    END IF;
END;
/
```

## Explicacion
1. `SAVEPOINT inicio_proceso` marca inicio de la unidad transaccional.
2. `SAVEPOINT despues_candidatos` permite volver sin perder toda la sesion.
3. Se actualiza y luego se audita en la misma transaccion.
4. Validacion intermedia revisa topes antes de confirmar.
5. Si falla regla, `ROLLBACK TO` revierte parcialmente.
6. Si todo cumple, `COMMIT` cierra de forma atomica.

## Resultado Esperado
- Sin violaciones: salarios + auditoria confirmados.
- Con violaciones: rollback parcial y sin commit final.
