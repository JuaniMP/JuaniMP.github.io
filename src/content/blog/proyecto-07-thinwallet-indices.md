---
title: 'Proyecto 07: Indices de ThinWallet'
description: 'Indices de ThinWallet para mejorar la velocidad de consultas en transacciones, deudas, usuarios y auditoria.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Proyecto', 'ThinWallet', 'MySQL', 'Indices']
---

## Enunciado
Explicar los indices del proyecto ThinWallet y como ayudan a optimizar la latencia.

## Contexto
Los indices se agregan sin tocar la estructura de las tablas. ThinWallet los usa donde hay filtros frecuentes por usuario, circulo, estado, fecha y auditoria.

## Indices principales
```sql
CREATE INDEX idx_trx_usuario_fecha ON transaccion (id_usuario, fecha_ejecucion DESC);
CREATE INDEX idx_trx_circulo_fecha ON transaccion (id_circulo_gasto, fecha_ejecucion DESC);
CREATE INDEX idx_deuda_deudor_estado ON deuda (id_usuario_deudor, estado_pago);
CREATE INDEX idx_audit_usuario_fecha ON auditoria_sistema (id_usuario, fecha_accion DESC);
CREATE INDEX idx_usuario_token_reclamo ON usuario (token_reclamo);
CREATE INDEX idx_uc_circulo_rol ON usuario_circulo (id_circulo_gasto, rol_usuario);
```

## Explicacion
1. `transaccion` gana velocidad en listados por usuario y por circulo.
2. `deuda` mejora vistas como mis deudas y por cobrar.
3. `auditoria_sistema` acelera busquedas historicas.
4. `usuario` y `usuario_circulo` soportan login, invitaciones y listado de miembros.

## Resultado Esperado
- Consultas mas rapidas en ThinWallet.
- Mejor rendimiento en dashboards, reportes y auditoria.
