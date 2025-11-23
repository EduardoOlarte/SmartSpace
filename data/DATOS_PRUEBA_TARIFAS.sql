-- =====================================================
-- SCRIPT DE PRUEBA: Entradas con fechas antiguas
-- Propósito: Generar registros históricos para validar
--            el cálculo correcto de tarifas
-- =====================================================

-- Eliminar entradas existentes de prueba para empezar limpio
-- DELETE FROM entradas WHERE placa LIKE 'TEST%' OR placa LIKE 'PRUEBA%';

-- =====================================================
-- GRUPO 1: MOTO - POR HORA
-- =====================================================
-- Moto - POR HORA - Hace exactamente 1 hora: Entrada a las 2:21 PM (hace 1h)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_MOTO_1H', 'moto', 1, 1, 5, 'por_hora', 
 '2025-11-22 14:21:00', NULL, 'activa', NULL);

-- Moto - POR HORA - Hace exactamente 2 horas: Entrada a las 1:21 PM (hace 2h)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_MOTO_2H', 'moto', 1, 1, 6, 'por_hora', 
 '2025-11-22 13:21:00', NULL, 'activa', NULL);

-- Moto - POR HORA - Hace exactamente 5 horas: Entrada a las 10:21 AM (hace 5h)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_MOTO_5H', 'moto', 1, 1, 7, 'por_hora', 
 '2025-11-22 10:21:00', NULL, 'activa', NULL);

-- Moto - POR DÍA - Ingresó ayer (21/11/2025) a las 3:21 PM (hace 1 día exacto)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_MOTO_1DIA', 'moto', 1, 1, 8, 'por_dia', 
 '2025-11-21 15:21:00', NULL, 'activa', NULL);

-- Moto - POR DÍA - Ingresó el 20/11/2025 a las 3:21 PM (hace 2 días exactos)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_MOTO_2DIA', 'moto', 1, 1, 9, 'por_dia', 
 '2025-11-20 15:21:00', NULL, 'activa', NULL);

-- Moto - POR DÍA - Ingresó el 19/11/2025 a las 3:21 PM (hace 3 días exactos)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_MOTO_3DIA', 'moto', 1, 1, 10, 'por_dia', 
 '2025-11-19 15:21:00', NULL, 'activa', NULL);

-- =====================================================
-- GRUPO 2: AUTOMÓVIL - POR HORA Y POR DÍA
-- =====================================================
-- Automóvil - POR HORA - Hace exactamente 1 hora: Entrada a las 2:21 PM (hace 1h)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_AUTO_1H', 'automovil', 1, 1, 15, 'por_hora', 
 '2025-11-22 14:21:00', NULL, 'activa', NULL);

-- Automóvil - POR HORA - Hace exactamente 3 horas: Entrada a las 12:21 PM (hace 3h)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_AUTO_3H', 'automovil', 1, 1, 16, 'por_hora', 
 '2025-11-22 12:21:00', NULL, 'activa', NULL);

-- Automóvil - POR HORA - Hace exactamente 6 horas: Entrada a las 9:21 AM (hace 6h)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_AUTO_6H', 'automovil', 1, 1, 17, 'por_hora', 
 '2025-11-22 09:21:00', NULL, 'activa', NULL);

-- Automóvil - POR DÍA - Ingresó ayer (21/11/2025) a las 3:21 PM (hace 1 día exacto)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_AUTO_1DIA', 'automovil', 1, 1, 18, 'por_dia', 
 '2025-11-21 15:21:00', NULL, 'activa', NULL);

-- Automóvil - POR DÍA - Ingresó el 20/11/2025 a las 3:21 PM (hace 2 días exactos)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_AUTO_2DIA', 'automovil', 1, 1, 19, 'por_dia', 
 '2025-11-20 15:21:00', NULL, 'activa', NULL);

-- Automóvil - POR DÍA - Ingresó el 19/11/2025 a las 3:21 PM (hace 3 días exactos)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_AUTO_3DIA', 'automovil', 1, 1, 20, 'por_dia', 
 '2025-11-19 15:21:00', NULL, 'activa', NULL);

-- =====================================================
-- GRUPO 3: CAMIÓN - POR HORA Y POR DÍA
-- =====================================================
-- Camión - POR HORA - Hace exactamente 1 hora: Entrada a las 2:21 PM (hace 1h)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_CAMION_1H', 'camion', 1, 1, 25, 'por_hora', 
 '2025-11-22 14:21:00', NULL, 'activa', NULL);

-- Camión - POR HORA - Hace exactamente 2 horas: Entrada a las 1:21 PM (hace 2h)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_CAMION_2H', 'camion', 1, 1, 26, 'por_hora', 
 '2025-11-22 13:21:00', NULL, 'activa', NULL);

-- Camión - POR HORA - Hace exactamente 8 horas: Entrada a las 7:21 AM (hace 8h)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_CAMION_8H', 'camion', 1, 1, 27, 'por_hora', 
 '2025-11-22 07:21:00', NULL, 'activa', NULL);

-- Camión - POR DÍA - Ingresó ayer (21/11/2025) a las 3:21 PM (hace 1 día exacto)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_CAMION_1DIA', 'camion', 1, 1, 28, 'por_dia', 
 '2025-11-21 15:21:00', NULL, 'activa', NULL);

-- Camión - POR DÍA - Ingresó el 20/11/2025 a las 3:21 PM (hace 2 días exactos)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_CAMION_2DIA', 'camion', 1, 1, 29, 'por_dia', 
 '2025-11-20 15:21:00', NULL, 'activa', NULL);

-- Camión - POR DÍA - Ingresó el 18/11/2025 a las 3:21 PM (hace 4 días exactos)
INSERT INTO entradas (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, tipo_cobro, hora_ingreso, hora_salida, estado, monto_cobrado)
VALUES
('PRUEBA_CAMION_4DIA', 'camion', 1, 1, 30, 'por_dia', 
 '2025-11-18 15:21:00', NULL, 'activa', NULL);

-- =====================================================
-- QUERY DE VALIDACIÓN
-- =====================================================
-- Ejecuta esta query para ver todos los registros de prueba:
-- SELECT 
--   id, placa, tipo_vehiculo, tipo_cobro, 
--   hora_ingreso, hora_salida,
--   CASE 
--     WHEN tipo_cobro = 'por_hora' THEN CEIL(EXTRACT(EPOCH FROM (NOW() - hora_ingreso)) / 3600)
--     WHEN tipo_cobro = 'por_dia' THEN CEIL(EXTRACT(EPOCH FROM (NOW() - hora_ingreso)) / 86400)
--   END AS cantidad_unidades,
--   monto_cobrado,
--   estado
-- FROM entradas 
-- WHERE placa LIKE 'PRUEBA%' 
-- ORDER BY tipo_vehiculo, tipo_cobro, hora_ingreso DESC;

-- =====================================================
-- RESUMEN DE CASOS DE PRUEBA (Fechas fijas: 22/11/2025 a las 3:21 PM)
-- =====================================================
-- 
-- MOTO (Tarifa: 3000 por_hora, 15000 por_dia)
--   ✓ 1 hora  (14:21) → 1 × 3000 = 3000
--   ✓ 2 horas (13:21) → 2 × 3000 = 6000
--   ✓ 5 horas (10:21) → 5 × 3000 = 15000
--   ✓ 1 día   (21/11 15:21) → 1 × 15000 = 15000
--   ✓ 2 días  (20/11 15:21) → 2 × 15000 = 30000
--   ✓ 3 días  (19/11 15:21) → 3 × 15000 = 45000
--
-- AUTOMÓVIL (Tarifa: 5000 por_hora, 30000 por_dia)
--   ✓ 1 hora  (14:21) → 1 × 5000 = 5000
--   ✓ 3 horas (12:21) → 3 × 5000 = 15000
--   ✓ 6 horas (09:21) → 6 × 5000 = 30000
--   ✓ 1 día   (21/11 15:21) → 1 × 30000 = 30000
--   ✓ 2 días  (20/11 15:21) → 2 × 30000 = 60000
--   ✓ 3 días  (19/11 15:21) → 3 × 30000 = 90000
--
-- CAMIÓN (Tarifa: 8000 por_hora, 50000 por_dia)
--   ✓ 1 hora  (14:21) → 1 × 8000 = 8000
--   ✓ 2 horas (13:21) → 2 × 8000 = 16000
--   ✓ 8 horas (07:21) → 8 × 8000 = 64000
--   ✓ 1 día   (21/11 15:21) → 1 × 50000 = 50000
--   ✓ 2 días  (20/11 15:21) → 2 × 50000 = 100000
--   ✓ 4 días  (18/11 15:21) → 4 × 50000 = 200000
--
-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 1. Los registros tienen ENTRADA con fechas/horas específicas del pasado
--    pero SIN SALIDA (hora_salida = NULL)
--
-- 2. El estado es 'activa' para que puedas registrar la salida desde la app
--
-- 3. El monto_cobrado está en NULL - se calcula cuando la app registra la salida
--
-- 4. Los espacios asignados (5-30) evitan conflictos con datos existentes
--
-- 5. CÓMO PROBAR:
--    a) Ejecuta este script en pgAdmin
--    b) Abre la app y ve a Entradas
--    c) Verifica que los registros aparezcan con status "activa"
--    d) Haz clic en "Registrar Salida" para cada uno
--    e) Valida que el monto_cobrado sea el esperado
--    f) Prueba con diferentes períodos (1h, 2h, 3 días, etc.)
--
-- 6. Si el monto NO es correcto:
--    - Revisa tarifaModel.js::calcularTarifa()
--    - Verifica que tipo_cobro se use correctamente
--    - Asegúrate que CEIL() redondea hacia arriba correctamente
