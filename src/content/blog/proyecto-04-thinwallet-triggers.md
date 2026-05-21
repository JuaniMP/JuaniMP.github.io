---
title: 'Proyecto 04: Triggers de ThinWallet'
description: 'Triggers MySQL de ThinWallet para validar montos, auditar cambios y proteger reglas de negocio.'
pubDate: 'May 20 2026'
heroImage: '/src/assets/gatitos.webp'
icon: 'web'
tags: ['Proyecto', 'ThinWallet', 'MySQL', 'Triggers']
---

## Enunciado
Explicar los triggers del proyecto ThinWallet y por que son importantes para la integridad de los datos.

## Contexto
Los triggers automatizan validaciones y auditoria sin depender solo de la aplicacion. En ThinWallet se usan para evitar movimientos invalidos, registrar cambios y bloquear operaciones que rompen reglas de negocio.

## Ejemplos clave
```sql
CREATE TRIGGER trg_validar_transaccion_insert
BEFORE INSERT ON transaccion
FOR EACH ROW
BEGIN
    IF NEW.monto_original <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El monto debe ser mayor a 0';
    END IF;
END;

CREATE TRIGGER trg_auditoria_deuda_update
AFTER UPDATE ON deuda
FOR EACH ROW
BEGIN
    IF OLD.estado_pago != NEW.estado_pago THEN
        INSERT INTO auditoria_sistema (...);
    END IF;
END;
```

## Explicacion
1. `BEFORE INSERT` valida datos antes de guardarlos.
2. `AFTER UPDATE` registra la trazabilidad de cambios reales.
3. Otros triggers bloquean salidas de circulos con deuda pendiente y evitan borrar categorias con transacciones asociadas.

## Resultado Esperado
- ThinWallet evita montos invalidos.
- Los cambios importantes quedan auditados.
- Las reglas de negocio se aplican incluso si la logica de la app falla.
