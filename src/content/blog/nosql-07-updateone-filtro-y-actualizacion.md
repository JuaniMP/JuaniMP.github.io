---
title: 'NoSQL 07: updateOne (Filtro y Actualizacion)'
description: 'Actualizar un documento con filtro y operadores de actualizacion en MongoDB.'
pubDate: 'Apr 22 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Update']
---

## Enunciado
Aplicar `updateOne` con filtro y bloque de actualizacion para modificar un solo documento.

## Contexto
`updateOne` recibe dos partes clave:
1. Filtro: que documento buscar.
2. Actualizacion: que campos cambiar (`$set`, `$inc`, etc.).

## Solucion NoSQL (MongoDB)
```javascript
use("mundial2026");

// Cambiar estado y ciudad de un partido puntual
const resultado = db.partidos.updateOne(
  { local: "MEX", visitante: "ARG" },   // filtro
  {
    $set: { estado: "confirmado", sede: "CDMX" },
    $currentDate: { ultima_actualizacion: true }
  }                                        // actualizacion
);

printjson(resultado);

// Verificar cambio
db.partidos.findOne({ local: "MEX", visitante: "ARG" });
```

## Explicacion
1. El filtro selecciona un partido especifico.
2. `$set` modifica campos concretos.
3. `$currentDate` guarda marca de tiempo de actualizacion.

## Resultado Esperado
```text
{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }
```
