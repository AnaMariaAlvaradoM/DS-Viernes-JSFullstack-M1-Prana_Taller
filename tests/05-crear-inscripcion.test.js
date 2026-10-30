import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar } from "./servidor.js";

before(encenderServidor);
after(apagarServidor);

const NUEVA = { claseId: 2, alumnoNombre: "Daniela Vargas", alumnoCorreo: "daniela.vargas@correo.com" };

function pista(r) {
  if (r.status === 404) return "¿creaste router.post('/') y lo conectaste con app.use('/api/inscripciones', ...)?";
  if (r.status === 500) return "tu servidor falló al leer el cuerpo: ¿agregaste app.use(express.json()) en app.js, antes de las rutas?";
  return "";
}

test("POST /api/inscripciones responde con código 201", async () => {
  const r = await pedir("/api/inscripciones", { metodo: "POST", cuerpo: NUEVA });
  assert.equal(r.status, 201, `POST /api/inscripciones debería responder 201 (respondió ${r.status}${pista(r) ? ": " + pista(r) : ""})`);
});

test("la inscripción creada llega en JSON con un id numérico", async () => {
  const r = await pedir("/api/inscripciones", { metodo: "POST", cuerpo: NUEVA });
  assert.match(r.tipo, /application\/json/, `POST /api/inscripciones debería responder JSON con res.status(201).json(...) (respondió ${r.status}${pista(r) ? ": " + pista(r) : ""})`);
  assert.ok(Number.isInteger(r.cuerpo?.id), `La inscripción creada debería traer un id numérico (trae ${mostrar(r.cuerpo)})`);
});

test("guarda claseId, alumnoNombre y alumnoCorreo tal como llegaron", async () => {
  const r = await pedir("/api/inscripciones", { metodo: "POST", cuerpo: NUEVA });
  for (const campo of ["claseId", "alumnoNombre", "alumnoCorreo"]) {
    assert.equal(r.cuerpo?.[campo], NUEVA[campo], `La inscripción creada debería traer ${campo}: ${mostrar(NUEVA[campo])} (trae ${mostrar(r.cuerpo)})`);
  }
});

test("toda inscripción nueva empieza en estado PENDIENTE", async () => {
  const r = await pedir("/api/inscripciones", { metodo: "POST", cuerpo: NUEVA });
  assert.equal(r.cuerpo?.estado, "PENDIENTE", `Una inscripción nueva debería traer estado: "PENDIENTE" (trae ${mostrar(r.cuerpo)})`);
});

test("dos inscripciones seguidas reciben ids distintos", async () => {
  const a = await pedir("/api/inscripciones", { metodo: "POST", cuerpo: NUEVA });
  const b = await pedir("/api/inscripciones", { metodo: "POST", cuerpo: { ...NUEVA, alumnoNombre: "Tomás Herrera" } });
  assert.ok(Number.isInteger(a.cuerpo?.id) && Number.isInteger(b.cuerpo?.id), `Cada inscripción debería traer un id numérico (trae ${mostrar(a.cuerpo)} y ${mostrar(b.cuerpo)})`);
  assert.notEqual(a.cuerpo.id, b.cuerpo.id, `Dos inscripciones recibieron el mismo id (${a.cuerpo.id}): ¿aumentas el contador después de crear?`);
});
