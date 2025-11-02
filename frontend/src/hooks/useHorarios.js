// src/hooks/useHorarios.js
import { useState, useEffect } from "react";
import horarioService from "../services/horarioService";

export const useHorarios = (initialSearch = null) => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==============================
  // Cargar horarios
  // ==============================
  const loadHorarios = async (criteria = null, value = null) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (criteria && value) {
        response = await horarioService.searchHorarios(criteria, value);
      } else {
        response = await horarioService.getHorarios();
      }

      if (response.success) {
        const data = response.data.map((h) => ({
          ...h,
          parqueadero_nombre: h.parqueadero_nombre || h.parqueadero || "Sin asignar",
        }));
        setHorarios(data);
        return data;
      } else {
        setError(response.message || "Error al cargar horarios");
        return [];
      }
    } catch (err) {
      setError("Error al cargar horarios");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // CRUD
  // ==============================
  const createHorario = async (horarioData) => {
    try {
      const result = await horarioService.createHorario(horarioData);
      if (result.success) {
        await loadHorarios(); // recarga la lista después de crear
        return { success: true, message: result.message || "Horario creado correctamente" };
      } else {
        return { success: false, message: result.message || "No se pudo crear el horario" };
      }
    } catch (err) {
      console.error("Error creando horario:", err);
      return { success: false, message: err.message || "Error desconocido al crear horario" };
    }
  };

  const updateHorario = async (id, horarioData) => {
    try {
      const result = await horarioService.updateHorario(id, horarioData);
      if (result.success) {
        await loadHorarios();
        return { success: true, message: result.message || "Horario actualizado correctamente" };
      } else {
        return { success: false, message: result.message || "No se pudo actualizar el horario" };
      }
    } catch (err) {
      console.error("Error actualizando horario:", err);
      return { success: false, message: err.message || "Error desconocido al actualizar horario" };
    }
  };

  const deleteHorario = async (id) => {
    try {
      const result = await horarioService.deleteHorario(id);
      if (result.success) {
        await loadHorarios();
        return { success: true, message: result.message || "Horario eliminado correctamente" };
      } else {
        return { success: false, message: result.message || "No se pudo eliminar el horario" };
      }
    } catch (err) {
      console.error("Error eliminando horario:", err);
      return { success: false, message: err.message || "Error desconocido al eliminar horario" };
    }
  };

  // ==============================
  // Búsqueda
  // ==============================
  const searchHorarios = async (criteria, value) => {
    try {
      const response = await horarioService.searchHorarios(criteria, value);
      if (response.success) {
        const data = response.data.map((h) => ({
          ...h,
          parqueadero_nombre: h.parqueadero_nombre || h.parqueadero || "Sin asignar",
        }));
        setHorarios(data);
        return data;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError("Error en la búsqueda de horarios");
      return [];
    }
  };

  const filterByParqueadero = async (parqueaderoNombre) => {
    if (!parqueaderoNombre) return loadHorarios();
    return loadHorarios("nombre", parqueaderoNombre);
  };

  // ==============================
  // Estadísticas
  // ==============================
  const getStats = () => {
    const diasUnicos = new Set(horarios.map((h) => h.dia || h.dia_semana)).size;
    return {
      total: horarios.length,
      diasUnicos,
    };
  };

  // ==============================
  // Inicializar hook
  // ==============================
  useEffect(() => {
    if (initialSearch?.criteria && initialSearch?.value) {
      loadHorarios(initialSearch.criteria, initialSearch.value);
    } else {
      loadHorarios();
    }
  }, []);

  return {
    horarios,
    loading,
    error,
    loadHorarios,
    createHorario,
    updateHorario,
    deleteHorario,
    searchHorarios,
    filterByParqueadero,
    getStats,
  };
};
