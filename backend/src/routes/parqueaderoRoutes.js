import { Router } from "express";
import { 
  obtenerParqueaderos,
  obtenerParqueadero,
  crearParqueadero,
  actualizarParqueadero,
  eliminarParqueadero,
  buscarParqueaderos  // 🔹 agregar import
} from "../controllers/parqueaderoController.js";

const router = Router();

router.get("/", obtenerParqueaderos);
router.get("/:id", obtenerParqueadero);
router.post("/", crearParqueadero);
router.put("/:id", actualizarParqueadero);
router.delete("/:id", eliminarParqueadero);

// 🔹 ruta para búsqueda
router.get("/buscar/:criterio/:valor", buscarParqueaderos);

export default router;
