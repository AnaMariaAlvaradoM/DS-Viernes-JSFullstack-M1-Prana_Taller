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
    {id:1,nombre:"Hatha suave",intructora: "Lucía Ortiz",horario: "Lunes 7:00 a. m.",cupo: 15},
    {id:2,nombre:"Hatha",intructora: "Lucía Ortiz",horario: "Lunes 8:00 a. m.",cupo: 9},
    {id:3,nombre:"Vinyasa",intructora: "Lucía Ortiz",horario: "Lunes 9:00 a. m.",cupo: 10},
    {id:4,nombre:"Hatha suave",intructora: "Lucía Ortiz",horario: "Martes 7:00 a. m.",cupo: 11},
    {id:5,nombre:"Hatha",intructora: "Lucía Ortiz",horario: "Martes 8:00 a. m.",cupo: 13},
    {id:6,nombre:"Vinyasa",intructora: "Lucía Ortiz",horario: "Martes 9:00 a. m.",cupo: 12}
];

app.get('/api/salud', (req, res) => {
    res.json({ "estado": "ok", "servicio": "prana-api" });
});

app.get('/api/clases', (req, res) => {
    res.json(clases);
});

app.get('/api/clases/:id', (req, res) => {
    const id = Number(req.params.id);
    const clase = clases.find((c)=>c.id === id);

    if (!clase){
        return res.status(404).json({"error": "No existe la clase con id:"+id});
    }
    res.json(clase);
});

app.listen(PUERTO);