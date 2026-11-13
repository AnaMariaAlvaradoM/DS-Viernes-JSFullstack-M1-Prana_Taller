import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar, PISTA_BASE } from "./servidor.js";
import { encenderIaFalsa, apagarIaFalsa, modoDeLaIa } from "./ia-falsa.js";

let clase = null;
let inscripcion = null;

before(async () => {
  await encenderIaFalsa();
  await encenderServidor();
});
after(async () => {
  if (inscripcion) await pedir(`/api/inscripciones/${inscripcion.id}`, { metodo: "DELETE" }).catch(() => {});
  if (clase) await pedir(`/api/clases/${clase.id}`, { metodo: "DELETE" }).catch(() => {});
  apagarServidor();
  apagarIaFalsa();
});

async function inscripcionDePrueba() {
  if (inscripcion) return inscripcion;
  const c = await pedir("/api/clases", {
    metodo: "POST",
    cuerpo: { nombre: "Yoga en silla", instructora: "Sofía Rincón", horario: "Domingo 10:00 a. m.", cupo: 6 },
  });
  assert.ok(Number.isInteger(c.cuerpo?.id), `Para probar los fallos, primero debe funcionar POST /api/clases (respondió ${c.status}${c.status === 500 ? ": " + PISTA_BASE : ""})`);
  clase = c.cuerpo;
  const i = await pedir("/api/inscripciones", {
    metodo: "POST",
    cuerpo: { claseId: clase.id, alumnoNombre: "Paula Fallo", alumnoCorreo: "paula.fallo@correo.com" },
  });
  assert.ok(Number.isInteger(i.cuerpo?.id), `Para probar los fallos, primero debe funcionar POST /api/inscripciones (respondió ${i.status})`);
  inscripcion = i.cuerpo;
  return inscripcion;
}

async function bienvenidaConIa(modo) {
  const { id } = await inscripcionDePrueba();
  modoDeLaIa(modo);
  const r = await pedir(`/api/ia/inscripciones/${id}/bienvenida`, { metodo: "POST" });
  modoDeLaIa("ok");
  return r;
}

function revisar503(r, situacion) {
  const pista = r.status === 500 ? ": atrapa el error de la IA con try/catch y lánzalo como ErrorHttp(503, ...)" : "";
  assert.equal(r.status, 503, `Si ${situacion}, el endpoint debería responder 503 (respondió ${r.status}${pista}: ${mostrar(r.cuerpo)})`);
  assert.ok(typeof r.cuerpo?.error === "string" && r.cuerpo.error.trim() !== "", `El 503 debería traer { "error": "mensaje claro" } (trae ${mostrar(r.cuerpo)})`);
}

test("si la IA falla (500), el endpoint responde 503 con un error claro", async () => {
  revisar503(await bienvenidaConIa("error"), "la IA falla");
});

test("si OpenAI rechaza la llave (401), el endpoint responde 503", async () => {
  revisar503(await bienvenidaConIa("llave"), "OpenAI rechaza la llave");
});

test("si la IA devuelve un texto vacío, el endpoint responde 503", async () => {
  revisar503(await bienvenidaConIa("vacio"), "la IA devuelve un texto vacío");
});

test("después de los fallos de la IA, el resto de la API sigue funcionando", async () => {
  const fallo = await bienvenidaConIa("error");
  assert.equal(fallo.status, 503, `Primero, el fallo de la IA debería responder 503 (respondió ${fallo.status}: ${mostrar(fallo.cuerpo)})`);
  const salud = await pedir("/api/salud");
  assert.equal(salud.status, 200, `Después de un fallo de la IA, GET /api/salud debería seguir respondiendo 200 (respondió ${salud.status})`);
  const clases = await pedir("/api/clases");
  assert.equal(clases.status, 200, `Después de un fallo de la IA, GET /api/clases debería seguir respondiendo 200 (respondió ${clases.status})`);
});
