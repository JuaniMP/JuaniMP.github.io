---
title: 'NoSQL 14: Ordenar y Limitar los Listings Mas Caros'
description: 'Consulta MongoDB para mostrar los 10 listings de mayor precio con proyeccion de campos clave.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Ejercicios']
---

## Enunciado
Mostrar los 10 listings mas caros proyectando `name`, `price` y `address.country`.

## Contexto
MongoDB permite encadenar `find`, `sort` y `limit` para ordenar resultados rapidamente.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.find(
  {},
  { name: 1, price: 1, "address.country": 1, _id: 0 }
).sort({ price: -1 }).limit(10);
```

## Explicacion
1. `sort({ price: -1 })` ordena de mayor a menor.
2. `limit(10)` restringe la salida a los 10 primeros documentos.
3. La proyeccion reduce el ruido y deja solo lo necesario.

## Resultado Esperado
- Los 10 listings mas caros del dataset.
- Campos visibles: nombre, precio y pais.
