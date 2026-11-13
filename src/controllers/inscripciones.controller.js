import * as inscripcionesService from '../services/inscripciones.service.js';

export async function listar(req, res) {
  res.json(await inscripcionesService.listar());
}

export async function obtener(req, res) {
  res.json(await inscripcionesService.buscarPorId(req.params.id));
}

export async function crear(req, res) {
  res.status(201).json(await inscripcionesService.crear(req.body));
}

export async function cambiarEstado(req, res) {
  res.json(await inscripcionesService.cambiarEstado(req.params.id, req.body?.estado));
}

export async function eliminar(req, res) {
  await inscripcionesService.eliminar(req.params.id);
  res.status(204).end();
}
