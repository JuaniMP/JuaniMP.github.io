---
title: 'NoSQL 02: Insert Query con insertMany'
description: 'Como insertar multiples documentos en MongoDB de forma eficiente.'
pubDate: 'Apr 22 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Insert']
---

## Enunciado
Mostrar como hacer un "insert query" en MongoDB para cargar varios registros de una vez.

## Contexto
En MongoDB, el equivalente practico para carga masiva inicial suele ser `insertMany`.

## Solucion NoSQL (MongoDB)
```javascript
use("mundial2026");

db.selecciones.insertMany([
  {
    codigo: "ARG",
    nombre: "Argentina",
    grupo: "B",
    ranking_fifa: 1,
    tecnicos: ["Lionel Scaloni"]
  },
  {
    codigo: "BRA",
    nombre: "Brasil",
    grupo: "B",
    ranking_fifa: 3,
    tecnicos: ["Dorival Junior"]
  },
  {
    codigo: "FRA",
    nombre: "Francia",
    grupo: "C",
    ranking_fifa: 2,
    tecnicos: ["Didier Deschamps"]
  }
]);
```

## Explicacion
1. `insertMany` recibe un arreglo de documentos.
2. Es mas eficiente que insertar uno por uno cuando son muchos registros.
3. MongoDB agrega `_id` automatico si no lo defines.

## Resultado Esperado
- Tres nuevas selecciones cargadas.
- Cada documento con `_id` unico generado por MongoDB.
