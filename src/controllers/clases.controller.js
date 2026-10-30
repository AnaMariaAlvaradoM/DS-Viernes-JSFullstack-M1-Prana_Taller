import * as clasesService from "../services/clases.service.js";

export const obtenerClases = (req, res) => {
  const clases = clasesService.obtenerTodas();
  res.json(clases);
};

export const obtenerClasePorId = (req, res) => {
  const id = Number(req.params.id);
  const clase = clasesService.obtenerPorId(id);

  if (!clase) {
    return res.status(404).json({
      error: `No existe la clase con id ${req.params.id}`,
    });
  }

  res.json(clase);
};
