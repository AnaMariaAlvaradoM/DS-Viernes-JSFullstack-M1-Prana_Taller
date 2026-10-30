import { Router } from "express";
import {
  crearInscripcion,
  obtenerInscripciones,
  obtenerInscripcionPorId,
  cambiarEstadoInscripcion,
  eliminarInscripcion,
} from "../controllers/inscripciones.controller.js";

const router = Router();

router.post("/", crearInscripcion);
router.get("/", obtenerInscripciones);
router.get("/:id", obtenerInscripcionPorId);
router.patch("/:id", cambiarEstadoInscripcion);
router.delete("/:id", eliminarInscripcion);

export default router;
