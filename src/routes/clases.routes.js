import { Router } from 'express';
import { listarClases, obtenerClase } from '../controllers/clases.controller.js';


const router = Router();
router.get('/', listarClases);
router.get('/:id', obtenerClase);

export default router;