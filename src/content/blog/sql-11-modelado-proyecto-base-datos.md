---
title: 'Proyecto SQL 11: Modelado de ThinWallet'
description: 'Modelo relacional de ThinWallet, nuestro proyecto de finanzas personales, con tablas, restricciones, indices y auditoria.'
pubDate: 'Apr 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['SQL', 'MySQL', 'DDL', 'DML', 'Proyecto']
---

## Enunciado
Diseñar la base de datos principal de ThinWallet sobre una estructura normalizada en MySQL, incluyendo limpieza inicial, tablas base, llaves primarias, llaves foraneas, indices y una tabla de auditoria.

## Contexto
ThinWallet es nuestro proyecto de finanzas personales y gastos compartidos. Este modelo organiza la informacion de usuarios, circulos de gasto, categorias, gastos, transacciones, deudas y auditoria del sistema. La idea fue construir una base consistente en **3FN** para soportar crecimiento, trazabilidad y reglas de negocio sin duplicar datos innecesariamente.

## Solucion SQL
```sql
-- ======================================================================
-- LIMPIEZA DE TABLAS (orden inverso para evitar errores por FKs)
-- ======================================================================
DROP TABLE IF EXISTS auditoria_sistema;
DROP TABLE IF EXISTS usuario_gasto;
DROP TABLE IF EXISTS deuda;
DROP TABLE IF EXISTS transaccion;
DROP TABLE IF EXISTS gasto;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS usuario_circulo;
DROP TABLE IF EXISTS circulo_gasto;
DROP TABLE IF EXISTS usuario;

-- ======================================================================
-- MODELO DE DATOS UNIFICADO - DDL EN MYSQL
-- ======================================================================

-- 1) TABLA usuario
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    nombre_usuario VARCHAR(50),
    correo VARCHAR(150) NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL,
    token_reclamo VARCHAR(255),
    descripcion VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT(1) DEFAULT 1,
    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuario_correo UNIQUE (correo)
);

-- 2) TABLA circulo_gasto
CREATE TABLE circulo_gasto (
    id_circulo_gasto INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    moneda_base VARCHAR(10) DEFAULT 'USD',
    token_invitacion VARCHAR(255),
    tipo_circulo VARCHAR(50),
    presupuesto_grupal DECIMAL(15,2) DEFAULT 0.00,
    permite_mesadas TINYINT(1) DEFAULT 0,
    permite_simplificacion_deudas TINYINT(1) DEFAULT 1,
    id_usuario_creador INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT(1) DEFAULT 1,
    CONSTRAINT pk_circulo_gasto PRIMARY KEY (id_circulo_gasto),
    CONSTRAINT fk_circulo_creador FOREIGN KEY (id_usuario_creador) REFERENCES usuario(id_usuario),
    INDEX idx_token_invitacion (token_invitacion)
);

-- 3) TABLA usuario_circulo
CREATE TABLE usuario_circulo (
    id_usuario INT NOT NULL,
    id_circulo_gasto INT NOT NULL,
    rol_usuario VARCHAR(50) DEFAULT 'MIEMBRO',
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuario_circulo PRIMARY KEY (id_usuario, id_circulo_gasto),
    CONSTRAINT fk_uc_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_uc_circulo FOREIGN KEY (id_circulo_gasto) REFERENCES circulo_gasto(id_circulo_gasto) ON DELETE CASCADE
);

-- 4) TABLA categoria
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    tipo_categoria VARCHAR(50),
    exclusiva_perfil_solo TINYINT(1) DEFAULT 0,
    frecuencia_uso INT DEFAULT 0,
    estado TINYINT(1) DEFAULT 1,
    id_circulo_gasto INT,
    CONSTRAINT pk_categoria PRIMARY KEY (id_categoria),
    CONSTRAINT fk_cat_circulo FOREIGN KEY (id_circulo_gasto) REFERENCES circulo_gasto(id_circulo_gasto) ON DELETE SET NULL
);

-- 5) TABLA gasto
CREATE TABLE gasto (
    id_gasto INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    periodicidad VARCHAR(50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL DEFAULT NULL,
    estado TINYINT(1) DEFAULT 1,
    id_usuario_creador INT NOT NULL,
    id_circulo_gasto INT,
    id_categoria INT NOT NULL,
    CONSTRAINT pk_gasto PRIMARY KEY (id_gasto),
    CONSTRAINT fk_gas_usuario FOREIGN KEY (id_usuario_creador) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_gas_circulo FOREIGN KEY (id_circulo_gasto) REFERENCES circulo_gasto(id_circulo_gasto),
    CONSTRAINT fk_gas_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

-- 6) TABLA transaccion
CREATE TABLE transaccion (
    id_transaccion INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100),
    monto_original DECIMAL(15,2) NOT NULL,
    moneda_original VARCHAR(10),
    tasa_cambio DECIMAL(10,4) DEFAULT 1.0000,
    tipo_movimiento VARCHAR(50) NOT NULL,
    modalidad_division VARCHAR(50),
    contexto VARCHAR(255),
    fecha_ejecucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT(1) DEFAULT 1,
    id_usuario INT NOT NULL,
    id_circulo_gasto INT,
    id_categoria INT NOT NULL,
    id_gasto INT,
    CONSTRAINT pk_transaccion PRIMARY KEY (id_transaccion),
    CONSTRAINT fk_trx_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_trx_circulo FOREIGN KEY (id_circulo_gasto) REFERENCES circulo_gasto(id_circulo_gasto),
    CONSTRAINT fk_trx_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    CONSTRAINT fk_trx_gasto_prog FOREIGN KEY (id_gasto) REFERENCES gasto(id_gasto)
);

-- 7) TABLA deuda
CREATE TABLE deuda (
    id_deuda INT AUTO_INCREMENT NOT NULL,
    monto DECIMAL(15,2) NOT NULL,
    metodo_pago_sugerido VARCHAR(50),
    porcentaje_division DECIMAL(5,2),
    estado_pago VARCHAR(50) DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_confirmada TIMESTAMP NULL DEFAULT NULL,
    fecha_pago TIMESTAMP NULL DEFAULT NULL,
    id_transaccion INT NOT NULL,
    id_usuario_deudor INT NOT NULL,
    id_usuario_acreedor INT NOT NULL,
    CONSTRAINT pk_deuda PRIMARY KEY (id_deuda),
    CONSTRAINT fk_deuda_trx FOREIGN KEY (id_transaccion) REFERENCES transaccion(id_transaccion),
    CONSTRAINT fk_deuda_deudor FOREIGN KEY (id_usuario_deudor) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_deuda_acreedor FOREIGN KEY (id_usuario_acreedor) REFERENCES usuario(id_usuario)
);

-- 8) TABLA usuario_gasto
CREATE TABLE usuario_gasto (
    id_usuario INT NOT NULL,
    id_gasto INT NOT NULL,
    CONSTRAINT pk_usuario_gasto PRIMARY KEY (id_usuario, id_gasto),
    CONSTRAINT fk_ug_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_ug_gasto FOREIGN KEY (id_gasto) REFERENCES gasto(id_gasto)
);

-- 9) TABLA auditoria_sistema
CREATE TABLE auditoria_sistema (
    id_auditoria INT AUTO_INCREMENT NOT NULL,
    id_usuario INT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    registro_id VARCHAR(50) NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT') NOT NULL,
    valores_anteriores JSON,
    valores_nuevos JSON,
    direccion_ip VARCHAR(45),
    user_agent VARCHAR(255),
    ruta_endpoint VARCHAR(255),
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_auditoria PRIMARY KEY (id_auditoria),
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    INDEX idx_audi_tabla_registro (tabla_afectada, registro_id),
    INDEX idx_audi_fecha (fecha_accion),
    INDEX idx_audi_usuario (id_usuario)
);
```

## Explicacion

### 1. Limpieza inicial
Se usan `DROP TABLE IF EXISTS` en orden inverso para evitar errores por dependencias entre llaves foraneas. Primero se eliminan las tablas hijas y al final las tablas maestras.

### 2. Tabla usuario
Es la entidad central del proyecto. Guarda identidad, correo unico, hash de contrasena, tipo de usuario y estado. La llave primaria es `id_usuario` y el correo se protege con `UNIQUE`.

### 3. Tabla circulo_gasto
Representa los grupos o circulos donde se comparten gastos. Se relaciona con el usuario creador mediante `id_usuario_creador` y tiene atributos como moneda base, presupuesto, token de invitacion y banderas de funcionalidad.

### 4. Tabla usuario_circulo
Resuelve la relacion muchos a muchos entre usuarios y circulos. Usa llave primaria compuesta (`id_usuario`, `id_circulo_gasto`) y elimina automaticamente los registros relacionados si se borra el usuario o el circulo.

### 5. Tabla categoria
Clasifica los gastos. Puede estar asociada a un circulo o quedar sin relacion cuando el circulo se elimina, gracias a `ON DELETE SET NULL`.

### 6. Tabla gasto
Modela los gastos recurrentes o puntuales. Se conecta con el usuario creador, el circulo y la categoria para mantener el origen completo del registro.

### 7. Tabla transaccion
Registra cada movimiento financiero del sistema. Incluye moneda original, tasa de cambio, modalidad de division, contexto y referencias al usuario, circulo, categoria y gasto programado.

### 8. Tabla deuda
Guarda los saldos pendientes entre usuarios. Se liga a una transaccion base y define deudor, acreedor, forma sugerida de pago y fechas del ciclo de cobro.

### 9. Tabla usuario_gasto
Relaciona usuarios con gastos concretos. Sirve para saber que personas participan en cada gasto compartido.

### 10. Tabla auditoria_sistema
Registra eventos del sistema con trazabilidad completa: tabla afectada, accion, valores antes/despues, IP, user agent y endpoint. El campo `JSON` permite guardar la version estructurada de los cambios.

## Como se hizo

1. Se partio de una limpieza completa para poder recrear el esquema desde cero.
2. Se definieron primero las tablas maestras (`usuario`, `circulo_gasto`, `categoria`) y luego las dependientes.
3. Se aplicaron restricciones de integridad para evitar datos inconsistentes.
4. Se usaron relaciones `CASCADE` y `SET NULL` segun el comportamiento de negocio esperado.
5. Se agregaron indices donde hay busquedas frecuentes, como tokens, auditoria y usuarios.
6. Se dejo una tabla de auditoria separada para no mezclar el historico con los datos operativos.

## Resultado Esperado
- Base de datos creada en MySQL con estructura normalizada para ThinWallet.
- Integridad referencial protegida por llaves foraneas.
- Relaciones muchos a muchos resueltas correctamente.
- Auditoria preparada para trazabilidad de operaciones.
- Modelo listo para extenderse con reglas de negocio y consultas del proyecto.
