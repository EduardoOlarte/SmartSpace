import pool from "../config/db.js";

// Obtener ingresos totales por parqueadero
export const getIngresosTotales = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        p.id,
        p.nombre,
        COUNT(e.id) as total_entradas,
        COALESCE(SUM(e.monto_cobrado), 0) as ingresos_totales,
        COALESCE(AVG(e.monto_cobrado), 0) as ingreso_promedio,
        COUNT(CASE WHEN e.estado = 'activa' THEN 1 END) as entradas_activas,
        COUNT(CASE WHEN e.estado = 'cerrada' THEN 1 END) as entradas_completadas
       FROM parqueaderos p
       LEFT JOIN entradas e ON p.id = e.parqueadero_id
       GROUP BY p.id, p.nombre
       ORDER BY ingresos_totales DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error en getIngresosTotales:", error);
    res.status(500).json({ success: false, message: "Error al obtener ingresos" });
  }
};

// Obtener ingresos de un parqueadero específico
export const getIngresosParqueadero = async (req, res) => {
  try {
    const { parqueadero_id } = req.params;
    
    const { rows } = await pool.query(
      `SELECT 
        p.id,
        p.nombre,
        COUNT(e.id) as total_entradas,
        COALESCE(SUM(e.monto_cobrado), 0) as ingresos_totales,
        COALESCE(AVG(e.monto_cobrado), 0) as ingreso_promedio,
        MIN(e.hora_ingreso) as primera_entrada,
        MAX(CASE WHEN e.hora_salida IS NOT NULL THEN e.hora_salida END) as ultima_salida
       FROM parqueaderos p
       LEFT JOIN entradas e ON p.id = e.parqueadero_id
       WHERE p.id = $1
       GROUP BY p.id, p.nombre`,
      [parqueadero_id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Parqueadero no encontrado" });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error en getIngresosParqueadero:", error);
    res.status(500).json({ success: false, message: "Error al obtener ingresos" });
  }
};

// Obtener ingresos por período (fecha inicio - fecha fin)
export const getIngresosPeriodo = async (req, res) => {
  try {
    const { parqueadero_id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;
    
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        success: false, 
        message: "Se requieren parámetros: fecha_inicio y fecha_fin" 
      });
    }
    
    const { rows } = await pool.query(
      `SELECT 
        DATE(e.hora_ingreso) as fecha,
        COUNT(e.id) as entradas,
        COALESCE(SUM(e.monto_cobrado), 0) as ingresos_dia
       FROM entradas e
       WHERE e.parqueadero_id = $1 
       AND DATE(e.hora_ingreso) BETWEEN $2 AND $3
       GROUP BY DATE(e.hora_ingreso)
       ORDER BY fecha DESC`,
      [parqueadero_id, fecha_inicio, fecha_fin]
    );
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error en getIngresosPeriodo:", error);
    res.status(500).json({ success: false, message: "Error al obtener ingresos" });
  }
};

// Obtener ingresos por tipo de vehículo
export const getIngresosPorVehiculo = async (req, res) => {
  try {
    const { parqueadero_id } = req.params;
    
    const { rows } = await pool.query(
      `SELECT 
        tipo_vehiculo,
        COUNT(id) as cantidad,
        COALESCE(SUM(monto_cobrado), 0) as ingresos,
        COALESCE(AVG(monto_cobrado), 0) as promedio
       FROM entradas
       WHERE parqueadero_id = $1 AND monto_cobrado > 0
       GROUP BY tipo_vehiculo
       ORDER BY ingresos DESC`,
      [parqueadero_id]
    );
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error en getIngresosPorVehiculo:", error);
    res.status(500).json({ success: false, message: "Error al obtener ingresos" });
  }
};
