const inscripciones = [];
let siguientesId = 1;

export function crear (datos){
    const inscripcion = {
        id: siguientesId,
        claseId: datos.claseId,
        alumnoNombre: datos.alumnoNombre,
        alumnoCorreo: datos.alumnoCorreo,
        estado: 'PENDIENTE'
    };
    siguientesId++;
    inscripciones.push(inscripcion);
    return inscripcion;
}

export function listar(){
    return inscripciones;
}

export function findbyId (id){
    return inscripciones.find((i)=>i.id === id);
}

export function cambiarEstado (id, estado){
    const inscripcion = findbyId(id);
    if (!inscripcion){
        return undefined;
    }
    inscripcion.estado = estado;
    return inscripcion;
}

export function eliminar (id){
    const index = inscripciones.findIndex((i)=>i.id === id);
    if (index === -1){
        return false;
    }
    inscripciones.splice(index, 1);
    return true;
}
