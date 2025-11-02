import { useState, useEffect, useCallback } from "react";
import entradaService from "../services/entradaService";

export const useEntradas = (initialSearch = null) => {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==============================
  // Cargar entradas
  // ==============================
  const loadEntradas = useCallback(async (criteria = null, value = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = criteria && value
        ? await entradaService.searchEntradas(criteria, value)
        : await entradaService.getEntradas();

      if (result.success) {
        setEntradas(result.data);
        return result.data;
      } else {
        setEntradas([]);
        setError(result.message);
        return [];
      }
    } catch (err) {
      setEntradas([]);
      setError(err.message || "Error al cargar entradas");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==============================
  // CRUD
  // ==============================
 const createEntrada = async (data) => {
  try {
    const result = await entradaService.createEntrada(data);

    if (result.success) {
      window.alert(`✅ ${result.message}`);
      setEntradas(prev => [result.data, ...prev]);
      return { success: true, message: result.message };
    } else {
      // Aquí mostramos específicamente el mensaje de error que viene del backend
      window.alert(`❌ Error: ${result.message}`);
      return { success: false, message: result.message };
    }

  } catch (err) {
    // Si es un error HTTP de backend
    const msg = err.response?.data?.message || err.message || "Error desconocido";
    window.alert(`❌ Error: ${msg}`);
    return { success: false, message: msg };
  }
};



 const updateEntrada = async (id, data) => {
  try {
    const result = await entradaService.updateEntrada(id, data);

    window.alert(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);

    if (result.success) {
      setEntradas(prev => prev.map(e => e.id === id ? result.data : e));
      return { success: true, message: result.message };
    }

    return { success: false, message: result.message };
  } catch (err) {
    window.alert(`❌ ${err.response?.data?.message || err.message || "Error desconocido"}`);
    return { success: false, message: err.response?.data?.message || err.message || "Error desconocido" };
  }
};


  const registrarSalida = async (id) => {
    const result = await entradaService.registrarSalida(id);
    if (result.success) {
      setEntradas(prev => prev.map(e => e.id === id ? result.data : e));
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  };

  const deleteEntrada = async (id) => {
    const result = await entradaService.deleteEntrada(id);
    if (result.success) {
      setEntradas(prev => prev.filter(e => e.id !== id));
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  };

  // ==============================
  // Búsqueda
  // ==============================
  const searchEntradas = async (criteria, value) => {
    if (!criteria || !value.trim()) return loadEntradas();
    return loadEntradas(criteria, value);
  };

  // ==============================
  // Estadísticas básicas
  // ==============================
  const getStats = () => {
    const total = entradas.length;
    const sinSalida = entradas.filter(e => !e.hora_salida).length;
    return { total, sinSalida, conSalida: total - sinSalida };
  };

  // ==============================
  // Inicializar hook
  // ==============================
  useEffect(() => {
    if (initialSearch?.criteria && initialSearch?.value) {
      loadEntradas(initialSearch.criteria, initialSearch.value);
    } else {
      loadEntradas();
    }
  }, [loadEntradas, initialSearch]);

  return {
    entradas,
    loading,
    error,
    loadEntradas,
    createEntrada,
    updateEntrada,
    registrarSalida,
    deleteEntrada,
    searchEntradas,
    getStats,
  };
};

export default useEntradas;
