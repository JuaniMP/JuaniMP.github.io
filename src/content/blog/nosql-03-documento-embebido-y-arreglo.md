---
title: "NoSQL 03 — Documento embebido y arreglos (Mundial 2026)"
description: "Ejemplos de documentos embebidos y uso de arreglos en el modelo Mundial2026."
pubDate: "2026-05-20"
icon: 'web'
tags: ["NoSQL","MongoDB","Mundial2026"]
---

En MongoDB es común usar documentos embebidos y arreglos para modelar relaciones cuando la lectura es más frecuente que la escritura.

Ejemplo: embebemos la información de la ciudad dentro del estadio y usamos un arreglo de goles en partidos.

```js
use("mundial2026");

// Estadio con documento embebido para sede/ciudad
db.estadios.insertOne({
  _id: 201,
  nombre: "Nuevo Estadio",
  sede: { pais: "EEUU", ciudad: "San Francisco" },
  capacidad: 65000
});

// Partido con arreglo de goles (local, visitante) y eventos
db.partidos.insertOne({
  _id: 2001,
  fecha: new Date("2026-06-12T20:00:00Z"),
  estadioId: 201,
  local: "ARG",
  visitante: "FRA",
  goles: [2, 0],
  eventos: [
    { minuto: 12, tipo: "gol", jugador: "Jugador A", equipo: "ARG" },
    { minuto: 45, tipo: "tarjeta", jugador: "Jugador B", equipo: "FRA" }
  ]
});

// Actualizar: agregar un gol al arreglo
db.partidos.updateOne({ _id: 2001 }, { $push: { goles: 1 } });

// Filtrar por elementos de arreglo
db.partidos.find({ goles: { $elemMatch: { $gte: 2 } } });
```

Ventajas:
- Lecturas rápidas cuando la información relacionada se consume junto.

Consideraciones:
- Evite documentos que crezcan ilimitadamente; para historiales grandes considere referencias en lugar de embebido.
