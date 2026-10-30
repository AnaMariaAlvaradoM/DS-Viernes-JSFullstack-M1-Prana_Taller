import express from "express";
import clasesRoutes from "./routes/clases.routes.js";
import inscripcionesRoutes from "./routes/inscripciones.routes.js";

const app = express();

app.use(express.json());

app.get("/api/salud", (req, res) => {
  res.json({
    estado: "ok",
    servicio: "prana-api",
  });
});

app.use("/api/clases", clasesRoutes);
app.use("/api/inscripciones", inscripcionesRoutes);

export default app;
