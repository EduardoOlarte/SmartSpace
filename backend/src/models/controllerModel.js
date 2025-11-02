import pool from "../config/db.js";

// Listar todos los controladores
export const getAllControllers = async () => {
  const { rows } = await pool.query("SELECT * FROM controladores ORDER BY id ASC");
  return rows;
};

// Crear controlador
export const createController = async ({ nombre, identificacion, telefono, rol, activo = true }) => {
  if (!nombre || nombre.trim().length < 1) {
    throw new Error("El nombre debe tener al menos 1 caracteres");
  }

  if (!identificacion || identificacion.trim().length === 0) {
    throw new Error("Identificación obligatoria");
  }

  if (!["operador", "supervisor"].includes(rol)) {
    throw new Error("Rol inválido. Solo se permite 'operador' o 'supervisor'.");
  }

  const { rows } = await pool.query(
    `INSERT INTO controladores (nombre, identificacion, telefono, rol, activo)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre, identificacion, telefono, rol, activo]
  );
  return rows[0];
};

// Actualizar controlador
export const updateController = async (id, { nombre, telefono, rol, activo }) => {
  if (!["operador", "supervisor"].includes(rol)) {
    throw new Error("Rol inválido. Solo se permite 'operador' o 'supervisor'.");
  }

  const { rows } = await pool.query(
    `UPDATE controladores 
     SET nombre=$1, telefono=$2, rol=$3, activo=$4
     WHERE id=$5 RETURNING *`,
    [nombre, telefono, rol, activo, id]
  );

  if (rows.length === 0) throw new Error("Controlador no encontrado");
  return rows[0];
};
// Buscar controlador por nombre e identificación (para login)
export const getControllerByNombreYIdentificacion = async (nombre, identificacion) => {
  const { rows } = await pool.query(
    `SELECT * FROM controladores 
     WHERE nombre = $1 AND identificacion = $2 AND activo = true`,
    [nombre, identificacion]
  );
  return rows[0] || null;
};


// Eliminar controlador
export const deleteController = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM controladores WHERE id=$1 RETURNING *",
    [id]
  );
  if (rows.length === 0) throw new Error("Controlador no encontrado");
  return rows[0];
};

// Buscar controladores
export const searchControllers = async (criterio, valor) => {
  let query;
  let parametros;

  switch (criterio) {
    case "nombre":
      query = "SELECT * FROM controladores WHERE nombre ILIKE $1 ORDER BY id ASC";
      parametros = [`%${valor}%`];
      break;
    case "identificacion":
      query = "SELECT * FROM controladores WHERE identificacion ILIKE $1 ORDER BY id ASC";
      parametros = [`%${valor}%`];
      break;
    case "rol":
      query = "SELECT * FROM controladores WHERE rol = $1 ORDER BY id ASC";
      parametros = [valor];
      break;
    case "activo":
      query = "SELECT * FROM controladores WHERE activo = $1 ORDER BY id ASC";
      parametros = [valor === "true"];
      break;
    default:
      throw new Error("Criterio de búsqueda inválido");
  }

  const { rows } = await pool.query(query, parametros);
  return rows;
};
