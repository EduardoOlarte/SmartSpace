import { useState, useEffect } from "react";
import { tarifaService } from "../services/tarifaService";

export const useTarifas = () => {
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTarifas = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await tarifaService.getTarifas();
      if (result.success) {
        setTarifas(result.data);
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      setError(err.message);
      setTarifas([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTarifa = async (data) => {
    try {
      const result = await tarifaService.createTarifa(data);
      if (result.success) {
        await loadTarifas();
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      throw err;
    }
  };

  const updateTarifa = async (id, data) => {
    try {
      const result = await tarifaService.updateTarifa(id, data);
      if (result.success) {
        await loadTarifas();
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      throw err;
    }
  };

  const deleteTarifa = async (id) => {
    try {
      const result = await tarifaService.deleteTarifa(id);
      if (result.success) {
        await loadTarifas();
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      throw err;
    }
  };

  const searchTarifas = async (criteria, value) => {
    if (!criteria || !value.trim()) return await loadTarifas();

    setLoading(true);
    setError(null);
    try {
      const result = await tarifaService.searchTarifas(criteria, value);
      setTarifas(result.data || result);
      return result.data || result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = tarifas.length;
    const activas = tarifas.filter((t) => t.activo).length;
    const porHora = tarifas.filter((t) => t.tipo_calculo === "por_hora").length;
    const porDia = tarifas.filter((t) => t.tipo_calculo === "por_dia").length;

    return { total, activas, porHora, porDia };
  };

  useEffect(() => {
    loadTarifas();
  }, []);

  return {
    tarifas,
    loading,
    error,
    loadTarifas,
    createTarifa,
    updateTarifa,
    deleteTarifa,
    searchTarifas,
    getStats,
  };
};

export default useTarifas;