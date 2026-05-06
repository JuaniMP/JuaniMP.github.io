---
title: 'NoSQL 10: Edad y Ciudad (MongoDB)'
description: 'Consulta en MongoDB: buscar documentos con edad >= 5 y ciudad = Chicago. Operadores Mongo y ejemplos.'
pubDate: 'May 06 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL','Mongo','Ejercicios']
---

## Enunciado
Buscar todos los documentos cuyo campo `edad` sea mayor o igual a 5 y que estén en la ciudad "Chicago".

**Tecnología usada:** MongoDB (NoSQL)

## Consulta (MongoDB)
```js
db.collection.find({
  edad: { $gte: 5 },
  ciudad: "Chicago"
})
```

## Operadores relacionados (ejemplos)

- `$lt` (menor que)
```js
db.collection.find({ edad: { $lt: 5 } })
```

- `$lte` (menor o igual que)
```js
db.collection.find({ edad: { $lte: 5 } })
```

- `$gt` (mayor que)
```js
db.collection.find({ edad: { $gt: 5 } })
```

- `$gte` (mayor o igual que)
```js
db.collection.find({ edad: { $gte: 5 } })
```

- `$in` / `$nin` (pertenencia / no pertenencia)
```js
// ciudad en la lista
db.collection.find({ ciudad: { $in: ["Chicago", "New York"] } })

// ciudad no está en la lista
db.collection.find({ ciudad: { $nin: ["Chicago", "New York"] } })
```

- `$elemMatch` (condición sobre elementos de un arreglo)
```js
// documentos con un arreglo 'categorias' que contenga un elemento
// con { tipo: 'útil', edad: { $gte: 5 } }
db.collection.find({
  categorias: { $elemMatch: { tipo: "útil", edad: { $gte: 5 } } }
})
```

## Ejemplo de documento que cumple la consulta
```json
{
  "_id": ObjectId("624..."),
  "nombre": "Caja de útiles",
  "edad": 6,
  "ciudad": "Chicago",
  "categorias": [ { "tipo": "útil", "edad": 6 } ]
}
```

La consulta principal devolverá todos los documentos con `edad >= 5` y `ciudad: "Chicago"`, como el ejemplo anterior.

## Nota
Esta entrada es parte de los ejercicios de Mongo; indica si quieres que la añada al índice de ejercicios o que genere más variantes (por ejemplo: consulta compuesta, uso de índices, agregaciones).
