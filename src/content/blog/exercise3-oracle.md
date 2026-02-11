---
title: 'Ejercicio 3: Jerarquía y Emails'
description: 'Reporte de jefes y empleados con enmascaramiento de datos sensibles.'
pubDate: 'Feb 10 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['SQL', 'Seguridad']
---

## Enunciado
Proyectar orden jerárquico de los cargos, mostrar empleado y jefe, y ocultar parte del email con asteriscos.

## Solución SQL
```sql
SELECT
    E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLEADO,
    LPAD(SUBSTR(E.EMAIL, 1, 3), 9, '*') AS EMAIL_EMPLEADO,
    M.FIRST_NAME || ' ' || M.LAST_NAME AS JEFE,
    LPAD(SUBSTR(M.EMAIL, 1, 3), 9, '*') AS EMAIL_JEFE
FROM HR.EMPLOYEES E
LEFT JOIN HR.EMPLOYEES M ON E.MANAGER_ID = M.EMPLOYEE_ID
ORDER BY E.LAST_NAME;