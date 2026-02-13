---
title: 'Ejercicio 2: Filtro Europa y Salarios'
description: 'Filtrar empleados por región y rango salarial específico.'
pubDate: 'Feb 11 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Oracle', 'Filtros']
---

## Enunciado
Identifique todos los empleados que vivan o trabajen en Europa (Región 10) y tengan un salario entre 4 mil y 6 mil dólares.

## Contexto
Ejercicio desarrollado en **Oracle Live SQL** utilizando el esquema **HR** preconfigurado. Este esquema simula una empresa multinacional con empleados en diferentes regiones del mundo.

### Esquema HR - Tablas Utilizadas:

**HR.EMPLOYEES**: Datos de los empleados
- `EMPLOYEE_ID`, `FIRST_NAME`, `LAST_NAME`, `SALARY`, `DEPARTMENT_ID`

**HR.DEPARTMENTS**: Información de departamentos
- `DEPARTMENT_ID`, `DEPARTMENT_NAME`, `LOCATION_ID`

**HR.LOCATIONS**: Ubicaciones físicas de la empresa
- `LOCATION_ID`, `CITY`, `STATE_PROVINCE`, `COUNTRY_ID`

**HR.COUNTRIES**: Países donde opera la empresa
- `COUNTRY_ID`, `COUNTRY_NAME`, `REGION_ID`

**HR.REGIONS**: Regiones geográficas
- `REGION_ID`, `REGION_NAME` (Región 10 = Europa)

## Solución Oracle
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
```

## Explicación de la Consulta

Esta consulta realiza una serie de **JOINs en cadena** para conectar empleados con su región geográfica:

1. **EMPLOYEES → DEPARTMENTS**: Conecta empleado con su departamento
2. **DEPARTMENTS → LOCATIONS**: Conecta departamento con su ubicación física
3. **LOCATIONS → COUNTRIES**: Conecta ubicación con el país
4. **COUNTRIES → REGIONS**: Conecta país con la región continental

**Filtros aplicados**:
- `R.REGION_ID = 10`: Solo empleados en Europa
- `E.SALARY BETWEEN 4000 AND 6000`: Salario en el rango especificado

**CONCAT**: Une nombre y apellido en una sola columna

## Resultado Esperado

La consulta retorna empleados europeos con salarios medios:

| NAME              | COUNTRY        | SALARY  |
|-------------------|----------------|--------|
| Alexander Hunold  | United Kingdom | 5,000  |
| Bruce Ernst       | United Kingdom | 6,000  |
| Diana Lorentz     | United Kingdom | 4,200  |
| Hermann Baer      | Germany        | 5,500  |

