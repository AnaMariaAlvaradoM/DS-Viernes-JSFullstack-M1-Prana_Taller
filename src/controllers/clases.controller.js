import * as clasesService from '../services/clases.service.js';

export async function listar(req, res) {
  res.json(await clasesService.listar());
}

export async function obtener(req, res) {
  res.json(await clasesService.buscarPorId(req.params.id));
}

export async function crear(req, res) {
  res.status(201).json(await clasesService.crear(req.body));
}

export async function actualizar(req, res) {
  res.json(await clasesService.actualizar(req.params.id, req.body));
}

export async function eliminar(req, res) {
  await clasesService.eliminar(req.params.id);
  res.status(204).end();
}
