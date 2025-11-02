// backend/src/controllers/userController.js
import * as UserModel from "../models/userModel.js";


// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await UserModel.getAllUsers();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

// Crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const nuevo = await UserModel.createUser(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: "Error al crear usuario", error: error.message });
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await UserModel.getUserById(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ message: "Usuario no encontrado", error: error.message });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const actualizado = await UserModel.updateUser(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar usuario", error: error.message });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await UserModel.deleteUser(req.params.id);
    res.json(eliminado);
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar usuario", error: error.message });
  }
};

// Buscar usuarios
export const buscarUsuarios = async (req, res) => {
  try {
    const { criterio, valor } = req.params;
    const resultados = await UserModel.searchUsers(criterio, valor);
    res.json(resultados);
  } catch (error) {
    res.status(400).json({ message: "Error en la búsqueda de usuarios", error: error.message });
  }
};
