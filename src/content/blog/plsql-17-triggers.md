---
title: 'PL/SQL 17: Triggers - Disparadores de Base de Datos'
description: 'Crear triggers (BEFORE/AFTER, INSERT/UPDATE/DELETE) para automatizar acciones en la BD.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL', 'Triggers', 'Automatización']
---

## Enunciado
Los **triggers** son bloques de código que se ejecutan **automáticamente** cuando ocurren eventos en la base de datos (INSERT, UPDATE, DELETE). Crear triggers para auditoría, validación y mantenimiento de integridad.

## Contexto
Un trigger es un "vigilante" de la base de datos. Cada vez que alguien intenta insertar, actualizar o eliminar un registro, el trigger se dispara automáticamente.

```
Usuario: INSERT INTO EMPLOYEES ...
    ↓
Trigger BEFORE INSERT: Validación
    ↓
Operación INSERT
    ↓
Trigger AFTER INSERT: Auditoría, cálculos
    ↓
Registro insertado
```

---

## 1. TRIGGER PARA AUDITORÍA (AFTER INSERT)

### Crear tabla de auditoría
```sql
CREATE TABLE AUDITORIA_EMPLEADOS (
    id_auditoria    NUMBER PRIMARY KEY,
    id_empleado     NUMBER,
    accion          VARCHAR2(10), -- INSERT, UPDATE, DELETE
    usuario         VARCHAR2(100),
    fecha_accion    DATE,
    valores_antiguos CLOB,
    valores_nuevos  CLOB
);

CREATE SEQUENCE SEQ_AUDITORIA START WITH 1 INCREMENT BY 1;
```

### Trigger para registrar insertados
```sql
CREATE OR REPLACE TRIGGER tgr_auditoria_insert_empleados
AFTER INSERT ON EMPLOYEES
FOR EACH ROW
BEGIN
    INSERT INTO AUDITORIA_EMPLEADOS (
        id_auditoria,
        id_empleado,
        accion,
        usuario,
        fecha_accion,
        valores_nuevos
    ) VALUES (
        SEQ_AUDITORIA.NEXTVAL,
        :NEW.employee_id,
        'INSERT',
        USER,
        SYSDATE,
        'ID: ' || :NEW.employee_id || ', Nombre: ' || :NEW.first_name || ', Salario: ' || :NEW.salary
    );
END tgr_auditoria_insert_empleados;
/
```

**Explicación:**
- `AFTER INSERT`: Se ejecuta **después** de insertar
- `:NEW`: Variables que contienen los valores nuevos
- `USER`: Variable Oracle que contiene el usuario actual
- `FOR EACH ROW`: Se ejecuta una vez por cada fila insertada

---

## 2. TRIGGER PARA VALIDACIÓN (BEFORE INSERT/UPDATE)

### Validar salario mínimo antes de insertar/actualizar
```sql
CREATE OR REPLACE TRIGGER tgr_validar_salario
BEFORE INSERT OR UPDATE ON EMPLOYEES
FOR EACH ROW
DECLARE
    cn_salario_minimo CONSTANT NUMBER := 1000000; -- $1.000.000 COP
BEGIN
    -- Si el salario es menor al mínimo, lanzar error
    IF :NEW.salary < cn_salario_minimo THEN
        RAISE_APPLICATION_ERROR(
            -20001,
            'Error: El salario mínimo es $' || cn_salario_minimo || 
            '. Intentó ingresar: $' || :NEW.salary
        );
    END IF;
    
    -- Si el nombre está vacío, asignar valor por defecto
    IF :NEW.first_name IS NULL THEN
        :NEW.first_name := 'SIN NOMBRE';
    END IF;
    
    -- Registrar la fecha de última actualización
    :NEW.last_update := SYSDATE;
    
END tgr_validar_salario;
/
```

**Explicación:**
- `BEFORE INSERT OR UPDATE`: Se ejecuta **antes** de la operación
- Puede modificar `:NEW` para cambiar los valores antes de guardar
- Si lanza error, la operación se cancela (ROLLBACK automático)

---

## 3. TRIGGER PARA ACTUALIZAR AUDITORÍA (AFTER UPDATE)

### Registrar cambios de salario
```sql
CREATE OR REPLACE TRIGGER tgr_auditoria_update_empleados
AFTER UPDATE ON EMPLOYEES
FOR EACH ROW
DECLARE
    vv_cambios VARCHAR2(500);
BEGIN
    -- Si el salario cambió, registrar
    IF :NEW.salary <> :OLD.salary THEN
        vv_cambios := 'Salario cambió de $' || :OLD.salary || 
                      ' a $' || :NEW.salary;
    END IF;
    
    -- Si el nombre cambió, registrar
    IF :NEW.first_name <> :OLD.first_name THEN
        vv_cambios := vv_cambios || ' | Nombre: ' || :OLD.first_name || 
                      ' → ' || :NEW.first_name;
    END IF;
    
    -- Insertar en tabla de auditoría
    IF vv_cambios IS NOT NULL THEN
        INSERT INTO AUDITORIA_EMPLEADOS (
            id_auditoria,
            id_empleado,
            accion,
            usuario,
            fecha_accion,
            valores_antiguos,
            valores_nuevos
        ) VALUES (
            SEQ_AUDITORIA.NEXTVAL,
            :NEW.employee_id,
            'UPDATE',
            USER,
            SYSDATE,
            'Salario anterior: $' || :OLD.salary || ', Nombre: ' || :OLD.first_name,
            'Salario nuevo: $' || :NEW.salary || ', Nombre: ' || :NEW.first_name
        );
    END IF;

END tgr_auditoria_update_empleados;
/
```

**Explicación:**
- `:OLD`: Contiene los valores **anteriores** a la actualización
- `:NEW`: Contiene los valores **nuevos**
- Solo registra si hubo cambios reales

---

## 4. TRIGGER PARA CASCADA DE ACCIONES (BEFORE DELETE)

### Prevenir eliminación si tiene registros dependientes
```sql
CREATE OR REPLACE TRIGGER tgr_validar_delete_empleado
BEFORE DELETE ON EMPLOYEES
FOR EACH ROW
DECLARE
    vn_count NUMBER;
BEGIN
    -- Verificar si el empleado tiene liquidaciones pendientes
    SELECT COUNT(*)
    INTO vn_count
    FROM LIQUIDACIONES
    WHERE id_empleado = :OLD.employee_id
      AND estado = 'PENDIENTE';
    
    IF vn_count > 0 THEN
        RAISE_APPLICATION_ERROR(
            -20002,
            'No se puede eliminar el empleado ' || :OLD.employee_id || 
            ' porque tiene ' || vn_count || ' liquidaciones pendientes.'
        );
    END IF;
    
    -- Si no hay pendientes, registrar la eliminación
    INSERT INTO AUDITORIA_EMPLEADOS (
        id_auditoria,
        id_empleado,
        accion,
        usuario,
        fecha_accion,
        valores_nuevos
    ) VALUES (
        SEQ_AUDITORIA.NEXTVAL,
        :OLD.employee_id,
        'DELETE',
        USER,
        SYSDATE,
        'Empleado eliminado: ' || :OLD.first_name || ' (ID: ' || :OLD.employee_id || ')'
    );

END tgr_validar_delete_empleado;
/
```

---

## 5. TRIGGER PARA ACTUALIZAR TOTALES (AFTER INSERT)

### Actualizar totales en tabla padre automáticamente
```sql
-- Crear tabla de departamentos con totales
CREATE TABLE DEPARTAMENTOS (
    id_departamento NUMBER PRIMARY KEY,
    nombre_departamento VARCHAR2(100),
    cantidad_empleados NUMBER DEFAULT 0,
    suma_salarios NUMBER DEFAULT 0,
    promedio_salario NUMBER DEFAULT 0,
    fecha_actualizacion DATE
);

-- Trigger para actualizar automáticamente cuando se inserta un empleado
CREATE OR REPLACE TRIGGER tgr_actualizar_totales_depto_insert
AFTER INSERT ON EMPLOYEES
FOR EACH ROW
BEGIN
    UPDATE DEPARTAMENTOS
    SET cantidad_empleados = cantidad_empleados + 1,
        suma_salarios = suma_salarios + :NEW.salary,
        promedio_salario = (suma_salarios + :NEW.salary) / (cantidad_empleados + 1),
        fecha_actualizacion = SYSDATE
    WHERE id_departamento = :NEW.department_id;
    
    COMMIT;

END tgr_actualizar_totales_depto_insert;
/

-- Trigger para actualizar cuando se elimina un empleado
CREATE OR REPLACE TRIGGER tgr_actualizar_totales_depto_delete
AFTER DELETE ON EMPLOYEES
FOR EACH ROW
BEGIN
    UPDATE DEPARTAMENTOS
    SET cantidad_empleados = cantidad_empleados - 1,
        suma_salarios = suma_salarios - :OLD.salary,
        promedio_salario = CASE 
                           WHEN cantidad_empleados - 1 = 0 THEN 0
                           ELSE (suma_salarios - :OLD.salary) / (cantidad_empleados - 1)
                           END,
        fecha_actualizacion = SYSDATE
    WHERE id_departamento = :OLD.department_id;
    
    COMMIT;

END tgr_actualizar_totales_depto_delete;
/
```

---

## 6. BLOQUE DE PRUEBA COMPLETO

```sql
SET SERVEROUTPUT ON;

DECLARE
    vv_nombre       VARCHAR2(100);
    vn_salario      NUMBER;
    vn_id_nuevo     NUMBER;

BEGIN
    DBMS_OUTPUT.PUT_LINE('===== PRUEBA DE TRIGGERS =====');
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Prueba 1: Insertar empleado válido
    DBMS_OUTPUT.PUT_LINE('Prueba 1: Insertar empleado con salario válido');
    BEGIN
        vn_id_nuevo := 999;
        INSERT INTO EMPLOYEES (employee_id, first_name, salary, department_id)
        VALUES (vn_id_nuevo, 'Juan Pérez', 2500000, 80);
        
        DBMS_OUTPUT.PUT_LINE('✓ Empleado insertado correctamente');
        DBMS_OUTPUT.PUT_LINE('  Trigger tgr_auditoria_insert_empleados se ejecutó');
        DBMS_OUTPUT.PUT_LINE('  Tabla AUDITORIA_EMPLEADOS actualizada');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error: ' || SQLERRM);
    END;
    
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Prueba 2: Intentar insertar con salario muy bajo
    DBMS_OUTPUT.PUT_LINE('Prueba 2: Intentar insertar con salario < $1.000.000');
    BEGIN
        INSERT INTO EMPLOYEES (employee_id, first_name, salary, department_id)
        VALUES (998, 'María López', 500000, 80);
        
        DBMS_OUTPUT.PUT_LINE('✓ Insertado');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('✗ Trigger bloqueó la inserción: ' || SQLERRM);
    END;
    
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Prueba 3: Actualizar salario
    DBMS_OUTPUT.PUT_LINE('Prueba 3: Actualizar salario del empleado 999');
    BEGIN
        UPDATE EMPLOYEES
        SET salary = 3000000
        WHERE employee_id = vn_id_nuevo;
        
        DBMS_OUTPUT.PUT_LINE('✓ Salario actualizado');
        DBMS_OUTPUT.PUT_LINE('  Trigger tgr_auditoria_update_empleados se ejecutó');
        DBMS_OUTPUT.PUT_LINE('  Cambio registrado en AUDITORIA_EMPLEADOS');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('✗ Error: ' || SQLERRM);
    END;
    
    DBMS_OUTPUT.PUT_LINE('');
    
    -- Prueba 4: Consultar auditoría
    DBMS_OUTPUT.PUT_LINE('Prueba 4: Consultar registros de auditoría');
    FOR auditoria IN (
        SELECT id_auditoria, id_empleado, accion, usuario, valores_nuevos
        FROM AUDITORIA_EMPLEADOS
        WHERE id_empleado = vn_id_nuevo
        ORDER BY fecha_accion
    ) LOOP
        DBMS_OUTPUT.PUT_LINE('  [' || auditoria.accion || '] ' || auditoria.valores_nuevos);
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('===== CONCLUSIÓN =====');
    DBMS_OUTPUT.PUT_LINE('Los triggers automatizaron:');
    DBMS_OUTPUT.PUT_LINE('  ✓ Auditoría de cambios');
    DBMS_OUTPUT.PUT_LINE('  ✓ Validación de datos');
    DBMS_OUTPUT.PUT_LINE('  ✓ Actualización de totales');
    DBMS_OUTPUT.PUT_LINE('  Sin necesidad de código en la aplicación');

END;
/
```

**Resultado esperado:**
```text
===== PRUEBA DE TRIGGERS =====

Prueba 1: Insertar empleado con salario válido
✓ Empleado insertado correctamente
  Trigger tgr_auditoria_insert_empleados se ejecutó
  Tabla AUDITORIA_EMPLEADOS actualizada

Prueba 2: Intentar insertar con salario < $1.000.000
✗ Trigger bloqueó la inserción: ORA-20001: Error: El salario mínimo es $1000000. Intentó ingresar: $500000

Prueba 3: Actualizar salario del empleado 999
✓ Salario actualizado
  Trigger tgr_auditoria_update_empleados se ejecutó
  Cambio registrado en AUDITORIA_EMPLEADOS

Prueba 4: Consultar registros de auditoría
  [INSERT] ID: 999, Nombre: Juan Pérez, Salario: 2500000
  [UPDATE] Salario nuevo: $3000000, Nombre: Juan Pérez

===== CONCLUSIÓN =====
Los triggers automatizaron:
  ✓ Auditoría de cambios
  ✓ Validación de datos
  ✓ Actualización de totales
  Sin necesidad de código en la aplicación
```

---

## TIPOS DE TRIGGERS

| Tipo | Cuándo | Uso |
|------|--------|-----|
| **BEFORE INSERT** | Antes de insertar | Validar, asignar valores por defecto |
| **AFTER INSERT** | Después de insertar | Auditoría, actualizar totales |
| **BEFORE UPDATE** | Antes de actualizar | Validar, modificar valores |
| **AFTER UPDATE** | Después de actualizar | Auditoría, cascada de cambios |
| **BEFORE DELETE** | Antes de eliminar | Validar, prevenir eliminación |
| **AFTER DELETE** | Después de eliminar | Auditoría, limpiar datos |

---

## VENTAJAS DE TRIGGERS

✓ **Automatización:** Sin código en la aplicación  
✓ **Auditoría:** Registro automático de cambios  
✓ **Validación centralizada:** Una sola regla en la BD  
✓ **Integridad referencial:** Previene datos inconsistentes  
✓ **Performance:** Lógica en la BD es más rápida que en app  

## DESVENTAJAS

✗ **Complejidad:** Difícil de debuggear  
✗ **Rendimiento:** Pueden ralentizar operaciones masivas  
✗ **Invisibilidad:** Lógica "oculta" no evidente en código  
✗ **Cascada:** Trigger que dispara otro trigger = complejidad  

---

## CONCLUSIÓN

Los triggers son herramientas poderosas para:
- Mantener auditoría automática
- Validar datos en la BD (no en la aplicación)
- Actualizar valores derivados
- Prevenir operaciones peligrosas

**Regla:** Usa triggers para lógica de **base de datos**, no de **negocio**.
