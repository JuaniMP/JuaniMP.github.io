---
title: 'NoSQL 26: Analisis de Review Scores'
description: 'Pipeline MongoDB que filtra listings con al menos 10 reviews y calcula el promedio de review_scores.review_scores_rating.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Filtrar listings con al menos 10 reviews y calcular el promedio de `review_scores.review_scores_rating`.

## Contexto
Este ejercicio combina filtrado previo, agrupacion y redondeo del resultado final.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $match: {
      number_of_reviews: { $gte: 10 },
      "review_scores.review_scores_rating": { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: null,
      promedio_rating: { $avg: "$review_scores.review_scores_rating" },
      total_listings: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      promedio_rating: { $round: ["$promedio_rating", 2] },
      total_listings: 1
    }
  }
]);
```

## Explicacion
1. `$match` descarta listings con pocas reviews o sin rating.
2. `$group` calcula el promedio global y cuenta los documentos.
3. `$round` deja el resultado con dos decimales.

## Resultado Esperado
- Un promedio general de rating para listings con volumen minimo de reviews.
