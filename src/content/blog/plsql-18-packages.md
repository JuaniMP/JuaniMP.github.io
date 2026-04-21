---
title: 'PL/SQL 18: Packages - Paquetes y Modularidad'
description: 'Crear packages que agrupen funciones, procedimientos y constantes relacionadas en una unidad reutilizable.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL', 'Packages', 'Modularidad', 'Organización']
---

## Enunciado
Los **packages** (paquetes) son contenedores que agrupan funciones, procedimientos, constantes y variables relacionadas. Permiten organización modular, ocultamiento de código (encapsulación) y reutilización.

## Contexto

### Sin Package (Desorden)
```
Función: fn_calcular_base
Función: fn_calcular_recargos
Función: fn_calcular_bonificacion
Procedimiento: sp_liquidar_empleado
Procedimiento: sp_actualizar_salario
Constante: cn_tasa_afiliacion
... (todo suelto, difícil de encontrar)
```

### Con Package (Organización)
```
pkg_nomina
├── Constantes
│   ├── cn_tasa_afiliacion
│   ├── cn_tasa_nocturna
│   └── cn_tasa_dominical
├── Funciones
│   ├── fn_calcular_base
│   ├── fn_calcular_recargos
│   └── fn_calcular_total_neto
└── Procedimientos
    ├── sp_liquidar_empleado
    └── sp_actualizar_salario
```

---

## 1. CREAR EL PACKAGE (ESPECIFICACIÓN)

La **especificación** define la interfaz pública (lo que el usuario ve):

```sql
CREATE OR REPLACE PACKAGE pkg_nomina
IS
    -- CONSTANTES
    cn_tasa_afiliacion      CONSTANT NUMBER := 0.04;      -- 4%
    cn_tasa_nocturna        CONSTANT NUMBER := 0.35;      -- 35%
    cn_tasa_dominical       CONSTANT NUMBER := 0.10;      -- 10%
    cn_horas_mensuales      CONSTANT NUMBER := 240;       -- 240 horas
    cn_salario_minimo       CONSTANT NUMBER := 1000000;   -- $1.000.000 COP
    
    -- FUNCIONES PÚBLICAS
    
    -- Calcula la base salarial
    FUNCTION fn_calcular_base (
        p_salario_base NUMBER
    ) RETURN NUMBER;
    
    -- Calcula recargos nocturnos
    FUNCTION fn_calcular_recargos (
        p_salario_base NUMBER,
        p_horas_nocturnas NUMBER DEFAULT 0
    ) RETURN NUMBER;
    
    -- Calcula bonificación por antigüedad
    FUNCTION fn_calcular_bonificacion (
        p_salario_base NUMBER,
        p_antiguedad_meses NUMBER
    ) RETURN NUMBER;
    
    -- Calcula el neto total
    FUNCTION fn_calcular_neto (
        p_id_empleado NUMBER,
        p_salario_base NUMBER,
        p_horas_nocturnas NUMBER,
        p_antiguedad_meses NUMBER
    ) RETURN NUMBER;
    
    -- PROCEDIMIENTOS PÚBLICOS
    
    -- Liquida un empleado
    PROCEDURE sp_liquidar_empleado (
        p_id_empleado NUMBER,
        p_mes NUMBER,
        p_anio NUMBER
    );
    
    -- Actualiza el salario
    PROCEDURE sp_actualizar_salario (
        p_id_empleado NUMBER,
        p_nuevo_salario NUMBER
    );
    
    -- Obtiene información de nómina
    PROCEDURE sp_consultar_liquidacion (
        p_id_empleado NUMBER,
        p_mes NUMBER,
        p_anio NUMBER
    );
    
END pkg_nomina;
/
```

---

## 2. CREAR EL BODY (IMPLEMENTACIÓN)

El **body** contiene la lógica real (lo que está "escondido"):

```sql
CREATE OR REPLACE PACKAGE BODY pkg_nomina
IS

    -- ============================================
    -- FUNCIONES INTERNAS (PRIVADAS)
    -- ============================================
    
    -- Esta función es PRIVADA (solo se usa dentro del package)
    FUNCTION fn_obtener_tasa_dinamica (
        p_nombre_tasa VARCHAR2
    ) RETURN NUMBER
    IS
        vn_tasa NUMBER;
    BEGIN
        SELECT valor_numerico
        INTO vn_tasa
        FROM PARAMETROS
        WHERE nombre_parametro = p_nombre_tasa;
        RETURN vn_tasa;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20001, 'Parámetro no encontrado: ' || p_nombre_tasa);
    END fn_obtener_tasa_dinamica;
    
    -- ============================================
    -- FUNCIONES PÚBLICAS (DECLARADAS EN ESPECIFICACIÓN)
    -- ============================================
    
    FUNCTION fn_calcular_base (p_salario_base NUMBER) RETURN NUMBER
    IS
    BEGIN
        RETURN p_salario_base;
    END fn_calcular_base;
    
    
    FUNCTION fn_calcular_recargos (
        p_salario_base NUMBER,
        p_horas_nocturnas NUMBER DEFAULT 0
    ) RETURN NUMBER
    IS
        vn_valor_hora   NUMBER;
        vn_recargo      NUMBER;
    BEGIN
        IF p_horas_nocturnas = 0 THEN
            RETURN 0;
        END IF;
        
        vn_valor_hora := p_salario_base / cn_horas_mensuales;
        vn_recargo := (vn_valor_hora * p_horas_nocturnas) * (1 + cn_tasa_nocturna);
        
        RETURN ROUND(vn_recargo, 2);
    END fn_calcular_recargos;
    
    
    FUNCTION fn_calcular_bonificacion (
        p_salario_base NUMBER,
        p_antiguedad_meses NUMBER
    ) RETURN NUMBER
    IS
        vn_bonificacion NUMBER := 0;
    BEGIN
        IF p_antiguedad_meses < 12 THEN
            vn_bonificacion := 0;
        ELSIF p_antiguedad_meses < 24 THEN
            vn_bonificacion := p_salario_base * 0.05;
        ELSIF p_antiguedad_meses < 60 THEN
            vn_bonificacion := p_salario_base * 0.10;
        ELSE
            vn_bonificacion := p_salario_base * 0.15;
        END IF;
        
        RETURN ROUND(vn_bonificacion, 2);
    END fn_calcular_bonificacion;
    
    
    FUNCTION fn_calcular_neto (
        p_id_empleado NUMBER,
        p_salario_base NUMBER,
        p_horas_nocturnas NUMBER,
        p_antiguedad_meses NUMBER
    ) RETURN NUMBER
    IS
        vn_base         NUMBER;
        vn_recargos     NUMBER;
        vn_bonificacion NUMBER;
        vn_devengado    NUMBER;
        vn_descuentos   NUMBER;
        vn_neto         NUMBER;
    BEGIN
        vn_base := fn_calcular_base(p_salario_base);
        vn_recargos := fn_calcular_recargos(p_salario_base, p_horas_nocturnas);
        vn_bonificacion := fn_calcular_bonificacion(p_salario_base, p_antiguedad_meses);
        
        vn_devengado := vn_base + vn_recargos + vn_bonificacion;
        vn_descuentos := vn_devengado * cn_tasa_afiliacion;
        vn_neto := vn_devengado - vn_descuentos;
        
        RETURN ROUND(vn_neto, 2);
    END fn_calcular_neto;
    
    
    -- ============================================
    -- PROCEDIMIENTOS PÚBLICOS
    -- ============================================
    
    PROCEDURE sp_liquidar_empleado (
        p_id_empleado NUMBER,
        p_mes NUMBER,
        p_anio NUMBER
    )
    IS
        vn_salario_base     EMPLOYEES.salary%TYPE;
        vn_horas_nocturnas  NUMBER := 0;
        vn_antiguedad       NUMBER := 0;
        vn_neto             NUMBER;
        
    BEGIN
        -- Obtener datos del empleado
        SELECT salary
        INTO vn_salario_base
        FROM EMPLOYEES
        WHERE employee_id = p_id_empleado;
        
        -- Calcular usando las funciones del package
        vn_neto := fn_calcular_neto(
            p_id_empleado,
            vn_salario_base,
            vn_horas_nocturnas,
            vn_antiguedad
        );
        
        -- Insertar en tabla de liquidaciones
        INSERT INTO LIQUIDACIONES (
            id_liquidacion,
            id_empleado,
            mes,
            anio,
            neto
        ) VALUES (
            SEQ_LIQUIDACION.NEXTVAL,
            p_id_empleado,
            p_mes,
            p_anio,
            vn_neto
        );
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('✓ Liquidación procesada. Neto: $' || TO_CHAR(vn_neto, '9,999,999.99'));
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20001, 'Empleado no encontrado');
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20999, SQLERRM);
    END sp_liquidar_empleado;
    
    
    PROCEDURE sp_actualizar_salario (
        p_id_empleado NUMBER,
        p_nuevo_salario NUMBER
    )
    IS
    BEGIN
        -- Validar con constante del package
        IF p_nuevo_salario < cn_salario_minimo THEN
            RAISE_APPLICATION_ERROR(
                -20002,
                'El salario debe ser >= $' || cn_salario_minimo
            );
        END IF;
        
        UPDATE EMPLOYEES
        SET salary = p_nuevo_salario,
            last_update = SYSDATE
        WHERE employee_id = p_id_empleado;
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('✓ Salario actualizado a: $' || TO_CHAR(p_nuevo_salario, '9,999,999.99'));
        
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20999, SQLERRM);
    END sp_actualizar_salario;
    
    
    PROCEDURE sp_consultar_liquidacion (
        p_id_empleado NUMBER,
        p_mes NUMBER,
        p_anio NUMBER
    )
    IS
        vn_neto NUMBER;
        vv_nombre VARCHAR2(100);
    BEGIN
        SELECT l.neto, e.first_name
        INTO vn_neto, vv_nombre
        FROM LIQUIDACIONES l
        JOIN EMPLOYEES e ON l.id_empleado = e.employee_id
        WHERE l.id_empleado = p_id_empleado
          AND l.mes = p_mes
          AND l.anio = p_anio;
        
        DBMS_OUTPUT.PUT_LINE('Empleado: ' || vv_nombre);
        DBMS_OUTPUT.PUT_LINE('Período: ' || p_mes || '/' || p_anio);
        DBMS_OUTPUT.PUT_LINE('Neto a pagar: $' || TO_CHAR(vn_neto, '9,999,999.99'));
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('No hay liquidación para ese período');
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20999, SQLERRM);
    END sp_consultar_liquidacion;

END pkg_nomina;
/
```

---

## 3. USAR EL PACKAGE

Una vez creado, usar el package es muy simple:

```sql
SET SERVEROUTPUT ON;

DECLARE
    vn_salario_base NUMBER := 2500000;
    vn_horas_nocturnas NUMBER := 10;
    vn_antiguedad NUMBER := 36;
    vn_neto NUMBER;

BEGIN
    DBMS_OUTPUT.PUT_LINE('===== USANDO PACKAGE pkg_nomina =====');
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Acceder a constantes del package
    DBMS_OUTPUT.PUT_LINE('Parámetros del package:');
    DBMS_OUTPUT.PUT_LINE('  Tasa de afiliación: ' || (pkg_nomina.cn_tasa_afiliacion * 100) || '%');
    DBMS_OUTPUT.PUT_LINE('  Tasa nocturna: ' || (pkg_nomina.cn_tasa_nocturna * 100) || '%');
    DBMS_OUTPUT.PUT_LINE('  Horas mensuales: ' || pkg_nomina.cn_horas_mensuales);
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Llamar funciones del package
    DBMS_OUTPUT.PUT_LINE('Cálculo de componentes:');
    DBMS_OUTPUT.PUT_LINE('  Base: $' || TO_CHAR(pkg_nomina.fn_calcular_base(vn_salario_base), '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('  Recargos: $' || TO_CHAR(pkg_nomina.fn_calcular_recargos(vn_salario_base, vn_horas_nocturnas), '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('  Bonificación: $' || TO_CHAR(pkg_nomina.fn_calcular_bonificacion(vn_salario_base, vn_antiguedad), '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Calcular neto total
    vn_neto := pkg_nomina.fn_calcular_neto(100, vn_salario_base, vn_horas_nocturnas, vn_antiguedad);
    DBMS_OUTPUT.PUT_LINE('Total neto: $' || TO_CHAR(vn_neto, '9,999,999.99'));
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Llamar procedimientos del package
    DBMS_OUTPUT.PUT_LINE('Operaciones:');
    pkg_nomina.sp_actualizar_salario(100, 3000000);
    pkg_nomina.sp_liquidar_empleado(100, 4, 2026);
    pkg_nomina.sp_consultar_liquidacion(100, 4, 2026);

END;
/
```

**Resultado esperado:**
```text
===== USANDO PACKAGE pkg_nomina =====

Parámetros del package:
  Tasa de afiliación: 4%
  Tasa nocturna: 35%
  Horas mensuales: 240

Cálculo de componentes:
  Base: $2,500,000.00
  Recargos: $  368,750.00
  Bonificación: $  250,000.00

Total neto: $3,012,000.00

Operaciones:
✓ Salario actualizado a: $3,000,000.00
✓ Liquidación procesada. Neto: $3,012,000.00
Empleado: Steven
Período: 4/2026
Neto a pagar: $3,012,000.00

PL/SQL procedure successfully completed.
```

---

## 4. ESTRUCTURA: ESPECIFICACIÓN vs BODY

### Especificación (pkg_nomina)
```
CREATE OR REPLACE PACKAGE pkg_nomina
IS
    -- SOLO DECLARACIONES (firmas)
    -- No hay implementación
    
    cn_tasa_afiliacion CONSTANT NUMBER := 0.04;
    FUNCTION fn_calcular_base(p_salario_base NUMBER) RETURN NUMBER;
    PROCEDURE sp_liquidar_empleado(p_id_empleado NUMBER, p_mes NUMBER, p_anio NUMBER);
    
END pkg_nomina;
```

### Body (pkg_nomina)
```
CREATE OR REPLACE PACKAGE BODY pkg_nomina
IS
    -- IMPLEMENTACIÓN REAL
    -- Código que se ejecuta
    
    FUNCTION fn_calcular_base(p_salario_base NUMBER) RETURN NUMBER
    IS
    BEGIN
        RETURN p_salario_base;
    END fn_calcular_base;
    
    PROCEDURE sp_liquidar_empleado(...)
    IS
    BEGIN
        -- Lógica aquí
    END sp_liquidar_empleado;
    
END pkg_nomina;
```

---

## 5. VENTAJAS DE PACKAGES

| Ventaja | Explicación |
|---------|------------|
| **Organización** | Agrupa código relacionado en una unidad |
| **Encapsulación** | Funciones privadas ocultas (no en especificación) |
| **Reutilización** | Importa el package, usas todas sus funciones |
| **Seguridad** | Solo expones lo que debe ser público |
| **Performance** | Se carga en memoria una sola vez |
| **Mantenimiento** | Actualizar el body sin afectar código que lo usa |
| **Documentación** | Especificación = contrato público claro |

---

## 6. COMPARACIÓN: CON y SIN PACKAGE

### SIN Package
```sql
-- Usuario debe llamar funciones sueltas
SELECT fn_calcular_base(...), fn_calcular_recargos(...), fn_calcular_neto(...);

-- Difícil encontrar dónde están
-- No hay organización
-- Riesgo de conflictos de nombres (otra app tiene fn_calcular_base)
```

### CON Package
```sql
-- Usuario llama a través del package
SELECT pkg_nomina.fn_calcular_base(...), pkg_nomina.fn_calcular_recargos(...);

-- Todo claramente en pkg_nomina
-- Nombres no compiten con otros packages
-- Lógica privada oculta en el body
```

---

## 7. CREAR MÚLTIPLES PACKAGES

Puedes crear varios packages para diferentes dominios:

```sql
-- Package de Nómina
CREATE OR REPLACE PACKAGE pkg_nomina IS ...

-- Package de Recursos Humanos
CREATE OR REPLACE PACKAGE pkg_rrhh IS ...

-- Package de Auditoría
CREATE OR REPLACE PACKAGE pkg_auditoria IS ...

-- Package de Utilidades (fechas, conversiones)
CREATE OR REPLACE PACKAGE pkg_util IS ...
```

Cada uno mantiene su propia lógica, sin interferencia.

---

## CONCLUSIÓN

Los packages son el equivalente a **clases en POO**:
- Especificación = interfaz pública
- Body = implementación privada
- Constantes = variables de clase
- Funciones/Procedimientos = métodos

**Regla:** Organiza todo el código PL/SQL relacionado en packages. Es la mejor práctica en Oracle.

```
Código sin packages: Desorden
Código con packages: Arquitectura profesional
```
