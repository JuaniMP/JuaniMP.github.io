---
title: 'NoSQL 23: Top 5 Amenities Mas Comunes'
description: 'Pipeline MongoDB con $unwind y $group para obtener las amenidades mas repetidas en el dataset.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Mostrar las 5 amenities mas comunes en todo el dataset.

## Contexto
`$unwind` separa cada elemento de un arreglo para poder contarlo individualmente.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $unwind: "$amenities"
  },
  {
    $group: {
      _id: "$amenities",
      frecuencia: { $sum: 1 }
    }
  },
  {
    $sort: { frecuencia: -1 }
  },
  {
    $limit: 5
  }
]);
```

## Explicacion
1. `$unwind` convierte cada amenity en una fila separada.
2. `$group` cuenta cuantas veces aparece cada valor.
3. `$sort` y `$limit` dejan solo el top 5.

## Resultado Esperado
- Las cinco amenities mas frecuentes del dataset.
