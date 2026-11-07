import * as inscripcionesServices from '../services/inscripciones.service.js';

export function listarInscripciones(req, res){
    res.json(inscripcionesServices.listar());
}

export function crearInscripcion(req, res){
    const inscripcion = inscripcionesServices.crear(req.body);
    res.status(201).json(inscripcion);
}

export function obtenerInscripcion(req, res){
    const id = Number(req.params.id);
    const inscripcion = inscripcionesServices.buscarPorId(id);
    if(!inscripcion){
        return res.status(404).json({ error: `No existe la inscripción con id ${id}` });
    }
    res.status(200).json(inscripcion);
}

export function cambiarEstado(req, res){
    const id = Number(req.params.id);
    const inscripcion = inscripcionesServices.cambiarEstado(id, req.body.estado);
    if(!inscripcion){
        return res.status(404).json({ error: `No existe la inscripción con id ${id}` });
    }
    res.json(inscripcion);
}


export function eliminarInscripcion(req, res){
    const id = Number(req.params.id);
    const inscripcion = inscripcionesServices.eliminar(id);
    if(!inscripcion){
        return res.status(404).json({ error: `No existe la inscripción con id ${id}` });
    }
    res.status(204).end();
}

