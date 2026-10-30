// ============================================================
// Estudio Prana · API · Fase 1
// ============================================================
// Lee el enunciado completo en enunciados/fase-1.md
//
// Servidor de Prana con Express:
//   GET /api/salud       → { "estado": "ok", "servicio": "prana-api" }
//   GET /api/clases      → el catálogo de clases del estudio
//   GET /api/clases/:id  → una clase, o 404 si no existe
//
// El servidor escucha en el puerto 3000.
// ============================================================

import express from "express";

const app = express();
const PUERTO = 3000;

app.use(express.json());

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

app.get("/api/salud", (req, res) => {
  res.json({
    estado: "ok",
    servicio: "prana-api",
  });
});

app.get("/api/clases", (req, res) => {
  res.json(clases);
});

app.get("/api/clases/:id", (req, res) => {
  const idBuscado = Number(req.params.id);
  const claseEncontrada = clases.find((clase) => clase.id === idBuscado);

  if (!claseEncontrada) {
    return res.status(404).json({
      error: `No existe la clase con id ${req.params.id}`,
    });
  }

  res.json(claseEncontrada);
});

app.listen(PUERTO, () => {
  console.log(`Servidor de Estudio Prana escuchando en http://localhost:${PUERTO}`);
});
