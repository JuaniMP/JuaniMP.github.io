---
title: 'NoSQL 18: Incrementar Reviews con $inc'
description: 'Actualizacion masiva en MongoDB para sumar 1 al numero de reviews de todos los listings de Spain.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Update']
---

## Enunciado
Incrementar `number_of_reviews` en 1 para todos los listings ubicados en Spain.

## Contexto
`updateMany` modifica todos los documentos que cumplen el filtro y `$inc` suma un valor numerico.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.updateMany(
  { "address.country": "Spain" },
  {
    $inc: {
      number_of_reviews: 1
    }
  }
);
```

## Explicacion
1. El filtro selecciona todos los documentos de Spain.
2. `$inc: 1` aumenta el contador de reseñas.
3. Es ideal para contadores y ajustes acumulativos.

## Resultado Esperado
- Todos los listings de Spain quedan con una review adicional.
- La operacion afecta multiples documentos a la vez.
