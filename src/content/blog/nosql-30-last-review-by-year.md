---
title: 'NoSQL 30: Ultimas Reviews por Anio'
description: 'Pipeline MongoDB que cuenta cuantas propiedades tuvieron last_review en cada anio.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Filtrar listings con `last_review` registrada y contar cuantas propiedades tuvieron su ultima revision en cada anio.

## Contexto
`$year` extrae el anio de una fecha y permite agrupar por periodos.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $match: {
      last_review: { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: { $year: "$last_review" },
      cantidad_listings: { $sum: 1 }
    }
  },
  {
    $sort: { _id: -1 }
  },
  {
    $project: {
      _id: 0,
      anio: "$_id",
      cantidad_listings: 1
    }
  }
]);
```

## Explicacion
1. `$match` descarta documentos sin fecha de review.
2. `$group` agrupa por anio de la ultima reseña.
3. `$sort` ordena del anio mas reciente al mas antiguo.

## Resultado Esperado
- Conteo de listings con ultima review por cada anio.
