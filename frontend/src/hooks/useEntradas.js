// frontend/src/hooks/useEntradas.js
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
      const result =
        criteria && value
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
  // Crear entrada
  // ==============================
  const createEntrada = async (data) => {
    try {
      const result = await entradaService.createEntrada(data);

      if (result.success) {
        window.alert(` ${result.message}`);
        setEntradas((prev) => [result.data, ...prev]);
        return { success: true, message: result.message };
        
      } else {
        window.alert(` Error: ${result.message}`);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error desconocido";
      window.alert(` Error: ${msg}`);
      return { success: false, message: msg };
    }
    
  };

  // ==============================
  // Actualizar entrada
  // ==============================
  const updateEntrada = async (id, data) => {
    try {
      const result = await entradaService.updateEntrada(id, data);

      window.alert(result.success ? `✅ ${result.message}` : ` ${result.message}`);
loadEntradas();
      if (result.success) {
        setEntradas((prev) => prev.map((e) => (e.id === id ? result.data : e)));
        return { success: true, message: result.message };
        
      }

      return { success: false, message: result.message };
    } catch (err) {
      window.alert(
        ` ${err.response?.data?.message || err.message || "Error desconocido"}`
      );
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Error desconocido",
      };
    }
  };

  // ==============================
  // Registrar salida ( con monto cobrado)
  // ==============================
  const registrarSalida = async (id) => {
    try {
      const result = await entradaService.registrarSalida(id);

      if (result.success) {
        // 🔹 Si el backend devuelve monto, mostrarlo formateado
        if (result.data?.monto_cobrado > 0) {
          const montoFormateado = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          }).format(result.data.monto_cobrado);

          window.alert(`✅ Salida registrada\nMonto a cobrar: ${montoFormateado}`);
          loadEntradas();
        } else {
          window.alert("✅ Salida registrada correctamente");
          loadEntradas();
        }

        // 🔹 Actualiza la lista local con la nueva entrada actualizada
        setEntradas((prev) => prev.map((e) => (e.id === id ? result.data : e)));

        return { success: true, message: result.message };
      }

      // 🔹 Si hubo error, mostrar alerta
      window.alert(` Error al registrar salida: ${result.message}`);
      return { success: false, message: result.message };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error desconocido";
      window.alert(` Error al registrar salida: ${msg}`);
      return { success: false, message: msg };
    }
  };

  // ==============================
  // Eliminar entrada
  // ==============================
  const deleteEntrada = async (id) => {
    const result = await entradaService.deleteEntrada(id);
    if (result.success) {
      setEntradas((prev) => prev.filter((e) => e.id !== id));
      loadEntradas();
      return { success: true, message: result.message };
      
    }
    loadEntradas();
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
    const sinSalida = entradas.filter((e) => !e.hora_salida).length;
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

  // ==============================
  // Retornar API del hook
  // ==============================
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
