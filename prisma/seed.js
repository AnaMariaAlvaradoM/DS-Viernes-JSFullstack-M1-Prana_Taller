import prisma from '../src/lib/prisma.js';

const CLASES = [
  { nombre: 'Hatha suave', instructora: 'Lucía Ortiz', horario: 'Lunes 7:00 a. m.', cupo: 15 },
  { nombre: 'Vinyasa flow', instructora: 'Camila Rojas', horario: 'Martes 6:30 p. m.', cupo: 12 },
  { nombre: 'Yoga restaurativo', instructora: 'Lucía Ortiz', horario: 'Miércoles 8:00 a. m.', cupo: 10 },
  { nombre: 'Ashtanga', instructora: 'Natalia Gómez', horario: 'Sábado 9:00 a. m.', cupo: 15 },
];

const existentes = await prisma.clase.count();

if (existentes === 0) {
  await prisma.clase.createMany({ data: CLASES });
  console.log(`Se crearon ${CLASES.length} clases`);
} else {
  console.log('El catálogo ya tiene clases: no se crea nada');
}

await prisma.$disconnect();
