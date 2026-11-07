import * as clasesService from '../services/clases.service.js';

export function listarClases(req, res) {
    res.json(clasesService.listar());
}

export function obtenerClase(req, res) {
    const id = Number(req.params.id);
    const clase = clasesService.findbyId(id);

    if (!clase){
        return res.status(404).json({error: `No existe la clase con id: ${id}`});
    }
    res.json(clase);
}
