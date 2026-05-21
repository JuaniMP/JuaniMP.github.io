---
title: 'NoSQL 13: Tamaño de Array con $size'
description: 'Consulta MongoDB para encontrar listings con exactamente 20 amenities.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Ejercicios']
---

## Enunciado
Encontrar listings que tengan exactamente 20 amenities.

## Contexto
El operador `$size` sirve para evaluar la longitud exacta de un arreglo.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.find(
  { amenities: { $size: 20 } },
  { name: 1, amenities: 1, _id: 0 }
);
```

## Explicacion
1. `$size: 20` filtra documentos con un arreglo de 20 elementos exactos.
2. Es una validacion util cuando el numero de items importa.
3. La proyeccion ayuda a revisar el contenido del arreglo.

## Resultado Esperado
- Listings con 20 amenities exactas.
- Se muestran el nombre y la lista completa de amenities.
