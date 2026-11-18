import { Router } from "express";
import {
  registrarInscripcion,
  obtenerInscripciones,
  obtenerInscripcionPorId,
  cambiarEstadoInscripcion,
  borrarInscripcion,
} from "../controllers/inscripciones.controller.js";

const router = Router();

router.post("/", registrarInscripcion);
router.get("/", obtenerInscripciones);
router.get("/:id", obtenerInscripcionPorId);
router.patch("/:id", cambiarEstadoInscripcion);
router.delete("/:id", borrarInscripcion);

export default router;
