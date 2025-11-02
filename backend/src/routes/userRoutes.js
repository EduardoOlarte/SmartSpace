import { Router } from "express";
import { 
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  buscarUsuarios
} from "../controllers/userController.js";

const router = Router();

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);
router.get("/buscar/:criterio/:valor", buscarUsuarios);

export default router;
