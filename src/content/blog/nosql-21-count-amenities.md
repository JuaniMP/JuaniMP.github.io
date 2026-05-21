---
title: 'NoSQL 21: Contar Listings con Mas de 10 Amenities'
description: 'Pipeline MongoDB que filtra arreglos de amenities y cuenta cuantas propiedades superan 10 elementos.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Contar cuantos listings tienen mas de 10 amenities.

## Contexto
En agregacion, `$match` filtra y `$count` resume la cantidad de documentos resultantes.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $match: {
      amenities: { $exists: true, $type: "array" }
    }
  },
  {
    $match: {
      $expr: { $gt: [{ $size: "$amenities" }, 10] }
    }
  },
  {
    $count: "listings_con_mas_de_10_amenities"
  }
]);
```

## Explicacion
1. Primero se valida que `amenities` exista y sea un arreglo.
2. Luego `$expr` permite comparar el tamaño real del arreglo.
3. `$count` devuelve un unico documento con el total.

## Resultado Esperado
- Un conteo con la cantidad de listings que tienen mas de 10 amenities.
