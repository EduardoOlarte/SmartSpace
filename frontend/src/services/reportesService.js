import api from "./api";

export const reportesService = {
  // Obtener ingresos totales de todos los parqueaderos
  async getIngresosTotales() {
    try {
      const res = await api.get("/reportes/ingresos");
      return { success: true, data: res.data.data || [] };
    } catch (error) {
      console.error("Error en getIngresosTotales:", error);
      return { success: false, data: [], message: error.response?.data?.message || "Error al obtener ingresos" };
    }
  },

  // Obtener ingresos de un parqueadero específico
  async getIngresosParqueadero(parqueadero_id) {
    try {
      const res = await api.get(`/reportes/ingresos/${parqueadero_id}`);
      return { success: true, data: res.data.data };
    } catch (error) {
      console.error("Error en getIngresosParqueadero:", error);
      return { success: false, data: null, message: error.response?.data?.message || "Error al obtener ingresos" };
    }
  },

  // Obtener ingresos por período
  async getIngresosPeriodo(parqueadero_id, fecha_inicio, fecha_fin) {
    try {
      const res = await api.get(`/reportes/ingresos-periodo/${parqueadero_id}`, {
        params: { fecha_inicio, fecha_fin }
      });
      return { success: true, data: res.data.data || [] };
    } catch (error) {
      console.error("Error en getIngresosPeriodo:", error);
      return { success: false, data: [], message: error.response?.data?.message || "Error al obtener ingresos" };
    }
  },

  // Obtener ingresos por tipo de vehículo
  async getIngresosPorVehiculo(parqueadero_id) {
    try {
      const res = await api.get(`/reportes/ingresos-vehiculo/${parqueadero_id}`);
      return { success: true, data: res.data.data || [] };
    } catch (error) {
      console.error("Error en getIngresosPorVehiculo:", error);
      return { success: false, data: [], message: error.response?.data?.message || "Error al obtener ingresos" };
    }
  }
};
