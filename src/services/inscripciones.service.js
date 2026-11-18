const inscripciones = [];
let siguienteId = 1;

export function crearInscripcion({ claseId, alumnoNombre, alumnoCorreo }) {
  const nueva = {
    id: siguienteId++,
    claseId,
    alumnoNombre,
    alumnoCorreo,
    estado: "PENDIENTE",
  };
  inscripciones.push(nueva);
  return nueva;
}

export function listarInscripciones() {
  return inscripciones;
}

export function buscarInscripcionPorId(id) {
  return inscripciones.find((i) => i.id === id);
}

export function actualizarEstadoInscripcion(id, nuevoEstado) {
  const inscripcion = inscripciones.find((i) => i.id === id);
  if (!inscripcion) {
    return null;
  }
  inscripcion.estado = nuevoEstado;
  return inscripcion;
}

export function eliminarInscripcionPorId(id) {
  const indice = inscripciones.findIndex((i) => i.id === id);
  if (indice === -1) {
    return false;
  }
  inscripciones.splice(indice, 1);
  return true;
}
