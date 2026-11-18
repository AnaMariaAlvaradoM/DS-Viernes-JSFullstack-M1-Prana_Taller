import { listarClases, buscarClasePorId } from "../services/clases.service.js";

export function obtenerClases(req, res) {
  const clases = listarClases();
  res.json(clases);
}

export function obtenerClasePorId(req, res) {
  const id = Number(req.params.id);
  const clase = buscarClasePorId(id);

  if (!clase) {
    return res.status(404).json({ error: `No existe la clase con id ${id}` });
  }

  res.json(clase);
}
