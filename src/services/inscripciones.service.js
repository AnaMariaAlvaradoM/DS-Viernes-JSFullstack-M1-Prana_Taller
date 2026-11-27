const inscripciones = [];
let siguienteId = 1;

export function crear(datos) {
    const inscripcion = {
        id: siguienteId,
        claseId: datos.claseId,
        alumnoNombre: datos.alumnoNombre,
        alumnoCorreo: datos.alumnoCorreo,
        estado: 'PENDIENTE',
    };
    siguienteId++;
    inscripciones.push(inscripcion);
    return inscripcion;
}

export function listar(){
    return inscripciones;
}

export function buscarPorId(id){
    return inscripciones.find((c) => c.id === id);

}


export function cambiarEstado(id, estado){
    const inscripcion = buscarPorId(id);
    if(!inscripcion){
        return undefined;
    }
    inscripcion.estado = estado;
    return inscripcion;
}

export function eliminar(id){
    const posicion = inscripciones.findIndex((c) => c.id === id);

    if(posicion === -1){
        return false;
    }

    inscripciones.splice(posicion, 1)
    return true;
    
}