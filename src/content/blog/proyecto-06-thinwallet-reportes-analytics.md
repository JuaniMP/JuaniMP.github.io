---
title: 'Proyecto 06: Reportes y Analytics de ThinWallet'
description: 'Procedimientos de reporte en ThinWallet para estado de cuenta, analisis de circulos, deudores y auditoria.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Proyecto', 'ThinWallet', 'MySQL', 'Reportes']
---

## Enunciado
Mostrar los reportes analiticos de ThinWallet para entender estados de cuenta, circulos y pagos.

## Contexto
Estos procedimientos producen vistas listas para consulta: resumen mensual, analisis por circulo, deudores pendientes, auditoria historica e historial de pagos.

## Reportes clave
```sql
CREATE PROCEDURE sp_reporte_estado_cuenta_mensual(...)
CREATE PROCEDURE sp_reporte_analisis_circulo(...)
CREATE PROCEDURE sp_reporte_deudores_pendientes(...)
CREATE PROCEDURE sp_reporte_auditoria(...)
CREATE PROCEDURE sp_reporte_historial_pagos(...)
```

## Explicacion
1. El estado de cuenta mensual separa ingresos, egresos y gastos hormiga.
2. El analisis de circulo resume miembros, deudas y categorias mas usadas.
3. El reporte de auditoria permite filtrar cambios por fecha y por usuario.
4. El historial de pagos muestra el seguimiento de cada deuda en un rango de tiempo.

## Resultado Esperado
- ThinWallet ofrece reportes de finanzas listos para el usuario final.
- El proyecto puede dar soporte a paneles, resumenes y decisiones de gestion.
