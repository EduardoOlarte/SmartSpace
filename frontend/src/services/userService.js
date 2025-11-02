import api from "./api";

export const userService = {
  async getUsers() {
    try {
      const response = await api.get("/users");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al obtener usuarios" };
    }
  },

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al obtener usuario" };
    }
  },

  async createUser(userData) {
    try {
      const response = await api.post("/users", userData);
      return { success: true, data: response.data, message: "Usuario creado exitosamente" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al crear usuario" };
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return { success: true, data: response.data, message: "Usuario actualizado exitosamente" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al actualizar usuario" };
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return { success: true, data: response.data, message: "Usuario eliminado exitosamente" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al eliminar usuario" };
    }
  },

  async searchUsers(criteria, value) {
    try {
      const response = await api.get(`/users/buscar/${criteria}/${encodeURIComponent(value)}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error en la búsqueda" };
    }
  },
};

export default userService;
