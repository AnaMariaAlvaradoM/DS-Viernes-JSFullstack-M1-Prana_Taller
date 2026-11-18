import {
  crearInscripcion,
  listarInscripciones,
  buscarInscripcionPorId,
  actualizarEstadoInscripcion,
  eliminarInscripcionPorId,
} from "../services/inscripciones.service.js";

export function registrarInscripcion(req, res) {
  const nueva = crearInscripcion(req.body);
  res.status(201).json(nueva);
}

export function obtenerInscripciones(req, res) {
  const lista = listarInscripciones();
  res.json(lista);
}

export function obtenerInscripcionPorId(req, res) {
  const id = Number(req.params.id);
  const inscripcion = buscarInscripcionPorId(id);

  if (!inscripcion) {
    return res.status(404).json({ error: `No existe la inscripción con id ${id}` });
  }

  res.json(inscripcion);
}

export function cambiarEstadoInscripcion(req, res) {
  const id = Number(req.params.id);
  const actualizada = actualizarEstadoInscripcion(id, req.body.estado);

  if (!actualizada) {
    return res.status(404).json({ error: `No existe la inscripción con id ${id}` });
  }

  res.json(actualizada);
}

export function borrarInscripcion(req, res) {
  const id = Number(req.params.id);
  const eliminada = eliminarInscripcionPorId(id);

  if (!eliminada) {
    return res.status(404).json({ error: `No existe la inscripción con id ${id}` });
  }

  res.status(204).end();
}
