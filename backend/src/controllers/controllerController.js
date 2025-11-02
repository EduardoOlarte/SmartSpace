import * as ControllerModel from "../models/controllerModel.js";

// Obtener todos los controladores
export const obtenerControladores = async (req, res) => {
  try {
    const controladores = await ControllerModel.getAllControllers();
    res.json(controladores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener controladores", error: error.message });
  }
};

// Crear controlador
export const crearControlador = async (req, res) => {
  try {
    const nuevo = await ControllerModel.createController(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: "Error al crear controlador", error: error.message });
  }
};

// Actualizar controlador
export const actualizarControlador = async (req, res) => {
  try {
    const actualizado = await ControllerModel.updateController(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar controlador", error: error.message });
  }
};

// Eliminar controlador
export const eliminarControlador = async (req, res) => {
  try {
    const eliminado = await ControllerModel.deleteController(req.params.id);
    res.json({ message: "Controlador eliminado correctamente", data: eliminado });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar controlador", error: error.message });
  }
};

// Buscar controladores
export const buscarControladores = async (req, res) => {
  try {
    const { criterio, valor } = req.params;
    const resultados = await ControllerModel.searchControllers(criterio, valor);
    res.json(resultados);
  } catch (error) {
    res.status(400).json({ message: "Error en la búsqueda de controladores", error: error.message });
  }
};
