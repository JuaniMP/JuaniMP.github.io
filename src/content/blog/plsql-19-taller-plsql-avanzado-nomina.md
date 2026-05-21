---
title: 'PL/SQL 19: Taller Avanzado de Nomina (Explicado)'
description: 'Explicacion completa del taller PL/SQL avanzado: bloque anonimo, funciones, procedimiento, package, trigger compound y pruebas.'
pubDate: 'May 21 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['PL/SQL', 'Oracle', 'Nomina', 'Avanzado']
---

## Objetivo del taller

Este taller construye un flujo completo de nomina quincenal en Oracle, desde el calculo individual hasta el procesamiento masivo, con auditoria y control de reglas de negocio.

Estructura principal del entregable:

1. Bloque anonimo de liquidacion base.
2. Funciones standalone para componentes de la nomina.
3. Procedimiento transaccional con validaciones y deducciones.
4. Package con sobrecarga, bulk collect, forall y funcion pipelined.
5. Trigger compound para ajustes y auditoria automatica.

## Punto 1: Bloque anonimo (liquidacion quincenal)

### Que hace

Calcula el subtotal quincenal de un empleado con tres reglas:

1. Salario base segun tipo de contrato.
2. Recargos por tipo de hora (nocturna, dominical, nocturna dominical).
3. Bonificacion por antiguedad condicionada por sanciones.

### Por que es importante

Es la base funcional del taller: valida el modelo de datos y aterriza la logica de negocio antes de encapsularla en funciones y procedimientos reutilizables.

### Resumen de reglas

1. `PLANTA`: base quincenal = salario / 2.
2. `SERVICIOS`: aplica retencion y luego divide en quincena.
3. `TEMPORAL`: base quincenal depende de horas `NORMAL`.
4. Solo `PLANTA` y `TEMPORAL` reciben recargos.
5. Bono por antiguedad solo si sanciones en 6 meses <= 2.

## Punto 2: Funciones standalone

Se separa la logica en funciones para hacer el calculo modular, probabile y reutilizable.

### `fn_salario_base_q`

Responsable del valor base de la quincena segun contrato.

### `fn_recargos`

Recorre horas reportadas y acumula recargos por porcentaje de parametros.

### `fn_bonificacion`

Aplica bono por antiguedad, validando sanciones recientes.

### `fn_bruto`

Consolida base + recargos + bonificacion y agrega beneficios adicionales (auxilio transporte y bono sede cuando aplica).

### Ventaja tecnica

Separar estas funciones evita duplicar formulas y facilita mantenimiento: si cambia una regla, se modifica en un solo sitio.

## Punto 3: Procedimiento `sp_liquidar_empleado`

### Que resuelve

Realiza el flujo completo de liquidacion de un empleado para una quincena:

1. Validaciones de existencia, estado activo y duplicado.
2. Calculo de ingresos llamando funciones.
3. Calculo de deducciones (salud, pension, fondo, libranzas, embargos, aporte voluntario).
4. Control de neto negativo.
5. Insercion en `LIQUIDACION` y `COMMIT`.

### Valor funcional

Convierte logica de calculo en un proceso transaccional listo para operacion real.

## Punto 4: Package `pkg_nomina`

### Que aporta

Agrupa API publica de nomina y encapsula logica interna.

Contiene:

1. Sobrecarga de `sp_liquidar_quincena` (individual y masiva).
2. `fn_total_nomina_sede` para consolidado por sede/quincena.
3. Funcion pipelined `fn_reporte_nomina`.
4. Logging autonomo con `sp_log_nomina`.
5. Procesamiento masivo con `BULK COLLECT` + `FORALL SAVE EXCEPTIONS`.

### Por que es clave

El package organiza el dominio de nomina como un servicio reutilizable y escalable.

## Punto 5: Trigger compound `tgr_liq_compound`

### Que controla

1. `BEFORE EACH ROW`: valida salario base no negativo y ajusta deducciones si neto queda negativo.
2. `AFTER EACH ROW`: registra alertas y actualiza estado/saldo de libranzas.
3. `AFTER STATEMENT`: registra cierre de lote.

### Beneficio

Refuerza la integridad en capa de base de datos, incluso cuando los inserts vienen de diferentes procesos.

## Pruebas incluidas en el taller

El script contempla pruebas de:

1. Error por empleado inexistente.
2. Liquidacion individual de casos validos.
3. Ejecucion masiva por quincena.
4. Disparo de trigger por salario negativo.
5. Ajustes automaticos por neto negativo.
6. Consultas de verificacion sobre `LIQUIDACION` y `LOG_NOMINA`.

## Conclusiones del desarrollo

Este taller integra buenas practicas de PL/SQL avanzado:

1. Parametrizacion en tabla (`PARAMETROS`) para no quemar valores.
2. Reutilizacion por funciones y package.
3. Control transaccional y manejo de excepciones.
4. Procesamiento masivo eficiente con `FORALL`.
5. Auditoria tecnica y funcional en tabla de logs.

En conjunto, no es solo un ejercicio academico: es una base robusta para un modulo real de nomina en Oracle.
