---
title: 'NoSQL 29: Densidad de Huespedes por Property Type'
description: 'Consulta MongoDB para calcular el promedio de accommodates por tipo de propiedad y ordenar de mayor a menor.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Para cada `property_type`, calcular el promedio de `accommodates` y ordenar de mayor a menor.

## Contexto
Este ejercicio mide capacidad promedio por tipo de inmueble.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $match: {
      property_type: { $exists: true, $ne: null },
      accommodates: { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: "$property_type",
      promedio_huespedes: { $avg: "$accommodates" },
      total_listings: { $sum: 1 }
    }
  },
  {
    $sort: { promedio_huespedes: -1 }
  },
  {
    $project: {
      _id: 1,
      promedio_huespedes: { $round: ["$promedio_huespedes", 2] },
      total_listings: 1
    }
  }
]);
```

## Explicacion
1. `$match` asegura que ambos campos existan.
2. `$group` calcula el promedio de capacidad por tipo.
3. `$round` deja el resultado mas legible.

## Resultado Esperado
- Un ranking de tipos de propiedad segun su capacidad promedio.
