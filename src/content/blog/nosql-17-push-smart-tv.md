---
title: 'NoSQL 17: Agregar un Elemento con $push'
description: 'Actualizacion en MongoDB para anadir Smart TV al arreglo amenities de un listing en Chile y Santiago.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Update']
---

## Enunciado
Actualizar el listing del ejercicio 2 y anadir Smart TV al arreglo `amenities`.

## Contexto
`$push` agrega un nuevo elemento al final de un arreglo existente.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.updateOne(
  {
    "address.country": "Chile",
    "address.market": "Santiago"
  },
  {
    $push: {
      amenities: "Smart TV"
    }
  }
);
```

## Explicacion
1. El filtro busca el documento creado con direccion anidada.
2. `$push` inserta `Smart TV` dentro de `amenities`.
3. Si `amenities` no existiera, MongoDB lo crea como arreglo.

## Resultado Esperado
- El listing queda con una amenity adicional.
- El documento sigue siendo unico y consistente.
