---
title: 'NoSQL 25: Proyeccion y Conversion de Tipo'
description: 'Uso de MongoDB con $project y $toInt para mostrar name, price y un precio convertido a entero.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Aggregation']
---

## Enunciado
Mostrar `name`, `price` y crear un campo `price_entero` con el precio convertido a entero.

## Contexto
`$project` sirve para seleccionar y transformar campos dentro de una agregacion.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      price: 1,
      price_entero: { $toInt: "$price" }
    }
  }
]);
```

## Explicacion
1. `name` y `price` se conservan tal como estan.
2. `$toInt` convierte el precio a numero entero.
3. `$project` permite construir una salida mas limpia.

## Resultado Esperado
- Cada listing muestra un precio original y su version entera.
