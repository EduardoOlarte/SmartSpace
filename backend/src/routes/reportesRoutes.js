import express from "express";
import * as reportesController from "../controllers/reportesController.js";

const router = express.Router();

// Obtener ingresos totales por parqueadero
router.get("/ingresos", reportesController.getIngresosTotales);

// Obtener ingresos por parqueadero específico
router.get("/ingresos/:parqueadero_id", reportesController.getIngresosParqueadero);

// Obtener ingresos por período (fecha inicio - fecha fin)
router.get("/ingresos-periodo/:parqueadero_id", reportesController.getIngresosPeriodo);

// Obtener ingresos por tipo de vehículo
router.get("/ingresos-vehiculo/:parqueadero_id", reportesController.getIngresosPorVehiculo);

export default router;
