---
title: 'NoSQL 03: Documento Embebido y Arreglos'
description: 'Uso de documentos anidados y arrays para representar datos del Mundial 2026.'
pubDate: 'Apr 22 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Modelado']
---

## Enunciado
Modelar informacion del Mundial con documento embebido y arreglo para aprovechar el modelo documental.

## Contexto
MongoDB permite guardar subdocumentos y listas en un mismo registro cuando los datos se consultan juntos.

## Solucion NoSQL (MongoDB)
```javascript
use("mundial2026");

db.partidos.insertOne({
  fecha: ISODate("2026-06-15T20:00:00Z"),
  local: "USA",
  visitante: "BRA",
  fase: "Grupos",
  estadio: {
    nombre: "SoFi Stadium",
    ciudad: "Los Angeles",
    pais: "Estados Unidos"
  },
  arbitros: [
    { nombre: "Juan Perez", rol: "Principal" },
    { nombre: "Ana Torres", rol: "Asistente" },
    { nombre: "Luis Rojas", rol: "Asistente" }
  ],
  estadisticas: {
    posesion_local: 54,
    posesion_visitante: 46,
    tiros_local: 12,
    tiros_visitante: 8
  }
});
```

## Explicacion
1. `estadio` es un documento embebido (objeto dentro del documento principal).
2. `arbitros` es un arreglo de objetos.
3. Este enfoque reduce joins y facilita lecturas de una sola consulta.

## Resultado Esperado
- Un partido con estructura rica y jerarquica.
- Datos relacionados almacenados juntos y listos para consulta.
