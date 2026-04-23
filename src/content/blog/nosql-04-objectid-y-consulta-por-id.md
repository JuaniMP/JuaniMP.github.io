---
title: 'NoSQL 04: ObjectId y Consulta por ID'
description: 'Como usar ObjectId para buscar documentos en MongoDB.'
pubDate: 'Apr 22 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'ObjectId']
---

## Enunciado
Explicar como funciona `ObjectId` y como consultar un documento por su `_id`.

## Contexto
En MongoDB, `_id` es unico por coleccion y normalmente se guarda como `ObjectId`.

## Solucion NoSQL (MongoDB)
```javascript
use("mundial2026");

// Insertar un documento
const resultado = db.estadios.insertOne({
  nombre: "MetLife Stadium",
  ciudad: "New York",
  capacidad: 82500,
  pais: "Estados Unidos"
});

// Obtener el id generado
const idGenerado = resultado.insertedId;

// Consultar por _id usando ObjectId
db.estadios.findOne({ _id: idGenerado });

// Ejemplo con id literal (copiado)
db.estadios.findOne({ _id: ObjectId("6657f8b91b0e9c1a2b3c4d5e") });
```

## Explicacion
1. `insertOne` devuelve `insertedId`.
2. Para buscar por `_id`, se usa `ObjectId(...)` cuando el id esta como texto.
3. Es la forma mas precisa de recuperar un documento unico.

## Resultado Esperado
- Documento insertado con `_id` automatico.
- Consulta por `_id` devolviendo exactamente un registro.
