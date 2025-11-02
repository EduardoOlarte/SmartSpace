// src/services/horarioService.js
import api from "./api";

export const horarioService = {
  async getHorarios() {
    try {
      const response = await api.get("/horarios");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al obtener los horarios",
      };
    }
  },

  async getHorarioById(id) {
    try {
      const response = await api.get(`/horarios/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al obtener el horario",
      };
    }
  },

  async createHorario(horarioData) {
    try {
      const response = await api.post("/horarios", horarioData);
      return {
        success: true,
        data: response.data,
        message: "Horario creado exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al crear el horario",
      };
    }
  },

  async updateHorario(id, horarioData) {
    try {
      const response = await api.put(`/horarios/${id}`, horarioData);
      return {
        success: true,
        data: response.data,
        message: "Horario actualizado exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al actualizar el horario",
      };
    }
  },

  async deleteHorario(id) {
    try {
      const response = await api.delete(`/horarios/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Horario eliminado exitosamente",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al eliminar el horario",
      };
    }
  },

  async searchHorarios(criteria, value) {
  try {
    // 🔹 Si se busca por nombre, filtramos localmente
    if (criteria === "nombre") {
      const allResponse = await this.getHorarios();
      if (!allResponse.success) return { success: false, data: [], message: allResponse.message };
      
      const term = value.toLowerCase().trim();
      const filtered = allResponse.data.filter(
        (h) =>
          (h.parqueadero_nombre || h.asignadoa || "").toLowerCase().includes(term)
      );
      return { success: true, data: filtered };
    }

    // 🔹 Para los demás criterios, usamos backend
    const response = await api.get(
      `/horarios/buscar/${criteria}/${encodeURIComponent(value)}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Error en la búsqueda de horarios",
    };
  }
}

};

export default horarioService;
