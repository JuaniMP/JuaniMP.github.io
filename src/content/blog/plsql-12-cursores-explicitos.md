---
title: 'PL/SQL 12: Cursores Explícitos y Parametrizados'
description: 'Recorrer empleados con cursor explícito, cursor FOR y cursor con parámetro.'
pubDate: 'Mar 4 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL', 'Cursores']
---

## Enunciado
Practicar distintas formas de recorrer empleados en Oracle:
1. Cursor explícito clásico (`OPEN`, `FETCH`, `CLOSE`).
2. Cursor implícito con `FOR`.
3. Cursor explícito con parámetro de departamento.

## Contexto
Clase del **02/03/2026**. Se trabajó con empleados del esquema `HR` y `NESPINOSAE` para entender control de recorrido y filtrado por departamento.

## Solución PL/SQL

### 1) Cursor explícito básico
```sql
SET SERVEROUTPUT ON;

DECLARE
   CURSOR c_empleados IS
      SELECT employee_id, first_name, last_name
      FROM HR.EMPLOYEES;

   v_id        HR.EMPLOYEES.employee_id%TYPE;
   v_nombre    HR.EMPLOYEES.first_name%TYPE;
   v_apellido  HR.EMPLOYEES.last_name%TYPE;

BEGIN
   OPEN c_empleados;
   LOOP
      FETCH c_empleados INTO v_id, v_nombre, v_apellido;
      EXIT WHEN c_empleados%NOTFOUND;

      DBMS_OUTPUT.PUT_LINE(v_id || ' - ' || v_nombre || ' ' || v_apellido);
   END LOOP;
   CLOSE c_empleados;
END;
/
```

### 2) Cursor FOR LOOP (más simple)
```sql
SET SERVEROUTPUT ON;

BEGIN
   FOR emp IN (
      SELECT employee_id, first_name, last_name, department_id
      FROM NESPINOSAE.EMPLOYEES
      WHERE department_id = 80
   ) LOOP
      DBMS_OUTPUT.PUT_LINE(
         emp.employee_id || ' - ' ||
         emp.first_name || ' ' ||
         emp.last_name ||
         ' (Depto: ' || emp.department_id || ')'
      );
   END LOOP;
END;
/
```

### 3) Cursor explícito con parámetro
```sql
SET SERVEROUTPUT ON;

DECLARE
   v_depto NUMBER := &departamento;

   CURSOR c_emp (p_dept NUMBER) IS
      SELECT employee_id, first_name, last_name, department_id
      FROM NESPINOSAE.EMPLOYEES
      WHERE department_id = p_dept;

   v_id        NESPINOSAE.EMPLOYEES.employee_id%TYPE;
   v_nombre    NESPINOSAE.EMPLOYEES.first_name%TYPE;
   v_apellido  NESPINOSAE.EMPLOYEES.last_name%TYPE;
   v_dep       NESPINOSAE.EMPLOYEES.department_id%TYPE;

BEGIN
   OPEN c_emp(v_depto);

   LOOP
      FETCH c_emp INTO v_id, v_nombre, v_apellido, v_dep;
      EXIT WHEN c_emp%NOTFOUND;

      DBMS_OUTPUT.PUT_LINE(
         v_id || ' - ' || v_nombre || ' ' || v_apellido ||
         ' (Depto: ' || v_dep || ')'
      );
   END LOOP;

   CLOSE c_emp;
END;
/
```

## Explicación
- **Cursor explícito**: da control total del ciclo (`OPEN/FETCH/CLOSE`).
- **Cursor FOR LOOP**: reduce código y Oracle maneja apertura/cierre automáticamente.
- **Cursor con parámetro**: reutilizable para cualquier departamento.
- `&departamento` pregunta el valor cada ejecución.
- `&&departamento` conserva el valor para reutilizarlo en la sesión.

## Resultado Esperado
Listado de empleados con formato:

```text
<employee_id> - <nombre> <apellido> (Depto: <department_id>)
```

Dependiendo del departamento ingresado, la salida mostrará solo los empleados de ese departamento.
