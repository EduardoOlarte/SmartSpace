// backend/src/models/userModel.js
import pool from "../config/db.js";

const SALT_ROUNDS = 10;

// Crear usuario
export const createUser = async ({ nombre, email, password, rol = "operador" }) => {
  if (!nombre || nombre.trim().length < 2) {
    throw new Error("El nombre debe tener al menos 2 caracteres");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email inválido");
  }

  if (!password || password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  if (!["administrador", "operador"].includes(rol)) {
    throw new Error("Rol inválido. Debe ser 'administrador' u 'operador'");
  }

  // Verificar email único
  const { rows: emailRows } = await pool.query(
    "SELECT id FROM usuarios WHERE email = $1",
    [email]
  );
  if (emailRows.length > 0) {
    throw new Error("Ya existe un usuario con este email");
  }

  // Hashear contraseña antes de guardar
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const query = `
    INSERT INTO usuarios (nombre, email, password, rol)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nombre, email, rol, fecha_creacion, activo
  `;
  const { rows } = await pool.query(query, [nombre, email, hashedPassword, rol]);
  return rows[0];
};

// Listar todos los usuarios
export const getAllUsers = async () => {
  const { rows } = await pool.query(
    "SELECT id, nombre, email, rol, fecha_creacion, activo FROM usuarios ORDER BY id ASC"
  );
  return rows;
};

// Obtener usuario por ID
export const getUserById = async (id) => {
  const { rows } = await pool.query(
    "SELECT id, nombre, email, rol, fecha_creacion, activo FROM usuarios WHERE id = $1",
    [id]
  );
  if (rows.length === 0) throw new Error("Usuario no encontrado");
  return rows[0];
};

// Actualizar usuario
export const updateUser = async (id, { nombre, email, password, rol }) => {
  const user = await getUserById(id);

  if (rol !== undefined && !["administrador", "operador"].includes(rol)) {
    throw new Error("Rol inválido. Debe ser 'administrador' u 'operador'");
  }

  if (email && email !== user.email) {
    const { rows } = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1 AND id != $2",
      [email, id]
    );
    if (rows.length > 0) {
      throw new Error("Ya existe un usuario con este email");
    }
  }

  const campos = [];
  const valores = [];
  let contador = 1;

  if (nombre !== undefined) {
    campos.push(`nombre = $${contador}`);
    valores.push(nombre);
    contador++;
  }
  if (email !== undefined) {
    campos.push(`email = $${contador}`);
    valores.push(email);
    contador++;
  }
  if (password !== undefined) {
    // Hashear contraseña antes de actualizar
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    campos.push(`password = $${contador}`);
    valores.push(hashedPassword);
    contador++;
  }
  if (rol !== undefined) {
    campos.push(`rol = $${contador}`);
    valores.push(rol);
    contador++;
  }

  if (campos.length === 0) return user;

  valores.push(id);
  const query = `
    UPDATE usuarios 
    SET ${campos.join(", ")} 
    WHERE id = $${contador}
    RETURNING id, nombre, email, rol, fecha_creacion, activo
  `;
  const { rows } = await pool.query(query, valores);
  return rows[0];
};

// Eliminar usuario
export const deleteUser = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM usuarios WHERE id = $1 RETURNING id, nombre, email, rol",
    [id]
  );
  if (rows.length === 0) throw new Error("Usuario no encontrado");
  return rows[0];
};

export const getUserByNombre = async (nombre) => {
  const { rows } = await pool.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
  return rows[0]; // incluye password
};


// Buscar usuarios
export const searchUsers = async (criterio, valor) => {
  let query;
  let parametros;

  switch (criterio) {
    case "nombre":
      query = "SELECT id, nombre, email, rol, fecha_creacion, activo FROM usuarios WHERE nombre ILIKE $1";
      parametros = [`%${valor}%`];
      break;
    case "email":
      query = "SELECT id, nombre, email, rol, fecha_creacion, activo FROM usuarios WHERE email ILIKE $1";
      parametros = [`%${valor}%`];
      break;
    case "rol":
      query = "SELECT id, nombre, email, rol, fecha_creacion, activo FROM usuarios WHERE rol = $1";
      parametros = [valor];
      break;
    default:
      throw new Error("Criterio de búsqueda inválido");
  }

  const { rows } = await pool.query(query, parametros);
  return rows;
};
