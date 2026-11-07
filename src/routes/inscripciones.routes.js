import { Router } from 'express';
import { crearInscripcion, listarInscripciones, obtenerInscripciones, cambiarEstadoInscripcion, eliminarInscripcion } from '../controllers/inscripciones.controller.js';


const router = Router();

router.post('/', crearInscripcion);
router.get('/', listarInscripciones);
router.get('/:id', obtenerInscripciones);
router.patch('/:id', cambiarEstadoInscripcion);
router.delete('/:id', eliminarInscripcion);

export default router;