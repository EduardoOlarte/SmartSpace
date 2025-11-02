import * as EntradaModel from "../models/entradasModel.js";

// Obtener todas las entradas
export const obtenerEntradas = async (req, res) => {
  try {
    const entradas = await EntradaModel.getAllEntradas();
    res.json(entradas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las entradas", error: error.message });
  }
};

// Obtener una entrada por ID
export const obtenerEntrada = async (req, res) => {
  try {
    const entrada = await EntradaModel.getEntradaById(req.params.id);
    if (!entrada) return res.status(404).json({ message: "Entrada no encontrada" });
    res.json(entrada);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la entrada", error: error.message });
  }
};

// Crear nueva entrada
export const crearEntrada = async (req, res) => {
  try {
    const nuevo = await EntradaModel.createEntrada(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    // Captura errores de validación de duplicidad o capacidad
    if (/duplicidad|capacidad/i.test(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al crear la entrada", error: error.message });
  }
};

// Actualizar entrada
export const actualizarEntrada = async (req, res) => {
  try {
    const actualizado = await EntradaModel.updateEntrada(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ message: "Entrada no encontrada" });
    res.json(actualizado);
  } catch (error) {
    // Captura errores de validación de duplicidad o capacidad
    if (/duplicidad|capacidad/i.test(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al actualizar la entrada", error: error.message });
  }
};

// Eliminar entrada
export const eliminarEntrada = async (req, res) => {
  try {
    await EntradaModel.removeEntrada(req.params.id);
    res.json({ message: "Entrada eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la entrada", error: error.message });
  }
};

// Buscar entradas
export const buscarEntradas = async (req, res) => {
  try {
    const { criterio, valor } = req.params;
    const resultados = await EntradaModel.searchEntradas(criterio, valor);
    res.json(resultados);
  } catch (error) {
    res.status(400).json({ message: "Error en la búsqueda de entradas", error: error.message });
  }
};
