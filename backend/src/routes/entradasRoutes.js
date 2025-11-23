import { Router } from "express";
import { 
  obtenerEntradas,
  obtenerEntrada,
  crearEntrada,
  actualizarEntrada,
  eliminarEntrada,
  buscarEntradas,
  registrarSalida  
} from "../controllers/entradaController.js";

const router = Router();

// 🔹 IMPORTANTE: Rutas específicas ANTES de rutas genéricas
router.put("/salida/:id", registrarSalida);  // Específica - procesar primero
router.get("/buscar/:criterio/:valor", buscarEntradas);

// Rutas genéricas al final
router.get("/", obtenerEntradas);
router.get("/:id", obtenerEntrada);
router.post("/", crearEntrada);
router.put("/:id", actualizarEntrada);
router.delete("/:id", eliminarEntrada);

export default router;