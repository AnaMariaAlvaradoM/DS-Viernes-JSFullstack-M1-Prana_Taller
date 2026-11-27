import * as clasesServices from '../services/clases.service.js';

export function listarClases(req, res){
    res.json(clasesServices.listar());
}

export function obtenerClase(req, res){
    const id = Number(req.params.id);
    const clase = clasesServices.buscarPorId(id);
    if(!clase){
        return res.status(404).json({ error: `No existe la clase con id ${id}` });
    }
    res.status(200).json(clase);
}
