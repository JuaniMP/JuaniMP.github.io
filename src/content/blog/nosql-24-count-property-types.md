---
title: 'NoSQL 24: Cantidad de Listings por Property Type'
description: 'Agrupacion en MongoDB para contar cuantas propiedades existen por cada tipo de inmueble.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Calcular la cantidad de listings por `property_type` y ordenarlos por los mas comunes.

## Contexto
Se usa `$match` para limpiar datos nulos, luego `$group` y finalmente `$sort`.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $match: {
      property_type: { $exists: true, $ne: null }
    }
  },
  {
    $group: {
      _id: "$property_type",
      cantidad: { $sum: 1 }
    }
  },
  {
    $sort: { cantidad: -1 }
  }
]);
```

## Explicacion
1. Se excluyen documentos sin `property_type` valido.
2. `$group` cuenta cuantas veces aparece cada tipo.
3. `$sort` organiza del mas comun al menos comun.

## Resultado Esperado
- Un ranking de tipos de propiedad en MongoDB.
