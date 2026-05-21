---
title: 'NoSQL 20: Upsert con updateOne'
description: 'Ejemplo en MongoDB que actualiza un documento o lo inserta si no existe usando upsert: true.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Update']
---

## Enunciado
Intentar actualizar Mansion de Prueba y, si no existe, insertarla.

## Contexto
El modo `upsert` combina update e insert en una sola operacion.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.updateOne(
  { name: "Mansion de Prueba" },
  {
    $set: {
      name: "Mansion de Prueba",
      price: 1500.00,
      "address.country": "United States"
    }
  },
  { upsert: true }
);
```

## Explicacion
1. Si el documento existe, se actualiza.
2. Si no existe, MongoDB lo crea con los datos del `$set`.
3. Es util para sincronizar datos sin hacer dos consultas.

## Resultado Esperado
- El listing queda actualizado o creado.
- La operacion evita pasos separados de busqueda e insercion.
