import api from "./api";

export const tarifaService = {
  async getTarifas() {
    try {
      const response = await api.get("/tarifas");
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Error al obtener tarifas" 
      };
    }
  },

  async getTarifaById(id) {
    try {
      const response = await api.get(`/tarifas/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Error al obtener tarifa" 
      };
    }
  },

  async createTarifa(data) {
    try {
      const response = await api.post("/tarifas", data);
      return { 
        success: true, 
        data: response.data, 
        message: "Tarifa creada exitosamente" 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Error al crear tarifa" 
      };
    }
  },

  async updateTarifa(id, data) {
    try {
      const response = await api.put(`/tarifas/${id}`, data);
      return { 
        success: true, 
        data: response.data, 
        message: "Tarifa actualizada exitosamente" 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Error al actualizar tarifa" 
      };
    }
  },

  async deleteTarifa(id) {
    try {
      const response = await api.delete(`/tarifas/${id}`);
      return { 
        success: true, 
        data: response.data, 
        message: "Tarifa eliminada exitosamente" 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Error al eliminar tarifa" 
      };
    }
  },

  async searchTarifas(criteria, value) {
    if (!criteria || !value.trim()) return this.getTarifas();

    try {
      const response = await api.get(`/tarifas/buscar/${criteria}/${encodeURIComponent(value)}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Error en la búsqueda" 
      };
    }
  },

  async calcularTarifa(entrada) {
    try {
      const response = await api.post("/tarifas/calcular", entrada);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Error al calcular tarifa" 
      };
    }
  }
};

export default tarifaService;