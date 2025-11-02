import api from "./api";

export const parqueaderoService = {
  async getAll() {
    try {
      const response = await api.get("/parqueaderos");
      return { success: true, data: response.data }; // debe ser un array
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al obtener parqueaderos" };
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/parqueaderos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al obtener parqueadero" };
    }
  },

  async create(data) {
    try {
      const response = await api.post("/parqueaderos", data);
      return { success: true, data: response.data, message: "Parqueadero creado exitosamente" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al crear parqueadero" };
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/parqueaderos/${id}`, data);
      return { success: true, data: response.data, message: "Parqueadero actualizado exitosamente" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al actualizar parqueadero" };
    }
  },

  async remove(id) {
    try {
      const response = await api.delete(`/parqueaderos/${id}`);
      return { success: true, data: response.data, message: "Parqueadero eliminado exitosamente" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al eliminar parqueadero" };
    }
  },

  async search(criteria, value) {
    if (!criteria || !value.trim()) return this.getAll();
    try {
      const response = await api.get(`/parqueaderos/buscar/${criteria}/${encodeURIComponent(value)}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error en la búsqueda" };
    }
  },
};

export default parqueaderoService;
