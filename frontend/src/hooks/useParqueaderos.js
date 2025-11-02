import { useState, useEffect } from "react";
import { parqueaderoService } from "../services/parqueaderoService";

export const useParqueaderos = () => {
  const [parqueaderos, setParqueaderos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los parqueaderos
  const loadParqueaderos = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await parqueaderoService.getAll();
      if (result.success) {
        setParqueaderos(result.data);
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      setError(err.message);
      setParqueaderos([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear parqueadero
  const createParqueadero = async (data) => {
    try {
      const result = await parqueaderoService.create(data);
      if (result.success) {
        await loadParqueaderos();
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      throw err;
    }
  };

  // Actualizar parqueadero
  const updateParqueadero = async (id, data) => {
    try {
      const result = await parqueaderoService.update(id, data);
      if (result.success) {
        await loadParqueaderos();
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      throw err;
    }
  };

  // Eliminar parqueadero
  const deleteParqueadero = async (id) => {
    try {
      const result = await parqueaderoService.remove(id);
      if (result.success) {
        await loadParqueaderos();
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      throw err;
    }
  };

  // Buscar parqueaderos
  const searchParqueaderos = async (criteria, value) => {
    if (!criteria || !value.trim()) return await loadParqueaderos();

    setLoading(true);
    setError(null);
    try {
      const result = await parqueaderoService.search(criteria, value);
      setParqueaderos(result.data || result);
      return result.data || result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Estadísticas
  const getStats = () => {
    const total = parqueaderos.length;
    const activos = parqueaderos.filter((p) => p.activo).length;
    const inactivos = total - activos;
    const capacidadTotal = parqueaderos.reduce((acc, p) => acc + (p.capacidad || 0), 0);

    return { total, activos, inactivos, capacidadTotal };
  };

  // Cargar al montar
  useEffect(() => { loadParqueaderos(); }, []);

  return {
    parqueaderos,
    loading,
    error,
    loadParqueaderos,
    createParqueadero,
    updateParqueadero,
    deleteParqueadero,
    searchParqueaderos,
    getStats,
  };
};

export default useParqueaderos;
