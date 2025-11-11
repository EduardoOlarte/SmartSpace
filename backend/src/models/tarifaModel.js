import pool from "../config/db.js";

// ==========================
// LISTAR TODAS LAS TARIFAS
// ==========================
export const getAllTarifas = async () => {
  const { rows } = await pool.query(`
    SELECT 
      t.id,
      t.nombre,
      t.descripcion,
      t.tipo_calculo,
      t.tipo_vehiculo,
      t.parqueadero_id,
      p.nombre AS parqueadero_nombre,
      t.dia_semana,
      t.hora_inicio,
      t.hora_fin,
      t.precio,
      t.activo,
      t.fecha_creacion
    FROM tarifas t
    LEFT JOIN parqueaderos p ON t.parqueadero_id = p.id
    ORDER BY t.id ASC
  `);
  return rows;
};

// ==========================
// OBTENER TARIFA POR ID
// ==========================
export const getTarifaById = async (id) => {
  const { rows } = await pool.query(`
    SELECT 
      t.*,
      p.nombre AS parqueadero_nombre
    FROM tarifas t
    LEFT JOIN parqueaderos p ON t.parqueadero_id = p.id
    WHERE t.id = $1
  `, [id]);
  return rows[0];
};

// ==========================
// CREAR TARIFA
// ==========================
export const createTarifa = async ({
  nombre,
  descripcion,
  tipo_calculo,
  tipo_vehiculo,
  parqueadero_id,
  dia_semana,
  hora_inicio,
  hora_fin,
  precio,
  activo = true
}) => {
  if (!nombre || !tipo_calculo || precio == null) {
    throw new Error("Nombre, tipo de cálculo y precio son obligatorios");
  }

  if (precio < 0) {
    throw new Error("El precio no puede ser negativo");
  }

  const { rows } = await pool.query(`
    INSERT INTO tarifas 
      (nombre, descripcion, tipo_calculo, tipo_vehiculo, parqueadero_id, 
       dia_semana, hora_inicio, hora_fin, precio, activo)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `, [nombre, descripcion, tipo_calculo, tipo_vehiculo, parqueadero_id, 
      dia_semana, hora_inicio, hora_fin, precio, activo]);
  
  return rows[0];
};

// ==========================
// ACTUALIZAR TARIFA
// ==========================
export const updateTarifa = async (id, {
  nombre,
  descripcion,
  tipo_calculo,
  tipo_vehiculo,
  parqueadero_id,
  dia_semana,
  hora_inicio,
  hora_fin,
  precio,
  activo
}) => {
  if (precio != null && precio < 0) {
    throw new Error("El precio no puede ser negativo");
  }

  const { rows } = await pool.query(`
    UPDATE tarifas
    SET 
      nombre = COALESCE($1, nombre),
      descripcion = COALESCE($2, descripcion),
      tipo_calculo = COALESCE($3, tipo_calculo),
      tipo_vehiculo = COALESCE($4, tipo_vehiculo),
      parqueadero_id = $5,
      dia_semana = COALESCE($6, dia_semana),
      hora_inicio = $7,
      hora_fin = $8,
      precio = COALESCE($9, precio),
      activo = COALESCE($10, activo),
      fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = $11
    RETURNING *
  `, [nombre, descripcion, tipo_calculo, tipo_vehiculo, parqueadero_id,
      dia_semana, hora_inicio, hora_fin, precio, activo, id]);

  if (rows.length === 0) throw new Error(`Tarifa con id ${id} no encontrada`);
  return rows[0];
};

// ==========================
// ELIMINAR TARIFA
// ==========================
export const removeTarifa = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM tarifas WHERE id = $1", [id]);
  if (rowCount === 0) throw new Error(`No se encontró tarifa con id ${id}`);
  return true;
};

// ==========================
// BUSCAR TARIFAS
// ==========================
export const searchTarifas = async (criterio, valor) => {
  let query;
  let parametros;

  switch (criterio) {
    case "nombre":
      query = `SELECT t.*, p.nombre AS parqueadero_nombre 
               FROM tarifas t 
               LEFT JOIN parqueaderos p ON t.parqueadero_id = p.id
               WHERE t.nombre ILIKE $1 ORDER BY t.id ASC`;
      parametros = [`%${valor}%`];
      break;
    case "tipo_calculo":
      query = `SELECT t.*, p.nombre AS parqueadero_nombre 
               FROM tarifas t 
               LEFT JOIN parqueaderos p ON t.parqueadero_id = p.id
               WHERE t.tipo_calculo = $1 ORDER BY t.id ASC`;
      parametros = [valor];
      break;
    case "tipo_vehiculo":
      query = `SELECT t.*, p.nombre AS parqueadero_nombre 
               FROM tarifas t 
               LEFT JOIN parqueaderos p ON t.parqueadero_id = p.id
               WHERE t.tipo_vehiculo = $1 ORDER BY t.id ASC`;
      parametros = [valor];
      break;
    default:
      throw new Error("Criterio de búsqueda inválido");
  }

  const { rows } = await pool.query(query, parametros);
  return rows;
};

// ==========================
// CALCULAR TARIFA PARA UNA ENTRADA
// ==========================
export const calcularTarifa = async (entrada) => {
  const { tipo_vehiculo, parqueadero_id, hora_ingreso, hora_salida } = entrada;

  if (!hora_salida) {
    throw new Error("No se puede calcular tarifa sin hora de salida");
  }

  const ingreso = new Date(hora_ingreso);
  const salida = new Date(hora_salida);
  const diferenciaMs = salida - ingreso;
  
  // Calcular tiempo en diferentes unidades
  const minutos = Math.ceil(diferenciaMs / (1000 * 60));
  const horas = Math.ceil(diferenciaMs / (1000 * 60 * 60));
  const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  
  // Obtener día de la semana
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaSemana = diasSemana[ingreso.getDay()];
  const horaIngreso = ingreso.toTimeString().slice(0, 5); // HH:MM

  // Buscar tarifa más específica primero (prioridad)
  const { rows } = await pool.query(`
    SELECT * FROM tarifas
    WHERE activo = true
      AND (tipo_vehiculo = $1 OR tipo_vehiculo = 'todos')
      AND (parqueadero_id = $2 OR parqueadero_id IS NULL)
      AND (dia_semana = $3 OR dia_semana = 'Todos')
      AND (
        (hora_inicio IS NULL AND hora_fin IS NULL) OR
        (CAST($4 AS TIME) >= hora_inicio AND CAST($4 AS TIME) < hora_fin)
      )
    ORDER BY 
      CASE WHEN parqueadero_id IS NOT NULL THEN 1 ELSE 2 END,
      CASE WHEN dia_semana != 'Todos' THEN 1 ELSE 2 END,
      CASE WHEN hora_inicio IS NOT NULL THEN 1 ELSE 2 END,
      CASE WHEN tipo_vehiculo != 'todos' THEN 1 ELSE 2 END
    LIMIT 1
  `, [tipo_vehiculo, parqueadero_id, diaSemana, horaIngreso]);

  if (rows.length === 0) {
    throw new Error("No se encontró una tarifa aplicable para este vehículo");
  }

  const tarifa = rows[0];
  let montoTotal = 0;

  // Calcular según tipo de tarifa
  switch (tarifa.tipo_calculo) {
    case 'por_minuto':
      montoTotal = minutos * tarifa.precio;
      break;
    case 'por_hora':
      montoTotal = horas * tarifa.precio;
      break;
    case 'por_dia':
      montoTotal = dias * tarifa.precio;
      break;
    case 'fijo':
      montoTotal = tarifa.precio;
      break;
    default:
      throw new Error("Tipo de cálculo de tarifa no válido");
  }

  return {
    tarifa_aplicada: tarifa,
    tiempo_minutos: minutos,
    tiempo_horas: horas,
    tiempo_dias: dias,
    monto_total: parseFloat(montoTotal.toFixed(2))
  };
};