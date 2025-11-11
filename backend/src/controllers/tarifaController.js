import * as TarifaModel from "../models/tarifaModel.js";

// Obtener todas las tarifas
export const obtenerTarifas = async (req, res) => {
  try {
    const tarifas = await TarifaModel.getAllTarifas();
    res.json(tarifas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tarifas", error: error.message });
  }
};

// Obtener tarifa por ID
export const obtenerTarifa = async (req, res) => {
  try {
    const tarifa = await TarifaModel.getTarifaById(req.params.id);
    if (!tarifa) return res.status(404).json({ message: "Tarifa no encontrada" });
    res.json(tarifa);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tarifa", error: error.message });
  }
};

// Crear tarifa
export const crearTarifa = async (req, res) => {
  try {
    const nueva = await TarifaModel.createTarifa(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ message: "Error al crear tarifa", error: error.message });
  }
};

// Actualizar tarifa
export const actualizarTarifa = async (req, res) => {
  try {
    const actualizada = await TarifaModel.updateTarifa(req.params.id, req.body);
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar tarifa", error: error.message });
  }
};

// Eliminar tarifa
export const eliminarTarifa = async (req, res) => {
  try {
    await TarifaModel.removeTarifa(req.params.id);
    res.json({ message: "Tarifa eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar tarifa", error: error.message });
  }
};

// Buscar tarifas
export const buscarTarifas = async (req, res) => {
  try {
    const { criterio, valor } = req.params;
    const resultados = await TarifaModel.searchTarifas(criterio, valor);
    res.json(resultados);
  } catch (error) {
    res.status(400).json({ message: "Error en la búsqueda", error: error.message });
  }
};

// Calcular tarifa para una entrada
export const calcularTarifaEntrada = async (req, res) => {
  try {
    const calculo = await TarifaModel.calcularTarifa(req.body);
    res.json(calculo);
  } catch (error) {
    res.status(400).json({ message: "Error al calcular tarifa", error: error.message });
  }
};