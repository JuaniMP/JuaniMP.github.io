---
title: 'NoSQL 27: Bucket de Rangos de Precio'
description: 'Clasificacion en MongoDB de listings por rangos de precio con $bucket.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Agrupar listings en rangos de precio: 0-100, 101-300, 301-1000 y 1000+.

## Contexto
`$bucket` permite dividir datos numericos en intervalos definidos.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $match: {
      price: { $exists: true, $ne: null }
    }
  },
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 101, 301, 1000],
      default: "1000+",
      output: {
        cantidad: { $sum: 1 }
      }
    }
  }
]);
```

## Explicacion
1. Los limites de `boundaries` definen los intervalos.
2. `default` agrupa precios fuera de los rangos.
3. `output` resume cuantas propiedades caen en cada bucket.

## Resultado Esperado
- Distribucion de listings por rango de precio.
