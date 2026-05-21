---
title: 'Proyecto 03: Auditoria MongoDB de ThinWallet'
description: 'Parte NoSQL de ThinWallet para registrar eventos y medir actividad financiera con patrones Bucket y Approximation.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Proyecto', 'ThinWallet', 'MongoDB', 'NoSQL']
---

## Enunciado
Explicar la parte MongoDB de ThinWallet y por que se usa para auditar eventos del sistema.

## Contexto
En ThinWallet, algunos eventos cambian mucho de estructura segun el tipo de accion. Por eso MongoDB encaja bien para guardar auditoria y métricas con documentos flexibles.

## Colecciones principales
```javascript
db.createCollection("actividad_circulo_diaria");
db.createCollection("indicadores_circulo");
```

## Patrones usados
1. **Bucket Pattern**: agrupa eventos por circulo y dia para no guardar un documento por cada accion.
2. **Approximation Pattern**: guarda indicadores calculados para leer rapido el estado del circulo.

## Explicacion
La coleccion de actividad guarda eventos como transacciones, deudas, pagos, metas o membresias. La coleccion de indicadores guarda resumenes como salud del circulo, nivel de actividad y tasa de friccion. Juntas permiten auditar ThinWallet sin complicar el modelo principal relacional.

## Resultado Esperado
- ThinWallet tiene una capa NoSQL para trazabilidad y analitica rapida.
- El proyecto combina MySQL para la operacion y MongoDB para observabilidad.
