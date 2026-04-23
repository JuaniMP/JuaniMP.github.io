---
title: 'NoSQL 01: Estructura Base Mundial 2026'
description: 'Creacion de base y 5 colecciones en MongoDB para Canada, Mexico y Estados Unidos.'
pubDate: 'Apr 22 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB']
---

## Enunciado
Crear una base NoSQL para el Mundial 2026 con cinco colecciones y varios documentos de ejemplo.

## Contexto
Se trabaja en MongoDB usando la base `mundial2026`. El modelo mezcla documentos simples, embebidos y arreglos para representar informacion real del torneo.

## Solucion NoSQL (MongoDB)
```javascript
use("mundial2026");

// 1) sedes
 db.createCollection("sedes");
 db.sedes.insertMany([
  { pais: "Canada", ciudades: ["Toronto", "Vancouver"], confederacion: "Concacaf" },
  { pais: "Mexico", ciudades: ["CDMX", "Guadalajara", "Monterrey"], confederacion: "Concacaf" },
  { pais: "Estados Unidos", ciudades: ["Los Angeles", "New York", "Miami"], confederacion: "Concacaf" }
 ]);

// 2) estadios
 db.createCollection("estadios");
 db.estadios.insertMany([
  { nombre: "Azteca", ciudad: "CDMX", capacidad: 87000, pais: "Mexico" },
  { nombre: "SoFi Stadium", ciudad: "Los Angeles", capacidad: 70000, pais: "Estados Unidos" },
  { nombre: "BC Place", ciudad: "Vancouver", capacidad: 54500, pais: "Canada" }
 ]);

// 3) selecciones
 db.createCollection("selecciones");
 db.selecciones.insertMany([
  { codigo: "CAN", nombre: "Canada", grupo: "A", ranking_fifa: 49 },
  { codigo: "MEX", nombre: "Mexico", grupo: "A", ranking_fifa: 15 },
  { codigo: "USA", nombre: "Estados Unidos", grupo: "A", ranking_fifa: 11 }
 ]);

// 4) partidos
 db.createCollection("partidos");
 db.partidos.insertMany([
  { fecha: ISODate("2026-06-11T19:00:00Z"), local: "MEX", visitante: "USA", estadio: "Azteca", fase: "Grupos" },
  { fecha: ISODate("2026-06-12T19:00:00Z"), local: "CAN", visitante: "MEX", estadio: "BC Place", fase: "Grupos" }
 ]);

// 5) boletos
 db.createCollection("boletos");
 db.boletos.insertMany([
  { partido: "MEX-USA", categoria: "VIP", precio: 600, moneda: "USD", disponibles: 5000 },
  { partido: "CAN-MEX", categoria: "General", precio: 120, moneda: "USD", disponibles: 18000 }
 ]);
```

## Explicacion
1. `createCollection` define cada entidad principal.
2. `insertMany` carga varios documentos en un solo paso.
3. Se usa una estructura flexible para agregar campos sin migraciones complejas.

## Resultado Esperado
- Base `mundial2026` creada.
- Colecciones: `sedes`, `estadios`, `selecciones`, `partidos`, `boletos`.
- Datos iniciales listos para consultas y actualizaciones.
