// backend/src/controllers/authController.js
import { getUserByNombre } from "../models/userModel.js";
import * as ControllerModel from "../models/controllerModel.js";

// 🔹 Login de usuarios (admin u operador)
export const loginUser = async (req, res) => {
  try {
    const { nombre, password } = req.body;
    if (!nombre || !password)
      return res.status(400).json({ success: false, message: "Nombre y contraseña son requeridos" });

    const user = await getUserByNombre(nombre);
    if (!user) return res.status(401).json({ success: false, message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: "Contraseña incorrecta" });

    res.json({
      success: true,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Login de controladores (acceso directo a Entradas)
export const loginController = async (req, res) => {
  try {
    const { nombre, identificacion } = req.body;
    if (!nombre || !identificacion)
      return res.status(400).json({ success: false, message: "Nombre e identificación son requeridos" });

    const controllers = await ControllerModel.getAllControllers();
    const controller = controllers.find(
      (c) => c.nombre === nombre && c.identificacion === identificacion
    );

    if (!controller)
      return res
        .status(401)
        .json({ success: false, message: "Controlador no encontrado o identificación incorrecta" });

    // Solo devolvemos lo necesario
    res.json({ success: true, data: { id: controller.id, nombre: controller.nombre } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
