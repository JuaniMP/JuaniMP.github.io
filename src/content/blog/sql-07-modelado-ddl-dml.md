---
title: 'SQL 07: Modelado y Estructura (DDL y DML)'
description: 'Copia de tablas, restricciones y secuencias sobre una replica del esquema HR.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['SQL', 'Oracle', 'DDL', 'DML']
---

## Enunciado
Trabajar sobre una copia del esquema HR para no afectar datos originales, aplicar restricciones de integridad y generar IDs automaticos para auditoria.

## Contexto
Este ejercicio usa SQL puro en Oracle. El objetivo es preparar una base de trabajo segura para ajustes salariales.

## Solucion SQL
```sql
-- 1) Copia espejo de EMPLOYEES (sin tocar HR.EMPLOYEES)
CREATE TABLE T1_EMPLOYEES AS
SELECT *
FROM HR.EMPLOYEES;

-- 2) Restriccion de PK para integridad
ALTER TABLE T1_EMPLOYEES
ADD CONSTRAINT T1_EMPLOYEES_PK PRIMARY KEY (EMPLOYEE_ID);

-- 3) Tabla de auditoria de ajustes salariales
CREATE TABLE AUDIT_SALARY_ADJ_T1 (
    AUDIT_ID        NUMBER,
    EMPLOYEE_ID     NUMBER NOT NULL,
    OLD_SALARY      NUMBER(8,2) NOT NULL,
    NEW_SALARY      NUMBER(8,2) NOT NULL,
    ADJ_PCT         NUMBER(5,2) NOT NULL,
    ADJ_TS          DATE DEFAULT SYSDATE NOT NULL,
    ADJ_USER        VARCHAR2(100) DEFAULT USER NOT NULL,
    VARIANT_CODE    VARCHAR2(20),
    CONSTRAINT AUDIT_SALARY_ADJ_T1_PK PRIMARY KEY (AUDIT_ID)
);

-- 4) FK de auditoria hacia empleados copia
ALTER TABLE AUDIT_SALARY_ADJ_T1
ADD CONSTRAINT AUDIT_SALARY_ADJ_T1_FK1
FOREIGN KEY (EMPLOYEE_ID)
REFERENCES T1_EMPLOYEES (EMPLOYEE_ID);

-- 5) Secuencia para IDs automaticos de auditoria
CREATE SEQUENCE AUDIT_SALARY_ADJ_T1_SEQ
START WITH 1
INCREMENT BY 1
NOCACHE;

-- 6) Ejemplo de insercion en auditoria
INSERT INTO AUDIT_SALARY_ADJ_T1 (
    AUDIT_ID, EMPLOYEE_ID, OLD_SALARY, NEW_SALARY, ADJ_PCT, VARIANT_CODE
)
VALUES (
    AUDIT_SALARY_ADJ_T1_SEQ.NEXTVAL,
    100,
    24000,
    25200,
    5,
    'V1'
);

COMMIT;
```

## Explicacion
1. `CREATE TABLE ... AS SELECT` crea tabla espejo para trabajar sin riesgo sobre HR.
2. `PRIMARY KEY` evita IDs duplicados y mejora consistencia.
3. Tabla de auditoria registra trazabilidad de cada cambio salarial.
4. `SEQUENCE` evita generar IDs manualmente y reduce errores.
5. La relacion FK protege integridad referencial entre auditoria y empleados.

## Resultado Esperado
- Tabla `T1_EMPLOYEES` creada y lista para pruebas.
- Restricciones de integridad activas.
- Secuencia disponible para auditoria.
- Registro de auditoria insertado correctamente.
