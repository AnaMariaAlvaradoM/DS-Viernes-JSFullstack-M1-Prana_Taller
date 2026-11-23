import { Router } from 'express';
import * as inscripcionesController from '../controllers/inscripciones.controller.js';

const router = Router();

router.get('/', inscripcionesController.listar);
router.get('/:id', inscripcionesController.obtener);
router.post('/', inscripcionesController.crear);
router.patch('/:id', inscripcionesController.cambiarEstado);
router.delete('/:id', inscripcionesController.eliminar);

export default router;
