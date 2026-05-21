---
title: 'NoSQL 22: Precio Promedio por Pais'
description: 'Agrupacion en MongoDB para calcular el precio promedio de los listings por cada address.country.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Calcular el precio promedio de los listings por cada pais.

## Contexto
`$group` resume documentos por una clave comun y `$avg` calcula promedios.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $group: {
      _id: "$address.country",
      precio_promedio: { $avg: "$price" }
    }
  },
  {
    $sort: { precio_promedio: -1 }
  }
]);
```

## Explicacion
1. `_id` define la clave de agrupacion.
2. `$avg` calcula el promedio de `price` por pais.
3. `$sort` ordena los paises de mayor a menor promedio.

## Resultado Esperado
- Una lista de paises con su precio promedio.
- Los paises con mayor promedio aparecen primero.
