---
title: 'NoSQL 11: Regex para Buscar Luxury en MongoDB'
description: 'Consulta MongoDB con $regex para encontrar listings cuyo nombre contiene Luxury sin distinguir mayusculas.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Ejercicios']
---

## Enunciado
Buscar listings cuyo campo `name` contenga la palabra Luxury sin importar mayusculas o minusculas.

## Contexto
MongoDB permite filtrar texto con expresiones regulares usando `$regex`.

## Solucion NoSQL (MongoDB)
```javascript
use("sample_airbnb");

db.listingsAndReviews.find(
  { name: { $regex: /luxury/i } },
  { name: 1, price: 1, _id: 0 }
);
```

## Explicacion
1. `$regex: /luxury/i` busca coincidencias sin distinguir mayusculas y minusculas.
2. La proyeccion muestra solo `name` y `price`.
3. Es util para busquedas flexibles sobre textos descriptivos.

## Resultado Esperado
- Listings que incluyan Luxury en el nombre.
- Solo se muestran los campos de interes para el ejercicio.
