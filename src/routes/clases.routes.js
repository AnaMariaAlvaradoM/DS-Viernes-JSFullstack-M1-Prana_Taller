import { Router } from 'express';
import * as clasesController from '../controllers/clases.controller.js';

const router = Router();

router.get('/', clasesController.listar);
router.get('/:id', clasesController.obtener);
router.post('/', clasesController.crear);
router.put('/:id', clasesController.actualizar);
router.delete('/:id', clasesController.eliminar);

export default router;
