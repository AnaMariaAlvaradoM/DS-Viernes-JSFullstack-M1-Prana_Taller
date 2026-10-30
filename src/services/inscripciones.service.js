let inscripciones = [];
let siguienteId = 1;

export const crear = ({ claseId, alumnoNombre, alumnoCorreo }) => {
  const nuevaInscripcion = {
    id: siguienteId++,
    claseId,
    alumnoNombre,
    alumnoCorreo,
    estado: "PENDIENTE",
  };
  inscripciones.push(nuevaInscripcion);
  return nuevaInscripcion;
};

export const obtenerTodas = () => {
  return inscripciones;
};

export const obtenerPorId = (id) => {
  return inscripciones.find((i) => i.id === id);
};

export const cambiarEstado = (id, nuevoEstado) => {
  const inscripcion = inscripciones.find((i) => i.id === id);
  if (!inscripcion) {
    return null;
  }
  inscripcion.estado = nuevoEstado;
  return inscripcion;
};

export const eliminar = (id) => {
  const indice = inscripciones.findIndex((i) => i.id === id);
  if (indice === -1) {
    return false;
  }
  inscripciones.splice(indice, 1);
  return true;
};
