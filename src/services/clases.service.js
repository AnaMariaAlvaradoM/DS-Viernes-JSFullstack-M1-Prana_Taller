const clases = [
  {
    id: 1,
    nombre: "Hatha Suave",
    instructora: "Lucía Ortiz",
    horario: "Lunes 7:00 a. m.",
    cupo: 15,
  },
  {
    id: 2,
    nombre: "Vinyasa Flow",
    instructora: "Camila Restrepo",
    horario: "Martes 6:30 p. m.",
    cupo: 12,
  },
  {
    id: 3,
    nombre: "Ashtanga Yoga",
    instructora: "Mateo Gómez",
    horario: "Miércoles 8:00 a. m.",
    cupo: 10,
  },
  {
    id: 4,
    nombre: "Yin Yoga & Meditación",
    instructora: "Lucía Ortiz",
    horario: "Jueves 7:00 p. m.",
    cupo: 14,
  },
  {
    id: 5,
    nombre: "Yoga Restaurativo",
    instructora: "Sofía Morales",
    horario: "Sábado 9:00 a. m.",
    cupo: 15,
  },
];

export const obtenerTodas = () => {
  return clases;
};

export const obtenerPorId = (id) => {
  return clases.find((c) => c.id === id);
};
