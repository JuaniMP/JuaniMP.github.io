---
title: 'NoSQL 06: insertOne (Insertar un Documento)'
description: 'Insertar un solo documento en MongoDB con un ejemplo práctico.'
pubDate: 'Apr 22 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Insert']
---

## Enunciado
Insertar un solo documento usando `insertOne` y validar que se guardo correctamente.

## Contexto
`insertOne` se usa cuando solo necesitas crear un registro puntual.

## Solucion NoSQL (MongoDB)
```javascript
use("mundial2026");

const nuevoPartido = {
  fecha: ISODate("2026-06-20T18:00:00Z"),
  local: "MEX",
  visitante: "ARG",
  fase: "Grupos",
  sede: "Monterrey",
  estado: "programado"
};

const respuesta = db.partidos.insertOne(nuevoPartido);
printjson(respuesta);

// Verificacion
db.partidos.findOne({ _id: respuesta.insertedId });
```

## Explicacion
1. Se arma un objeto JSON con la informacion del partido.
2. `insertOne` retorna `insertedId`.
3. Se verifica leyendo por `_id`.

## Resultado Esperado
```text
{ acknowledged: true, insertedId: ObjectId("...") }
```
