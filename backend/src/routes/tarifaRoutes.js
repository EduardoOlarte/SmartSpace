import { Router } from "express";
import {
  obtenerTarifas,
  obtenerTarifa,
  crearTarifa,
  actualizarTarifa,
  eliminarTarifa,
  buscarTarifas,
  calcularTarifaEntrada
} from "../controllers/tarifaController.js";

const router = Router();

// Rutas específicas primero
router.get("/buscar/:criterio/:valor", buscarTarifas);
router.post("/calcular", calcularTarifaEntrada);

// Rutas generales
router.get("/", obtenerTarifas);
router.get("/:id", obtenerTarifa);
router.post("/", crearTarifa);
router.put("/:id", actualizarTarifa);
router.delete("/:id", eliminarTarifa);

export default router;