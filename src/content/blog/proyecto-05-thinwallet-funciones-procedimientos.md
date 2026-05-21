---
title: 'Proyecto 05: Funciones y Procedimientos de ThinWallet'
description: 'Funciones y procedimientos almacenados de ThinWallet para calcular deuda, crear transacciones y cerrar ciclos.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Proyecto', 'ThinWallet', 'MySQL', 'Procedimientos']
---

## Enunciado
Explicar las funciones y procedimientos almacenados de ThinWallet que automatizan operaciones comunes.

## Contexto
ThinWallet usa procedimientos para encapsular logica compleja de negocio como pagos, cierre mensual, creacion de transacciones y reparto de deudas.

## Funciones principales
```sql
CREATE FUNCTION fn_calcular_deuda_usuario(...)
CREATE FUNCTION fn_tasa_friccion_circulo(...)
CREATE FUNCTION fn_contar_gastos_hormiga(...)
CREATE FUNCTION fn_balance_usuario_periodo(...)
```

## Procedimientos principales
```sql
CREATE PROCEDURE sp_crear_transaccion(...)
CREATE PROCEDURE sp_calcular_deudas(...)
CREATE PROCEDURE sp_pagar_deuda(...)
CREATE PROCEDURE sp_confirmar_pago_deuda(...)
CREATE PROCEDURE sp_cerrar_ciclo_mensual(...)
CREATE PROCEDURE sp_asignar_mesada(...)
CREATE PROCEDURE sp_reclamar_perfil_fantasma(...)
```

## Explicacion
1. Las funciones devuelven calculos reutilizables, como deuda o balance.
2. Los procedimientos ejecutan flujos completos con transacciones, validaciones y mensajes de salida.
3. `sp_crear_transaccion` puede disparar el calculo automatico de deudas cuando hay gasto compartido.
4. `sp_cerrar_ciclo_mensual` ayuda a cerrar periodos solo cuando no hay deudas pendientes.

## Resultado Esperado
- ThinWallet centraliza la logica critica en la base de datos.
- Los procesos de pago, deuda y cierre mensual quedan estandarizados.
