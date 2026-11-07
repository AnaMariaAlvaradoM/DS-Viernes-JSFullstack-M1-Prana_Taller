import { Router } from 'express';
import { listarClases } from '../controllers/clases.controller.js';

const router = Router();
router.get('/', listarClases);

export default router;