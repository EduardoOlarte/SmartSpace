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

router.get("/buscar/:criterio/:valor", buscarEntradas);
router.get("/", obtenerEntradas);
router.get("/:id", obtenerEntrada);
router.post("/", crearEntrada);
router.put("/:id", actualizarEntrada);
router.put("/salida/:id", registrarSalida);  
router.delete("/:id", eliminarEntrada);

export default router;