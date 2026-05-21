---
title: "NoSQL 02 — Insert: `insertMany()` y consultas básicas (Mundial 2026)"
description: "Ejemplos de `insertMany()` y consultas `find()` sobre la base `mundial2026`."
pubDate: "2026-05-20"
icon: 'web'
tags: ["NoSQL","MongoDB","Mundial2026"]
---

En este ejercicio practicamos inserciones masivas y consultas básicas usando colecciones de ejemplo.

Insertar varias selecciones:

```js
use("mundial2026");

db.selecciones.insertMany([
  { _id: "ARG", nombre: "Argentina", grupo: "A", ranking: 1 },
  { _id: "BRA", nombre: "Brasil", grupo: "B", ranking: 2 },
  { _id: "FRA", nombre: "Francia", grupo: "C", ranking: 3 }
]);
```

Insertar partidos:

```js
db.partidos.insertMany([
  { _id: 1001, fecha: new Date("2026-06-10T20:00:00Z"), estadioId: 101, local: "ARG", visitante: "BRA", goles: [2,1] },
  { _id: 1002, fecha: new Date("2026-06-11T18:00:00Z"), estadioId: 102, local: "FRA", visitante: "ESP", goles: [1,0] }
]);
```

Consultas básicas:

```js
// Todas las selecciones
db.selecciones.find().pretty();

// Selecciones en el grupo A
db.selecciones.find({ grupo: "A" });

// Partidos en un estadio concreto
db.partidos.find({ estadioId: 101 });

// Proyección: solo fecha y equipos
db.partidos.find({}, { fecha: 1, local: 1, visitante: 1 });
```

Notas:
- `insertMany()` acepta un arreglo de documentos y es más eficiente que múltiples `insertOne()`.
- Para evitar duplicados, considere crear índices únicos cuando corresponda (por ejemplo `_id` o campos compuestos).
