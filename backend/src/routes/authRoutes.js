// backend/src/routes/authRoutes.js
import { Router } from "express";
import { loginUser, loginController } from "../controllers/authController.js";

const router = Router();

// Login de usuarios (nombre/email + contraseña)
router.post("/usuarios", loginUser);

// Login de controladores (nombre + identificacion)
router.post("/controladores", loginController);

export default router;
