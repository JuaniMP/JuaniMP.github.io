---
title: 'Ejercicio 3: Jerarquía y Emails'
description: 'Reporte de jefes y empleados con enmascaramiento de datos sensibles.'
pubDate: 'Feb 10 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Oracle', 'Seguridad']
---

## Enunciado
Proyectar orden jerárquico de los cargos, mostrar empleado y jefe, y ocultar parte del email con asteriscos.

## Contexto
Ejercicio desarrollado en **Oracle Live SQL** usando el esquema **HR**. Este ejercicio combina conceptos de:
- **Joins jerárquicos** (self-join)
- **Seguridad de datos** (enmascaramiento de información sensible)
- **Funciones de cadena** de Oracle

### Esquema HR - Tabla Utilizada:

**HR.EMPLOYEES**: Tabla con estructura jerárquica
- `EMPLOYEE_ID`: ID único del empleado
- `FIRST_NAME`, `LAST_NAME`: Nombres del empleado
- `EMAIL`: Correo electrónico corporativo
- `MANAGER_ID`: ID del jefe directo (referencia a EMPLOYEE_ID)

La relación `MANAGER_ID → EMPLOYEE_ID` crea una jerarquía organizacional dentro de la misma tabla.

## Solución Oracle
```sql
SELECT
    E.FIRST_NAME || ' ' || E.LAST_NAME AS EMPLEADO,
    LPAD(SUBSTR(E.EMAIL, 1, 3), 9, '*') AS EMAIL_EMPLEADO,
    M.FIRST_NAME || ' ' || M.LAST_NAME AS JEFE,
    LPAD(SUBSTR(M.EMAIL, 1, 3), 9, '*') AS EMAIL_JEFE
FROM HR.EMPLOYEES E
LEFT JOIN HR.EMPLOYEES M ON E.MANAGER_ID = M.EMPLOYEE_ID
ORDER BY E.LAST_NAME;
```

## Explicación de la Consulta

### Self-Join (Auto-unión)
- **E (Employees)**: Alias para los empleados
- **M (Managers)**: Alias para los jefes (misma tabla)
- **LEFT JOIN**: Incluye empleados sin jefe (CEO/Presidente)

### Concatenación de Nombres
```sql
E.FIRST_NAME || ' ' || E.LAST_NAME
```
El operador `||` concatena cadenas en Oracle.

### Enmascaramiento de Email
```sql
LPAD(SUBSTR(E.EMAIL, 1, 3), 9, '*')
```

**Paso a paso**:
1. `SUBSTR(E.EMAIL, 1, 3)`: Extrae los primeros 3 caracteres del email
2. `LPAD(..., 9, '*')`: Rellena a la izquierda con asteriscos hasta 9 caracteres

**Ejemplo**: 
- Email original: `JWHALEN`
- Resultado: `******JWH`

Esto protege la privacidad mientras mantiene identificabilidad parcial.

## Resultado Esperado

La consulta genera una tabla con la estructura organizacional:

| EMPLEADO          | EMAIL_EMPLEADO | JEFE              | EMAIL_JEFE |
|-------------------|----------------|-------------------|----------|
| Steven King       | ******SKI      | NULL              | NULL     |
| Neena Kochhar     | ******NKO      | Steven King       | ******SKI |
| Lex De Haan       | ******LDE      | Steven King       | ******SKI |
| Alexander Hunold  | ******AHU      | Lex De Haan       | ******LDE |
| Bruce Ernst       | ******BER      | Alexander Hunold  | ******AHU |
