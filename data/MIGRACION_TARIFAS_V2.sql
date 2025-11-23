-- ================================================
-- MIGRACIÓN: Sistema de Tarifas Mejorado V2
-- Simplificación a por_dia y por_hora
-- Agregar tipo_cobro a entradas
-- ================================================

-- 1. Agregar columna tipo_cobro a entradas
ALTER TABLE entradas
ADD COLUMN tipo_cobro VARCHAR(20) DEFAULT 'por_hora';

-- 2. Actualizar tarifas existentes a tipo_calculo válidos
-- Convertir por_minuto a por_hora
UPDATE tarifas SET tipo_calculo = 'por_hora' WHERE tipo_calculo = 'por_minuto';

-- Convertir fijo a por_dia (cobro fijo por día)
UPDATE tarifas SET tipo_calculo = 'por_dia' WHERE tipo_calculo = 'fijo';

-- 3. Validar y limpiar tipo_vehiculo (solo moto, automovil, camion)
-- Si hay "otros", convertir a automovil como default
UPDATE tarifas SET tipo_vehiculo = 'automovil' WHERE tipo_vehiculo NOT IN ('moto', 'automovil', 'camion');

-- 4. Agregar restricción CHECK a tarifas si no existe
-- (esto puede variar según BD, algunos ya lo tienen)
-- ALTER TABLE tarifas DROP CONSTRAINT IF EXISTS check_tipo_calculo;
-- ALTER TABLE tarifas ADD CONSTRAINT check_tipo_calculo 
--   CHECK (tipo_calculo IN ('por_dia', 'por_hora'));

-- 5. Agregar restricción CHECK a tipo_vehiculo
-- ALTER TABLE tarifas DROP CONSTRAINT IF EXISTS check_tipo_vehiculo;
-- ALTER TABLE tarifas ADD CONSTRAINT check_tipo_vehiculo 
--   CHECK (tipo_vehiculo IN ('moto', 'automovil', 'camion'));

-- 6. Agregar restricción CHECK a tipo_cobro en entradas
-- ALTER TABLE entradas DROP CONSTRAINT IF EXISTS check_tipo_cobro;
-- ALTER TABLE entradas ADD CONSTRAINT check_tipo_cobro 
--   CHECK (tipo_cobro IN ('por_dia', 'por_hora'));

-- ================================================
-- EJEMPLOS DE TARIFAS NUEVAS (Recomendado)
-- ================================================

-- Insertar tarifas de ejemplo por tipo de vehículo
-- Moto
INSERT INTO tarifas (nombre, descripcion, tipo_calculo, tipo_vehiculo, dia_semana, precio, activo)
VALUES 
  ('Tarifa Moto - Por Hora', 'Cobro por hora para motos', 'por_hora', 'moto', 'Todos', 3000, true),
  ('Tarifa Moto - Por Día', 'Cobro por día para motos', 'por_dia', 'moto', 'Todos', 15000, true)
ON CONFLICT DO NOTHING;

-- Automóvil
INSERT INTO tarifas (nombre, descripcion, tipo_calculo, tipo_vehiculo, dia_semana, precio, activo)
VALUES 
  ('Tarifa Automóvil - Por Hora', 'Cobro por hora para automóviles', 'por_hora', 'automovil', 'Todos', 5000, true),
  ('Tarifa Automóvil - Por Día', 'Cobro por día para automóviles', 'por_dia', 'automovil', 'Todos', 30000, true)
ON CONFLICT DO NOTHING;

-- Camión
INSERT INTO tarifas (nombre, descripcion, tipo_calculo, tipo_vehiculo, dia_semana, precio, activo)
VALUES 
  ('Tarifa Camión - Por Hora', 'Cobro por hora para camiones', 'por_hora', 'camion', 'Todos', 8000, true),
  ('Tarifa Camión - Por Día', 'Cobro por día para camiones', 'por_dia', 'camion', 'Todos', 50000, true)
ON CONFLICT DO NOTHING;

-- ================================================
-- VERIFICACIÓN
-- ================================================
-- Ejecuta estos SELECT para verificar la migración:

-- SELECT DISTINCT tipo_calculo FROM tarifas;
-- SELECT DISTINCT tipo_vehiculo FROM tarifas;
-- SELECT id, placa, tipo_cobro FROM entradas LIMIT 5;

-- ✅ Todo debe mostrar solo valores válidos
