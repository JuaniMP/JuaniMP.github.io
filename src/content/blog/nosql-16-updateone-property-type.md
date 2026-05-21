---
title: 'NoSQL 16: updateOne para Cambiar property_type'
description: 'Actualizacion de un documento en MongoDB usando $set para modificar property_type.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Update']
---

## Enunciado
Actualizar el `property_type` del listing Cozy Cabin Retreat a `Entire home/apt`.

## Contexto
`updateOne` modifica solo el primer documento que cumple el filtro.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.updateOne(
  { name: "Cozy Cabin Retreat" },
  {
    $set: {
      property_type: "Entire home/apt"
    }
  }
);
```

## Explicacion
1. El filtro localiza el documento por nombre.
2. `$set` reemplaza solo el campo indicado.
3. El resto del documento permanece sin cambios.

## Resultado Esperado
- El listing actualizado conserva sus demas campos.
- `property_type` cambia a `Entire home/apt`.
