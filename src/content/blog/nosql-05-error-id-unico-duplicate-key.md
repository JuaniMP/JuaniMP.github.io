---
title: 'NoSQL 05: Error de ID Unico (Duplicate Key)'
description: 'Prueba de error por _id duplicado en MongoDB y como interpretarlo.'
pubDate: 'Apr 22 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Errores']
---

## Enunciado
Probar el error de clave unica en MongoDB intentando insertar dos documentos con el mismo `_id`.

## Contexto
Cada coleccion exige que `_id` sea unico. Si se repite, MongoDB devuelve `E11000 duplicate key error`.

## Solucion NoSQL (MongoDB)
```javascript
use("mundial2026");

const idFijo = ObjectId("6657f8b91b0e9c1a2b3c4d5e");

// Primer insert: correcto
db.boletos.insertOne({
  _id: idFijo,
  partido: "MEX-USA",
  categoria: "VIP",
  precio: 650
});

// Segundo insert con el mismo _id: falla
db.boletos.insertOne({
  _id: idFijo,
  partido: "CAN-MEX",
  categoria: "General",
  precio: 150
});
```

## Explicacion
1. El primer `insertOne` funciona.
2. El segundo intenta reutilizar el mismo `_id`.
3. MongoDB rechaza la operacion con error de duplicado.

## Error Esperado
```text
E11000 duplicate key error collection: mundial2026.boletos index: _id_ dup key
```

## Buenas Practicas
- No fijar `_id` manualmente salvo casos controlados.
- Si se necesita llave de negocio unica (por ejemplo `codigo_partido`), crear indice unico adicional con `createIndex`.
