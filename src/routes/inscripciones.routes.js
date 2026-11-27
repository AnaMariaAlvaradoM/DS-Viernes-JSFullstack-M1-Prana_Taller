import { Router } from 'express';
import { listarInscripciones, crearInscripcion, cambiarEstado, eliminarInscripcion, obtenerInscripcion} from '../controllers/inscripciones.controller.js';

const router = Router();
router.get('/', listarInscripciones);
router.post("/", crearInscripcion);
router.get("/:id", obtenerInscripcion);
router.patch("/:id", cambiarEstado);
router.delete("/:id", eliminarInscripcion);

export default router;