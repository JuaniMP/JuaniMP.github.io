---
title: 'Proyecto 08: Auditoria MongoDB de ThinWallet'
description: 'Inicializacion de MongoDB en ThinWallet para registrar actividad del circulo y calcular indicadores.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Proyecto', 'ThinWallet', 'MongoDB', 'NoSQL']
---

## Enunciado
Explicar la inicializacion NoSQL de ThinWallet para registrar actividad del negocio y resumir indicadores.

## Contexto
ThinWallet usa MongoDB para almacenar eventos con estructura variable. Esto permite guardar transacciones, deudas, pagos, miembros y metas sin forzar una tabla rigida.

## Colecciones
```javascript
db.createCollection("actividad_circulo_diaria");
db.createCollection("indicadores_circulo");
```

## Patrones aplicados
1. **Bucket Pattern** para agrupar eventos por circulo y fecha.
2. **Approximation Pattern** para mantener indicadores calculados.

## Explicacion
El script de inicializacion crea indices para buscar por circulo, fecha y usuario. Ademas carga ejemplos de actividad y deja consultas de verificacion para el lider del circulo. Con esto, ThinWallet obtiene una capa de observabilidad ligera y flexible.

## Resultado Esperado
- ThinWallet cuenta con una base NoSQL preparada para auditoria y analitica.
- El proyecto mantiene separada la operacion relacional de la observabilidad documental.
