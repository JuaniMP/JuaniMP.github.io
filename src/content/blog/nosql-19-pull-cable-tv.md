---
title: 'NoSQL 19: Eliminar un Valor con $pull'
description: 'Uso de MongoDB para quitar la amenity Cable TV de todos los documentos que la contienen.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Update']
---

## Enunciado
Eliminar la amenity Cable TV de todos los listings que la tengan.

## Contexto
`$pull` elimina elementos concretos de un arreglo.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.updateMany(
  { amenities: "Cable TV" },
  {
    $pull: {
      amenities: "Cable TV"
    }
  }
);
```

## Explicacion
1. El filtro identifica documentos que contienen el valor buscado.
2. `$pull` lo elimina del arreglo en todos los documentos coincidentes.
3. Es util para limpiar listas sin reemplazarlas completas.

## Resultado Esperado
- Los listings quedan sin la amenity Cable TV.
- Solo se modifica el arreglo indicado.
