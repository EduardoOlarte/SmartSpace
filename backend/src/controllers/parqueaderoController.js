import * as ParqueaderoModel from "../models/parqueaderoModel.js";

// Obtener todos los parqueaderos
export const obtenerParqueaderos = async (req, res) => {
  try {
    const parqueaderos = await ParqueaderoModel.getAllParqueaderos();
    res.json(parqueaderos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los parqueaderos", error: error.message });
  }
};

// Obtener un parqueadero por ID
export const obtenerParqueadero = async (req, res) => {
  try {
    const parqueadero = await ParqueaderoModel.getParqueaderoById(req.params.id);
    if (!parqueadero) return res.status(404).json({ message: "Parqueadero no encontrado" });
    res.json(parqueadero);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el parqueadero", error: error.message });
  }
};

// Crear parqueadero

export const crearParqueadero = async (req, res) => {
  try {
    // Solo se espera nombre, capacidad, ubicacion, ciudad, dias_operacion
    const nuevo = await ParqueaderoModel.createParqueadero(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el parqueadero", error: error.message });
  }
};


// Actualizar parqueadero
export const actualizarParqueadero = async (req, res) => {
  try {
    const actualizado = await ParqueaderoModel.updateParqueadero(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ message: "Parqueadero no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el parqueadero", error: error.message });
  }
};


// Eliminar parqueadero
export const eliminarParqueadero = async (req, res) => {
  try {
    await ParqueaderoModel.removeParqueadero(req.params.id);
    res.json({ message: "Parqueadero eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el parqueadero", error: error.message });
  }
};

// Buscar parqueaderos
export const buscarParqueaderos = async (req, res) => {
  try {
    const { criterio, valor } = req.params;
    const resultados = await ParqueaderoModel.searchParqueaderos(criterio, valor);
    res.json(resultados);
  } catch (error) {
    res.status(400).json({ message: "Error en la búsqueda de parqueaderos", error: error.message });
  }
};
