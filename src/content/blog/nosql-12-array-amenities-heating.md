---
title: 'NoSQL 12: Consulta en Arrays con Heating'
description: 'Busqueda en MongoDB de listings que incluyen Heating dentro del arreglo amenities.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Ejercicios']
---

## Enunciado
Encontrar listings que ofrezcan Heating como una de sus amenidades.

## Contexto
MongoDB permite consultar arreglos directamente cuando el valor buscado aparece en alguno de sus elementos.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.find(
  { amenities: "Heating" },
  { name: 1, amenities: 1, _id: 0 }
);
```

## Explicacion
1. La consulta busca el valor `Heating` dentro del arreglo `amenities`.
2. No hace falta usar `$elemMatch` para este caso simple.
3. La proyeccion permite revisar rapidamente las comodidades encontradas.

## Resultado Esperado
- Listings que tengan Heating en su lista de amenities.
- Salida enfocada en `name` y `amenities`.
