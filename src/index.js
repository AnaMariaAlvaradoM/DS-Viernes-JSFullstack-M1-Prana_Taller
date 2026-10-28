// ============================================================
// Estudio Prana · API · Fase 1
// ============================================================
// Lee el enunciado completo en enunciados/fase-1.md
//
// Aquí construyes el servidor de Prana con Express:
//   GET /api/salud       → { "estado": "ok", "servicio": "prana-api" }
//   GET /api/clases      → el catálogo de clases del estudio
//   GET /api/clases/:id  → una clase, o 404 si no existe
//
// No cambies el puerto: los tests buscan tu servidor en el 3000.
// ============================================================

// Tu código aquí

import express from 'express';

const app = express();

const PUERTO = 3000;

const clases = [
    {id: 1, nombre: 'Hatha suave', instructora: "Lucía Ortiz", horario: "Lunes 7:00 a.m.", cupo: 15},
    {id: 2, nombre: 'Vinyasa Yoga', instructora: "Paola Sanchez", horario: "Lunes 7:00 a.m.", cupo: 14},
    {id: 3, nombre: 'Power Yoga', instructora: "Daviana Herrera", horario: "Lunes 7:00 a.m.", cupo: 13},
    {id: 4, nombre: 'Yoga restaurativo', instructora: "Adriana Martinez", horario: "Lunes 7:00 a.m.", cupo: 12}
];

app.get('/api/salud', (req, res) => {
    res.json({"estado": "ok", "servicio": "prana-api" })
});

app.get('/api/clases', (req, res) => {
    res.json(clases);
});

app.get('/api/clases/:id', (req, res) => {
    const id = Number(req.params.id);
    const clase = clases.find((s) => s.id === id);

    if(!clase){
        return res.status(404).json({ error: `No existe la clase con id ${id}` });
    }

        res.json(clase);
});

app.listen(PUERTO, () => {
  console.log(`Agendia API escuchando en http://localhost:${PUERTO}`);
});



