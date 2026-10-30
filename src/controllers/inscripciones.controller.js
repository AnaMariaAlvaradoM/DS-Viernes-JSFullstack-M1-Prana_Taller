import * as inscripcionesService from "../services/inscripciones.service.js";

export const crearInscripcion = (req, res) => {
  const { claseId, alumnoNombre, alumnoCorreo } = req.body;
  const nueva = inscripcionesService.crear({ claseId, alumnoNombre, alumnoCorreo });
  res.status(201).json(nueva);
};

export const obtenerInscripciones = (req, res) => {
  const lista = inscripcionesService.obtenerTodas();
  res.json(lista);
};

export const obtenerInscripcionPorId = (req, res) => {
  const id = Number(req.params.id);
  const inscripcion = inscripcionesService.obtenerPorId(id);

  if (!inscripcion) {
    return res.status(404).json({
      error: `No existe la inscripción con id ${req.params.id}`,
    });
  }

  res.json(inscripcion);
};

export const cambiarEstadoInscripcion = (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body;
  const actualizada = inscripcionesService.cambiarEstado(id, estado);

  if (!actualizada) {
    return res.status(404).json({
      error: `No existe la inscripción con id ${req.params.id}`,
    });
  }

  res.json(actualizada);
};

export const eliminarInscripcion = (req, res) => {
  const id = Number(req.params.id);
  const eliminada = inscripcionesService.eliminar(id);

  if (!eliminada) {
    return res.status(404).json({
      error: `No existe la inscripción con id ${req.params.id}`,
    });
  }

  res.status(204).end();
};
