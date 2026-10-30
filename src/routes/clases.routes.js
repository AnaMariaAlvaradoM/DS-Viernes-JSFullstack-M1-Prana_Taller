import { Router } from "express";
import { obtenerClases, obtenerClasePorId } from "../controllers/clases.controller.js";

const router = Router();

router.get("/", obtenerClases);
router.get("/:id", obtenerClasePorId);

export default router;
