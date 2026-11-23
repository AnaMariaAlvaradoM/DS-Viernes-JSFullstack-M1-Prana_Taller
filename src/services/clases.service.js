import prisma from '../lib/prisma.js';
import ErrorHttp from '../lib/error-http.js';

export function validarId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorHttp(400, `El id "${valor}" no es un número entero positivo`);
  }
  return id;
}

function validarClase({ nombre, instructora, horario, cupo } = {}) {
  for (const [campo, valor] of Object.entries({ nombre, instructora, horario })) {
    if (typeof valor !== 'string' || valor.trim() === '') {
      throw new ErrorHttp(400, `El campo ${campo} es obligatorio`);
    }
  }
  if (!Number.isInteger(cupo) || cupo < 1 || cupo > 15) {
    throw new ErrorHttp(400, 'El cupo debe ser un número entero entre 1 y 15');
  }
  return { nombre, instructora, horario, cupo };
}

export function listar() {
  return prisma.clase.findMany({ orderBy: { id: 'asc' } });
}

export async function buscarPorId(valorId) {
  const id = validarId(valorId);
  const clase = await prisma.clase.findUnique({ where: { id } });
  if (!clase) throw new ErrorHttp(404, `No existe la clase con id ${id}`);
  return clase;
}

export function crear(datos) {
  return prisma.clase.create({ data: validarClase(datos) });
}

export async function actualizar(valorId, datos) {
  const clase = await buscarPorId(valorId);
  return prisma.clase.update({ where: { id: clase.id }, data: validarClase(datos) });
}

export async function eliminar(valorId) {
  const clase = await buscarPorId(valorId);
  const inscritas = await prisma.inscripcion.count({ where: { claseId: clase.id } });
  if (inscritas > 0) {
    throw new ErrorHttp(409, `La clase con id ${clase.id} tiene inscripciones y no se puede eliminar`);
  }
  await prisma.clase.delete({ where: { id: clase.id } });
}
