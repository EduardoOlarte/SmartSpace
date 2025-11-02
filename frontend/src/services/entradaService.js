import api from "./api";

const mapEntrada = (e) => ({
  ...e,
  parqueadero_nombre: e.parqueadero_nombre || e.parqueadero || "Sin asignar",
  vehiculo_nombre: e.vehiculo_nombre || e.tipo_vehiculo || "Desconocido",
});

export const entradaService = {
  async getEntradas() {
    try {
      const res = await api.get("/entradas");
      return { success: true, data: res.data.map(mapEntrada), message: "Entradas cargadas correctamente" };
    } catch (error) {
      return { success: false, data: [], message: error.response?.data?.message || "Error al obtener entradas" };
    }
  },

  async getEntradaById(id) {
    try {
      const res = await api.get(`/entradas/${id}`);
      return { success: true, data: mapEntrada(res.data), message: "Entrada obtenida correctamente" };
    } catch (error) {
      return { success: false, data: null, message: error.response?.data?.message || "Error al obtener la entrada" };
    }
  },

  async createEntrada(data) {
  try {
    const res = await api.post("/entradas", data);
    return {
      success: true,
      data: mapEntrada(res.data),
      message: "Entrada registrada correctamente",
    };
  } catch (error) {
    // Mejor captura todos los posibles campos de mensaje
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error al crear entrada";
    return { success: false, data: null, message: msg };
  }
}
,

  async updateEntrada(id, data) {
    try {
      const res = await api.put(`/entradas/${id}`, data);
      return { success: true, data: mapEntrada(res.data), message: "Entrada actualizada correctamente" };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al actualizar entrada";
      return { success: false, data: null, message: msg };
    }
  },

  async registrarSalida(id) {
    try {
      const res = await api.put(`/entradas/salida/${id}`);
      return { success: true, data: mapEntrada(res.data), message: "Salida registrada correctamente" };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al registrar salida";
      return { success: false, data: null, message: msg };
    }
  },

  async deleteEntrada(id) {
    try {
      const res = await api.delete(`/entradas/${id}`);
      return { success: true, data: res.data, message: "Entrada eliminada correctamente" };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al eliminar entrada";
      return { success: false, data: null, message: msg };
    }
  },

  async searchEntradas(criteria, value) {
  try {
    if (!criteria || !value.trim()) return this.getEntradas();

    // 🔹 Criterio "nombre" (parqueadero o vehículo) => filtrado local
    if (criteria === "nombre") {
      const allResponse = await this.getEntradas();
      if (!allResponse.success) return { success: false, data: [], message: allResponse.message };

      const term = value.toLowerCase().trim();
      const filtered = allResponse.data.filter(
        (e) =>
          (e.parqueadero_nombre || "").toLowerCase().includes(term) ||
          (e.vehiculo_nombre || "").toLowerCase().includes(term)
      );

      return { success: true, data: filtered, message: `Se encontraron ${filtered.length} entradas` };
    }

    // 🔹 Para otros criterios, usamos backend
    const res = await api.get(`/entradas/buscar/${criteria}/${encodeURIComponent(value)}`);
    return { success: true, data: res.data.map(mapEntrada), message: `Se encontraron ${res.data.length} entradas` };
    
  } catch (error) {
    const msg = error.response?.data?.message || "Error en la búsqueda de entradas";
    return { success: false, data: [], message: msg };
  }
}

};

export default entradaService;
