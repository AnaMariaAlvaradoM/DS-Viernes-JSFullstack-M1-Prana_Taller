import prisma from '../lib/prisma.js';
import ErrorHttp from '../lib/error-http.js';
import { validarId } from './clases.service.js';

const ESTADOS = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ASISTIO'];

export function listar() {
  return prisma.inscripcion.findMany({ orderBy: { id: 'asc' } });
}

export async function buscarPorId(valorId) {
  const id = validarId(valorId);
  const inscripcion = await prisma.inscripcion.findUnique({ where: { id } });
  if (!inscripcion) throw new ErrorHttp(404, `No existe la inscripción con id ${id}`);
  return inscripcion;
}

export async function crear({ claseId, alumnoNombre, alumnoCorreo } = {}) {
  if (typeof alumnoNombre !== 'string' || alumnoNombre.trim() === '') {
    throw new ErrorHttp(400, 'El campo alumnoNombre es obligatorio');
  }
  if (typeof alumnoCorreo !== 'string' || !alumnoCorreo.includes('@')) {
    throw new ErrorHttp(400, 'El campo alumnoCorreo es obligatorio y debe tener @');
  }
  if (!Number.isInteger(claseId) || claseId <= 0) {
    throw new ErrorHttp(400, 'El campo claseId debe ser un número entero positivo');
  }

  const clase = await prisma.clase.findUnique({ where: { id: claseId } });
  if (!clase) throw new ErrorHttp(404, `No existe la clase con id ${claseId}`);

  const ocupados = await prisma.inscripcion.count({
    where: { claseId, estado: { not: 'CANCELADA' } },
  });
  if (ocupados >= clase.cupo) {
    throw new ErrorHttp(409, `La clase "${clase.nombre}" está llena (cupo ${clase.cupo})`);
  }

  return prisma.inscripcion.create({
    data: { claseId, alumnoNombre, alumnoCorreo, estado: 'PENDIENTE' },
  });
}

export async function cambiarEstado(valorId, estado) {
  if (!ESTADOS.includes(estado)) {
    throw new ErrorHttp(400, `El estado debe ser uno de: ${ESTADOS.join(', ')}`);
  }
  const inscripcion = await buscarPorId(valorId);
  return prisma.inscripcion.update({ where: { id: inscripcion.id }, data: { estado } });
}

export async function eliminar(valorId) {
  const inscripcion = await buscarPorId(valorId);
  await prisma.inscripcion.delete({ where: { id: inscripcion.id } });
}
