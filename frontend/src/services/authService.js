// src/services/authService.js
import api from "./api"; // tu instancia de axios

export const authService = {
  // Login de usuarios
  async loginUsuario({ nombre, password }) {
    try {
      const response = await api.post("/auth/usuarios", { nombre, password });
      // Extraemos directamente el user de la respuesta
      return { success: true, data: response.data.user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Error al iniciar sesión"
      };
    }
  },

 async loginControlador({ nombre, identificacion }) {
  try {
    const response = await api.post("/auth/controladores", { nombre, identificacion });
    // 🔹 usar response.data.data, que es lo que manda el backend
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Error al iniciar sesión" };
  }
},

  // Logout
  logout() {
    localStorage.removeItem("user");
  },

  // Obtener usuario/controlador actual
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  },
};

export default authService;
