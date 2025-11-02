import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar usuarios
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.getUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const createUser = async (userData) => {
    try {
      const result = await userService.createUser(userData);
      if (result.success) {
        await loadUsers(); // Recargar lista
        return result;
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      throw err;
    }
  };

  // Actualizar usuario
  const updateUser = async (id, userData) => {
    try {
      const result = await userService.updateUser(id, userData);
      if (result.success) {
        await loadUsers(); // Recargar lista
        return result;
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      throw err;
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    try {
      const result = await userService.deleteUser(id);
      if (result.success) {
        await loadUsers(); // Recargar lista
        return result;
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      throw err;
    }
  };

  // Buscar usuarios
  const searchUsers = async (criteria, value) => {
    if (!criteria || !value.trim()) {
      const result = await loadUsers();
      return result?.data || result; // retornamos para poder usar el conteo
    }

    setLoading(true);
    setError(null);
    try {
      const result = await userService.searchUsers(criteria, value);
      if (result.success) {
        setUsers(result.data);      // actualizamos el estado
        return result.data;         // retornamos el array para usarlo en la Page
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas con solo 2 roles
  const getStats = () => ({
    total: users.length,
    administradores: users.filter(u => u.rol === 'administrador').length,
    operadores: users.filter(u => u.rol === 'operador').length,
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    getStats,
  };
};

export default useUsers;
