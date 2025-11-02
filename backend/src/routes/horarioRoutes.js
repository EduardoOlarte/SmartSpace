import { Router } from "express";
import { 
  crearHorario, 
  obtenerHorarios, 
  actualizarHorario,
  eliminarHorario,
  buscarHorarios
} from "../controllers/horarioController.js";

const router = Router();

// 🔹 Primero las rutas específicas
router.get("/buscar/:criterio/:valor", buscarHorarios);

// 🔹 Luego las rutas generales
router.get("/", obtenerHorarios);
router.post("/", crearHorario);
router.put("/:id", actualizarHorario);
router.delete("/:id", eliminarHorario);

export default router;
