import * as clasesServices from '../services/clases.service.js';

export function listarClases(req, res){
    res.json(clasesServices.listar());
}
