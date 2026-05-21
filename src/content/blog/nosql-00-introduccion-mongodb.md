---
title: 'NoSQL 00: Introduccion a MongoDB'
description: 'Resumen del apartado NoSQL del blog y conceptos base de MongoDB para entender los ejercicios.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB']
---

## Enunciado
Explicar que es el apartado NoSQL del blog y como se relaciona con MongoDB.

## Contexto
MongoDB es una base de datos NoSQL orientada a documentos. En lugar de tablas y filas, trabaja con colecciones y documentos JSON-like.

## Conceptos Clave
1. Una base de datos puede tener varias colecciones.
2. Cada documento puede incluir campos simples, arreglos y objetos anidados.
3. Los operadores de consulta y agregacion permiten filtrar, agrupar, actualizar y transformar datos.

## Estructura Basica
```javascript
use("sample_airbnb");

db.listingsAndReviews.find(
  { "address.country": "Brazil" },
  { name: 1, price: 1, _id: 0 }
);
```

## Explicacion
1. `use()` selecciona la base de datos.
2. `find()` consulta documentos.
3. La proyeccion limita los campos devueltos para leer mejor los resultados.

## Resultado Esperado
- El lector entiende que los ejercicios del apartado NoSQL usan MongoDB.
- Las entradas siguientes aplican consultas, actualizaciones y agregaciones sobre documentos.
