import pool from "../config/db.js";

// ======================================
// Validar horario solapado
// ======================================
const validarHorarioDisponible = async ({ id = null, parqueadero_id, dia_semana, hora_apertura, hora_cierre }) => {
  const query = `
    SELECT id, hora_apertura, hora_cierre
    FROM horarios
    WHERE parqueadero_id = $1
      AND dia_semana = $2
      ${id ? 'AND id <> $3' : ''}
  `;

  const params = id ? [parqueadero_id, dia_semana, id] : [parqueadero_id, dia_semana];
  const { rows } = await pool.query(query, params);

  for (const h of rows) {
    // Si se cruzan las horas: (inicio < otro_fin) && (fin > otro_inicio)
    if (hora_apertura < h.hora_cierre && hora_cierre > h.hora_apertura) {
      throw new Error(
        `Horario conflictivo: se cruza con un horario existente de ${h.hora_apertura} a ${h.hora_cierre}`
      );
    }
  }
};

// ======================================
// Listar todos los horarios
// ======================================
export const getAllHorarios = async () => {
  const { rows } = await pool.query(
    `SELECT 
        h.id,
        h.dia_semana AS dia,
        h.hora_apertura AS hora_inicio,
        h.hora_cierre AS hora_fin,
        p.nombre AS asignadoA,
        h.activo
     FROM horarios h
     JOIN parqueaderos p ON h.parqueadero_id = p.id
     ORDER BY h.id ASC`
  );
  return rows;
};

// ======================================
// Obtener horario por ID
// ======================================
export const getHorarioById = async (id) => {
  const { rows } = await pool.query(
    `SELECT 
        h.id,
        h.dia_semana AS dia,
        h.hora_apertura AS hora_inicio,
        h.hora_cierre AS hora_fin,
        p.nombre AS asignadoA,
        h.activo
     FROM horarios h
     JOIN parqueaderos p ON h.parqueadero_id = p.id
     WHERE h.id = $1`,
    [id]
  );
  return rows[0];
};

export const createHorario = async ({ parqueadero_id, dia_semana, hora_apertura, hora_cierre, activo = true }) => {
  if (hora_cierre <= hora_apertura) {
    throw new Error("La hora de cierre debe ser posterior a la hora de apertura");
  }

  await validarHorarioDisponible({ parqueadero_id, dia_semana, hora_apertura, hora_cierre });

  const { rows } = await pool.query(
    `INSERT INTO horarios 
      (parqueadero_id, dia_semana, hora_apertura, hora_cierre, activo)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING 
        id,
        dia_semana AS dia,
        hora_apertura AS hora_inicio,
        hora_cierre AS hora_fin,
        parqueadero_id,
        activo`,
    [parqueadero_id, dia_semana, hora_apertura, hora_cierre, activo]
  );
  return rows[0];
};

export const updateHorario = async (id, { parqueadero_id, dia_semana, hora_apertura, hora_cierre, activo }) => {
  if (hora_cierre <= hora_apertura) {
    throw new Error("La hora de cierre debe ser posterior a la hora de apertura");
  }

  await validarHorarioDisponible({ id, parqueadero_id, dia_semana, hora_apertura, hora_cierre });

  const { rows } = await pool.query(
    `UPDATE horarios
     SET parqueadero_id = $1,
         dia_semana = $2,
         hora_apertura = $3,
         hora_cierre = $4,
         activo = $5,
         fecha_actualizacion = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING 
        id,
        dia_semana AS dia,
        hora_apertura AS hora_inicio,
        hora_cierre AS hora_fin,
        parqueadero_id,
        activo`,
    [parqueadero_id, dia_semana, hora_apertura, hora_cierre, activo, id]
  );

  if (rows.length === 0) throw new Error(`Horario con id ${id} no encontrado`);
  return rows[0];
};


// ======================================
// Eliminar horario
// ======================================
export const removeHorario = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM horarios WHERE id = $1", [id]);
  if (rowCount === 0) throw new Error(`No se encontró horario con id ${id}`);
  return true;
};

// ======================================
// Buscar horarios por criterio
// ======================================
export const searchHorarios = async (criterio, valor) => {
  let query;
  let parametros;
  valor = valor.trim();

  switch (criterio) {
    case "dia":
      query = `
        SELECT 
          h.id,
          h.dia_semana AS dia,
          h.hora_apertura AS hora_inicio,
          h.hora_cierre AS hora_fin,
          p.nombre AS asignadoA,
          h.activo
        FROM horarios h
        JOIN parqueaderos p ON h.parqueadero_id = p.id
        WHERE h.dia_semana ILIKE $1
        ORDER BY h.id ASC`;
      parametros = [`%${valor}%`];
      break;

    case "parqueadero":
    case "nombre": // 🔹 soportar "nombre" del frontend
      query = `
        SELECT 
          h.id,
          h.dia_semana AS dia,
          h.hora_apertura AS hora_inicio,
          h.hora_cierre AS hora_fin,
          p.nombre AS asignadoA,
          h.activo
        FROM horarios h
        JOIN parqueaderos p ON h.parqueadero_id = p.id
        WHERE p.nombre ILIKE $1
        ORDER BY h.id ASC`;
      parametros = [`%${valor}%`];
      break;

    case "hora_inicio":
      query = `
        SELECT 
          h.id,
          h.dia_semana AS dia,
          h.hora_apertura AS hora_inicio,
          h.hora_cierre AS hora_fin,
          p.nombre AS asignadoA,
          h.activo
        FROM horarios h
        JOIN parqueaderos p ON h.parqueadero_id = p.id
        WHERE to_char(h.hora_apertura, 'HH24:MI') = $1
        ORDER BY h.id ASC`;
      parametros = [valor];
      break;

    case "hora_fin":
      query = `
        SELECT 
          h.id,
          h.dia_semana AS dia,
          h.hora_apertura AS hora_inicio,
          h.hora_cierre AS hora_fin,
          p.nombre AS asignadoA,
          h.activo
        FROM horarios h
        JOIN parqueaderos p ON h.parqueadero_id = p.id
        WHERE to_char(h.hora_cierre, 'HH24:MI') = $1
        ORDER BY h.id ASC`;
      parametros = [valor];
      break;

    default:
      throw new Error("Criterio de búsqueda inválido");
  }

  const { rows } = await pool.query(query, parametros);
  return rows;
};

