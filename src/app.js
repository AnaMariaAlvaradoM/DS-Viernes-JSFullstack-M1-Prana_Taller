import express from "express";
import clasesRouter from "./routes/clases.routes.js";
import inscripcionesRouter from "./routes/inscripciones.routes.js";

const app = express();

app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({ estado: "ok", servicio: "prana-api" });
});

app.use("/api/clases", clasesRouter);
app.use("/api/inscripciones", inscripcionesRouter);

export default app;
