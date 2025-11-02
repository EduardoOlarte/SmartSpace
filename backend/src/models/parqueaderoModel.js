import pool from "../config/db.js";

// Listar todos los parqueaderos
export const getAllParqueaderos = async () => {
  const { rows } = await pool.query("SELECT * FROM parqueaderos ORDER BY id ASC");
  return rows;
};

// Obtener un parqueadero por ID
export const getParqueaderoById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM parqueaderos WHERE id=$1", [id]);
  return rows[0];
};

// Crear parqueadero
export const createParqueadero = async ({
  nombre,
  capacidad,
  ubicacion,
  ciudad,
  dias_operacion
}) => {
  const { rows } = await pool.query(
    `INSERT INTO parqueaderos 
      (nombre, capacidad, ubicacion, ciudad, dias_operacion)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [nombre, capacidad, ubicacion, ciudad, dias_operacion]
  );
  return rows[0];
};

// Actualizar parqueadero
export const updateParqueadero = async (id, {
  nombre,
  capacidad,
  ubicacion,
  ciudad,
  dias_operacion
}) => {
  const { rows } = await pool.query(
    `UPDATE parqueaderos 
     SET nombre=$1, capacidad=$2, ubicacion=$3, ciudad=$4, dias_operacion=$5
     WHERE id=$6 RETURNING *`,
    [nombre, capacidad, ubicacion, ciudad, dias_operacion, id]
  );
  if (rows.length === 0) throw new Error(`Parqueadero con id ${id} no encontrado`);
  return rows[0];
};

// Eliminar parqueadero
export const removeParqueadero = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM parqueaderos WHERE id=$1", [id]);
  if (rowCount === 0) throw new Error(`No se encontró parqueadero con id ${id}`);
  return true;
};

// Buscar parqueaderos
export const searchParqueaderos = async (criterio, valor) => {
  let query;
  let parametros;

  switch (criterio) {
    case "nombre":
      query = "SELECT * FROM parqueaderos WHERE nombre ILIKE $1 ORDER BY id ASC";
      parametros = [`%${valor}%`];
      break;
    case "ubicacion":
      query = "SELECT * FROM parqueaderos WHERE ubicacion ILIKE $1 ORDER BY id ASC";
      parametros = [`%${valor}%`];
      break;
    case "ciudad":
      query = "SELECT * FROM parqueaderos WHERE ciudad ILIKE $1 ORDER BY id ASC";
      parametros = [`%${valor}%`];
      break;
    case "capacidad":
      const capacidadNum = Number(valor);
      if (isNaN(capacidadNum)) throw new Error("Capacidad debe ser un número");
      query = "SELECT * FROM parqueaderos WHERE capacidad = $1 ORDER BY id ASC";
      parametros = [capacidadNum];
      break;
    default:
      throw new Error("Criterio de búsqueda inválido");
  }

  const { rows } = await pool.query(query, parametros);
  return rows;
};
