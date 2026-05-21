---
title: 'NoSQL 15: Listings sin Last Review'
description: 'Consulta MongoDB para listar documentos donde last_review no existe o es nulo, ordenados por numero de reviews.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Ejercicios']
---

## Enunciado
Mostrar `name`, `summary` y `description` de los listings que no tienen `last_review`, ordenados por `number_of_reviews` descendente.

## Contexto
En MongoDB, comparar con `null` permite detectar campos nulos o ausentes.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.find(
  { last_review: null },
  { name: 1, summary: 1, description: 1, _id: 0 }
).sort({ number_of_reviews: -1 });
```

## Explicacion
1. `last_review: null` coincide con documentos donde el campo es nulo o inexistente.
2. `sort({ number_of_reviews: -1 })` muestra primero los mas revisados.
3. La proyeccion deja solo la informacion descriptiva.

## Resultado Esperado
- Listings sin ultima fecha de reseña.
- Resultados ordenados de mayor a menor segun reviews.
