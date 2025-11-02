import { Router } from "express";
import { 
  crearControlador, 
  obtenerControladores, 
  actualizarControlador,
  eliminarControlador,
  buscarControladores
} from "../controllers/controllerController.js";

const router = Router();

router.get("/", obtenerControladores);
router.post("/", crearControlador);
router.put("/:id", actualizarControlador);
router.delete("/:id", eliminarControlador);
router.get("/buscar/:criterio/:valor", buscarControladores);

export default router;
