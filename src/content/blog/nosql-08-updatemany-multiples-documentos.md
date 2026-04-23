---
title: 'NoSQL 08: updateMany (Actualizacion Masiva)'
description: 'Actualizar multiples documentos con una sola operacion en MongoDB.'
pubDate: 'Apr 22 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['NoSQL', 'MongoDB', 'Update']
---

## Enunciado
Usar `updateMany` para actualizar todos los documentos que cumplan una condicion.

## Contexto
`updateMany` es ideal para cambios globales, por ejemplo normalizar estados o aumentar valores de una categoria.

## Solucion NoSQL (MongoDB)
```javascript
use("mundial2026");

// Subir 10 USD todos los boletos VIP
const resultado = db.boletos.updateMany(
  { categoria: "VIP" },
  {
    $inc: { precio: 10 },
    $set: { moneda: "USD" },
    $currentDate: { ultima_actualizacion: true }
  }
);

printjson(resultado);

// Verificacion
db.boletos.find({ categoria: "VIP" });
```

## Explicacion
1. El filtro encuentra todos los boletos VIP.
2. `$inc` aumenta precio en bloque.
3. Se actualiza tambien moneda y timestamp.

## Resultado Esperado
```text
{ acknowledged: true, matchedCount: N, modifiedCount: N }
```

## Recomendacion
Antes de un `updateMany`, ejecutar primero el mismo filtro con `find` para confirmar que impactaras solo los documentos esperados.
