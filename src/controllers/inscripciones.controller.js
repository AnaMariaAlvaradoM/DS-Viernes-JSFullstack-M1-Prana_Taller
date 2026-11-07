import * as inscripcionesService from "../services/inscripciones.service.js";

export function crearInscripcion(req, res) {
  const inscripcion = inscripcionesService.crear(req.body);
  res.status(201).json(inscripcion);
}

export function listarInscripciones(req, res) {
  res.status(200).json(inscripcionesService.listar());
}

export function obtenerInscripciones(req, res) {
  const id = Number(req.params.id);
  const inscripcion = inscripcionesService.findbyId(id);

  if (!inscripcion) {
    return res
      .status(404)
      .json({ error: `No existe la inscripcion con id ${id}` });
  }
  res.status(200).json(inscripcion);
}

export function cambiarEstadoInscripcion(req, res) {
  const id = Number(req.params.id);
  const inscripcion = inscripcionesService.cambiarEstado(id, req.body.estado);

  if (!inscripcion) {
    return res.status(404)
      .json({ error: `No existe la inscripcion con id ${id}` });
  }
  res.status(200).json(inscripcion);
}

export function eliminarInscripcion(req, res){
  const id = Number(req.params.id);
  const inscripcion = inscripcionesService.eliminar(id);

  if (!inscripcion) {
    return res.status(404)
      .json({ error: `No existe la inscripcion con id ${id}` });
  }
  res.status(204).end();
}
