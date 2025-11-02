import pool from "../config/db.js";

// ==========================
// Modelo Entradas
// ==========================

// Listar todas las entradas
export const getAllEntradas = async () => {
  const { rows } = await pool.query(
    `SELECT e.*, p.nombre AS parqueadero, c.nombre AS controlador
     FROM entradas e
     JOIN parqueaderos p ON e.parqueadero_id = p.id
     JOIN controladores c ON e.controlador_id = c.id
     ORDER BY e.hora_ingreso DESC`
  );
  return rows;
};

// Obtener entrada por ID
export const getEntradaById = async (id) => {
  const { rows } = await pool.query(
    `SELECT e.*, p.nombre AS parqueadero, c.nombre AS controlador
     FROM entradas e
     JOIN parqueaderos p ON e.parqueadero_id = p.id
     JOIN controladores c ON e.controlador_id = c.id
     WHERE e.id=$1`,
    [id]
  );
  return rows[0];
};

// Crear nueva entrada
export const createEntrada = async ({
  placa,
  tipo_vehiculo,
  parqueadero_id,
  controlador_id,
  espacio_asignado
}) => {
  const placaNormalized = placa.trim().toUpperCase();

  // 1. Validar duplicidad de placa
  const { rows: placaExistente } = await pool.query(
    `SELECT id FROM entradas 
     WHERE UPPER(TRIM(placa)) = $1 AND estado='activa'`,
    [placaNormalized]
  );
  if (placaExistente.length > 0) {
    throw new Error(`Ya existe una entrada activa con la placa ${placaNormalized}`);
  }

  // 2. Validar espacio ocupado en parqueadero
  const { rows: espacioOcupado } = await pool.query(
    `SELECT id FROM entradas
     WHERE parqueadero_id=$1 AND espacio_asignado=$2 AND estado='activa'`,
    [parqueadero_id, espacio_asignado]
  );
  if (espacioOcupado.length > 0) {
    throw new Error(`El espacio ${espacio_asignado} en este parqueadero ya está ocupado`);
  }

  // 3. Validar capacidad del parqueadero
  const { rows: parqueadero } = await pool.query(
    `SELECT capacidad FROM parqueaderos WHERE id=$1`,
    [parqueadero_id]
  );
  if (!parqueadero[0]) throw new Error("Parqueadero no encontrado");
  if (espacio_asignado > parqueadero[0].capacidad) {
    throw new Error(`El espacio asignado (${espacio_asignado}) supera la capacidad del parqueadero (${parqueadero[0].capacidad})`);
  }

  // Insertar entrada
  const { rows } = await pool.query(
    `INSERT INTO entradas 
      (placa, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, estado)
     VALUES ($1,$2,$3,$4,$5,'activa') RETURNING *`,
    [placaNormalized, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado]
  );

  return rows[0];
};

// Actualizar entrada
export const updateEntrada = async (id, {
  placa,
  tipo_vehiculo,
  parqueadero_id,
  controlador_id,
  espacio_asignado,
  hora_salida,
  estado
}) => {
  const placaNormalized = placa ? placa.trim().toUpperCase() : null;

  // 1. Validar placa duplicada
  if (placaNormalized) {
    const { rows: placaExistente } = await pool.query(
      `SELECT id FROM entradas WHERE UPPER(TRIM(placa))=$1 AND estado='activa' AND id<>$2`,
      [placaNormalized, id]
    );
    if (placaExistente.length > 0) {
      throw new Error(`Ya existe otra entrada activa con la placa ${placaNormalized}`);
    }
  }

  // 2. Validar espacio ocupado
  if (parqueadero_id && espacio_asignado) {
    const { rows: espacioOcupado } = await pool.query(
      `SELECT id FROM entradas 
       WHERE parqueadero_id=$1 AND espacio_asignado=$2 AND estado='activa' AND id<>$3`,
      [parqueadero_id, espacio_asignado, id]
    );
    if (espacioOcupado.length > 0) {
      throw new Error(`El espacio ${espacio_asignado} en este parqueadero ya está ocupado`);
    }

    // 3. Validar capacidad
    const { rows: parqueadero } = await pool.query(
      `SELECT capacidad FROM parqueaderos WHERE id=$1`,
      [parqueadero_id]
    );
    if (!parqueadero[0]) throw new Error("Parqueadero no encontrado");
    if (espacio_asignado > parqueadero[0].capacidad) {
      throw new Error(`El espacio asignado (${espacio_asignado}) supera la capacidad del parqueadero (${parqueadero[0].capacidad})`);
    }
  }

  // Preparar campos a actualizar
  const allowedFields = { placa: placaNormalized, tipo_vehiculo, parqueadero_id, controlador_id, espacio_asignado, hora_salida, estado };
  const updates = Object.entries(allowedFields).filter(([_, value]) => value !== undefined);

  if (updates.length === 0) return null;

  const setClauses = updates.map(([key], idx) => `${key}=$${idx + 1}`).join(", ");
  const values = updates.map(([_, value]) => value);

  const { rows } = await pool.query(
    `UPDATE entradas SET ${setClauses} WHERE id=$${updates.length + 1} RETURNING *`,
    [...values, id]
  );

  if (rows.length === 0) throw new Error(`Entrada con id ${id} no encontrada`);
  return rows[0];
};

// Eliminar entrada
export const removeEntrada = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM entradas WHERE id=$1", [id]);
  if (rowCount === 0) throw new Error(`No se encontró entrada con id ${id}`);
  return true;
};

// Buscar entradas
export const searchEntradas = async (criterio, valor) => {
  let query;
  let parametros;

  switch (criterio) {
    case "placa":
      query = `SELECT e.*, p.nombre AS parqueadero, c.nombre AS controlador
               FROM entradas e
               JOIN parqueaderos p ON e.parqueadero_id = p.id
               JOIN controladores c ON e.controlador_id = c.id
               WHERE e.placa ILIKE $1
               ORDER BY e.hora_ingreso DESC`;
      parametros = [`%${valor}%`];
      break;
    case "tipo_vehiculo":
      query = `SELECT e.*, p.nombre AS parqueadero, c.nombre AS controlador
               FROM entradas e
               JOIN parqueaderos p ON e.parqueadero_id = p.id
               JOIN controladores c ON e.controlador_id = c.id
               WHERE e.tipo_vehiculo ILIKE $1
               ORDER BY e.hora_ingreso DESC`;
      parametros = [`%${valor}%`];
      break;
    case "estado":
      query = `SELECT e.*, p.nombre AS parqueadero, c.nombre AS controlador
               FROM entradas e
               JOIN parqueaderos p ON e.parqueadero_id = p.id
               JOIN controladores c ON e.controlador_id = c.id
               WHERE e.estado ILIKE $1
               ORDER BY e.hora_ingreso DESC`;
      parametros = [`%${valor}%`];
      break;
    default:
      throw new Error("Criterio de búsqueda inválido");
  }

  const { rows } = await pool.query(query, parametros);
  return rows;
};
