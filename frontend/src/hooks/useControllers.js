import { useState, useEffect } from "react";
import { controllerService } from "../services/controllerService";

export const useControllers = () => {
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar controladores
  const loadControllers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await controllerService.getControllers();
      if (result.success) {
        setControllers(result.data);
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      setControllers([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Crear controlador
  const createController = async (data) => {
    try {
      const result = await controllerService.createController(data);
      if (result.success) {
        await loadControllers();
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      throw err;
    }
  };

  // Actualizar controlador
  const updateController = async (id, data) => {
    try {
      const result = await controllerService.updateController(id, data);
      if (result.success) {
        await loadControllers();
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      throw err;
    }
  };

  // Eliminar controlador
  const deleteController = async (id) => {
    try {
      const result = await controllerService.deleteController(id);
      if (result.success) {
        await loadControllers();
        return result;
      } else throw new Error(result.message);
    } catch (err) {
      throw err;
    }
  };

  // Buscar controladores
  const searchControllers = async (criteria, value) => {
    if (!criteria || !value.trim()) return await loadControllers();

    setLoading(true);
    setError(null);
    try {
      const result = await controllerService.searchControllers(criteria, value);
      // Actualizamos el estado con los resultados de búsqueda
      setControllers(result.data || result); 
      return result.data || result;  // retornamos el array para poder usar el conteo en la Page
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Estadísticas
  const getStats = () => ({
    total: controllers.length,
    supervisores: controllers.filter(c => c.rol === "supervisor").length,
    operadores: controllers.filter(c => c.rol === "operador").length,
    activos: controllers.filter(c => c.activo).length,
  });

  // Cargar al montar
  useEffect(() => { loadControllers(); }, []);

  return {
    controllers,
    loading,
    error,
    loadControllers,
    createController,
    updateController,
    deleteController,
    searchControllers,
    getStats,
  };
};

export default useControllers;
