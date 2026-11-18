const clases = [
  { id: 1, nombre: "Hatha suave", instructora: "Lucía Ortiz", horario: "Lunes 7:00 a. m.", cupo: 15 },
  { id: 2, nombre: "Vinyasa flow", instructora: "Camila Restrepo", horario: "Martes 6:30 p. m.", cupo: 12 },
  { id: 3, nombre: "Yin restaurativo", instructora: "Valentina Gómez", horario: "Miércoles 8:00 a. m.", cupo: 10 },
  { id: 4, nombre: "Ashtanga introductorio", instructora: "Mariana Díaz", horario: "Jueves 7:00 p. m.", cupo: 14 },
];

export function listarClases() {
  return clases;
}

export function buscarClasePorId(id) {
  return clases.find((c) => c.id === id);
}
