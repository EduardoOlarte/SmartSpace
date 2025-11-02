import * as HorarioModel from "../models/horarioModel.js";

// Obtener todos los horarios
export const obtenerHorarios = async (req, res) => {
  try {
    const horarios = await HorarioModel.getAllHorarios();
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los horarios", error: error.message });
  }
};

// Obtener un horario por ID
export const obtenerHorario = async (req, res) => {
  try {
    const horario = await HorarioModel.getHorarioById(req.params.id);
    if (!horario) return res.status(404).json({ message: "Horario no encontrado" });
    res.json(horario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el horario", error: error.message });
  }
};

// Crear horario
export const crearHorario = async (req, res) => {
  try {
    const nuevo = await HorarioModel.createHorario(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el horario", error: error.message });
  }
};

// Actualizar horario
export const actualizarHorario = async (req, res) => {
  try {
    const actualizado = await HorarioModel.updateHorario(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ message: "Horario no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el horario", error: error.message });
  }
};

// Eliminar horario
export const eliminarHorario = async (req, res) => {
  try {
    await HorarioModel.removeHorario(req.params.id);
    res.json({ message: "Horario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el horario", error: error.message });
  }
};

// Buscar horarios
export const buscarHorarios = async (req, res) => {
  try {
    const { criterio, valor } = req.params;
    let searchValue = valor;

    // Normalizar horas (solo HH:mm)
    if (criterio === "hora_inicio" || criterio === "hora_fin") {
      // Si el valor tiene segundos, ignorarlos
      searchValue = valor.slice(0,5);
    }

    const resultados = await HorarioModel.searchHorarios(criterio, searchValue);
    res.json(resultados);
  } catch (error) {
    res.status(400).json({ message: "Error en la búsqueda de horarios", error: error.message });
  }
};

