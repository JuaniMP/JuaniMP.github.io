---
title: 'NoSQL 28: Simulacion de $lookup'
description: 'Explicacion teorica y ejemplo practico en MongoDB sobre como unir listings con informacion de anfitriones.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Explicar como funcionaria un $lookup para unir listings con una coleccion hosts y mostrar una simulacion con la coleccion disponible.

## Contexto
`$lookup` funciona como un LEFT JOIN en SQL y agrega el resultado como un arreglo.

## Ejemplo Teorico
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $lookup: {
      from: "hosts",
      localField: "host.host_id",
      foreignField: "_id",
      as: "informacion_anfitrion"
    }
  },
  {
    $project: {
      name: 1,
      price: 1,
      "host.host_name": 1,
      informacion_anfitrion: 1
    }
  }
]);
```

## Simulacion Práctica
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $group: {
      _id: "$host.host_id",
      host_name: { $first: "$host.host_name" },
      total_listings: { $sum: 1 },
      listings: {
        $push: {
          name: "$name",
          price: "$price"
        }
      }
    }
  },
  { $limit: 5 }
]);
```

## Explicacion
1. En teoria, `$lookup` une dos colecciones por una llave comun.
2. Si no existe la coleccion secundaria, la simulacion usa `$group` para mostrar la relacion por host.
3. El resultado queda como un resumen de listings por anfitrion.

## Resultado Esperado
- Una comprension clara de como MongoDB une informacion entre colecciones.
