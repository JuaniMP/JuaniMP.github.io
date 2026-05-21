---
title: 'Proyecto 02: Esquema MySQL de ThinWallet'
description: 'Modelo relacional principal de ThinWallet con tablas, relaciones, indices y auditoria para finanzas personales.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Proyecto', 'ThinWallet', 'MySQL', 'DDL']
---

## Enunciado
Explicar la base relacional de ThinWallet y como soporta la gestion de finanzas personales.

## Contexto
El esquema en MySQL organiza usuarios, circulos de gasto, categorias, gastos, transacciones, deudas y auditoria en una estructura normalizada.

## Piezas principales
```sql
CREATE TABLE usuario (...);
CREATE TABLE circulo_gasto (...);
CREATE TABLE usuario_circulo (...);
CREATE TABLE categoria (...);
CREATE TABLE gasto (...);
CREATE TABLE transaccion (...);
CREATE TABLE deuda (...);
CREATE TABLE usuario_gasto (...);
CREATE TABLE auditoria_sistema (...);
```

## Explicacion
1. `usuario` guarda identidad, correo y estado.
2. `circulo_gasto` representa grupos como familia, pareja o amigos.
3. `transaccion` registra ingresos y egresos.
4. `deuda` controla lo que un miembro debe a otro.
5. `auditoria_sistema` conserva el historial de cambios para trazabilidad.

## Idea de diseño
El modelo busca evitar duplicidad, facilitar consultas y mantener integridad referencial. Por eso usa llaves foraneas, restricciones `UNIQUE`, relaciones muchos a muchos y una tabla de auditoria separada.

## Resultado Esperado
- Base de datos normalizada y lista para operar ThinWallet.
- Estructura preparada para reportes, triggers y procedimientos almacenados.
