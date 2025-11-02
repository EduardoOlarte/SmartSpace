import api from "./api";

export const controllerService = {
  async getControllers() {
    try {
      const response = await api.get("/controllers");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al obtener controladores" };
    }
  },

  async getControllerById(id) {
    try {
      const response = await api.get(`/controllers/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al obtener controlador" };
    }
  },

  async createController(data) {
    try {
      const response = await api.post("/controllers", data);
      return { success: true, data: response.data, message: "Controlador creado exitosamente" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al crear controlador" };
    }
  },

  async updateController(id, data) {
    try {
      const response = await api.put(`/controllers/${id}`, data);
      return { success: true, data: response.data, message: "Controlador actualizado exitosamente" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al actualizar controlador" };
    }
  },

  async deleteController(id) {
    try {
      const response = await api.delete(`/controllers/${id}`);
      return { success: true, data: response.data, message: "Controlador eliminado exitosamente" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al eliminar controlador" };
    }
  },

  async searchControllers(criteria, value) {
    if (!criteria || !value.trim()) return this.getControllers();

    try {
      const response = await api.get(`/controllers/buscar/${criteria}/${encodeURIComponent(value)}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error en la búsqueda" };
    }
  },
};

export default controllerService;
