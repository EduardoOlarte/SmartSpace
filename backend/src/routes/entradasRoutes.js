import { Router } from "express";
import { 
  obtenerEntradas,
  obtenerEntrada,
  crearEntrada,
  actualizarEntrada,
  eliminarEntrada,
  buscarEntradas
} from "../controllers/entradaController.js";

const router = Router();

// Ruta para búsqueda (debe ir antes de "/:id")
router.get("/buscar/:criterio/:valor", buscarEntradas);

// Rutas CRUD
router.get("/", obtenerEntradas);         // Listar todas las entradas
router.get("/:id", obtenerEntrada);       // Obtener entrada por ID
router.post("/", crearEntrada);           // Crear nueva entrada
router.put("/:id", actualizarEntrada);    // Actualizar entrada
router.delete("/:id", eliminarEntrada);   // Eliminar entrada

export default router;
