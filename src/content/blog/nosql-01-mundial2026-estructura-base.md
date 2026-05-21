---
title: "NoSQL 01 — Estructura base: Mundial 2026"
description: "Modelo de datos MongoDB para un sistema de gestión del Mundial 2026 (sedes, estadios, selecciones, partidos, boletos)."
pubDate: "2026-05-20"
icon: 'web'
tags: ["NoSQL","MongoDB","Mundial2026"]
---

En este ejercicio definimos una estructura básica para un proyecto de ejemplo en MongoDB.

Colecciones propuestas:
- `sedes` — países/ciudades sede del torneo.
- `estadios` — estadios con capacidad y referencia a `sedeId`.
- `selecciones` — equipos participantes con plantillas.
- `partidos` — encuentros con referencias a estadio y selecciones.
- `boletos` — entradas vendidas para cada partido.

Ejemplo en shell de MongoDB (mongosh):

```js
use("mundial2026");

db.sedes.insertMany([
  { _id: 1, pais: "EEUU", ciudad: "Los Angeles" },
  { _id: 2, pais: "Mexico", ciudad: "Mexico City" },
  { _id: 3, pais: "Canada", ciudad: "Toronto" }
]);

db.estadios.insertMany([
  { _id: 101, nombre: "Estadio LA", sedeId: 1, capacidad: 70000 },
  { _id: 102, nombre: "Azteca", sedeId: 2, capacidad: 87000 },
  { _id: 103, nombre: "Toronto Arena", sedeId: 3, capacidad: 60000 }
]);

db.selecciones.insertMany([
  { _id: "ARG", nombre: "Argentina", grupo: "A" },
  { _id: "BRA", nombre: "Brasil", grupo: "B" }
]);

db.partidos.insertMany([
  {
    _id: 1001,
    fecha: new Date("2026-06-10T20:00:00Z"),
    estadioId: 101,
    local: "ARG",
    visitante: "BRA",
    fase: "Grupo"
  }
]);

db.boletos.insertMany([
  { _id: "B-1", partidoId: 1001, comprador: "Juan Perez", asiento: "A12", precio: 120 },
  { _id: "B-2", partidoId: 1001, comprador: "Ana Ruiz", asiento: "A13", precio: 120 }
]);
```

Comentarios:
- Usamos identificadores simples para facilitar ejemplos; en producción puede convenir ObjectId.
- Las referencias (`sedeId`, `estadioId`, `partidoId`) sirven para consultas y joins con `$lookup`.

En los siguientes ejercicios veremos inserciones masivas, consultas y operaciones sobre documentos embebidos y arreglos.
