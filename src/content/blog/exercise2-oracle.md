---
title: 'Ejercicio 2: Filtro Europa y Salarios'
description: 'Filtrar empleados por región y rango salarial específico.'
pubDate: 'Feb 11 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['SQL', 'Filtros']
---

## Enunciado
Identifique todos los empleados que vivan o trabajen en Europa (Región 10) y tengan un salario entre 4 mil y 6 mil dólares.

## Solución SQL
```sql
SELECT CONCAT(E.FIRST_NAME, ' ', E.LAST_NAME) AS NAME, 
       C.COUNTRY_NAME AS COUNTRY, 
       E.SALARY
FROM HR.EMPLOYEES E 
JOIN HR.DEPARTMENTS D ON E.DEPARTMENT_ID = D.DEPARTMENT_ID
JOIN HR.LOCATIONS L ON L.LOCATION_ID = D.LOCATION_ID
JOIN HR.COUNTRIES C ON L.COUNTRY_ID = C.COUNTRY_ID
JOIN HR.REGIONS R ON C.REGION_ID = R.REGION_ID
WHERE R.REGION_ID = 10 AND E.SALARY BETWEEN 4000 AND 6000;

