import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar } from "./servidor.js";

before(encenderServidor);
after(apagarServidor);

const ID_INEXISTENTE = 99999;

async function crear(alumnoNombre) {
  const r = await pedir("/api/inscripciones", {
    metodo: "POST",
    cuerpo: { claseId: 1, alumnoNombre, alumnoCorreo: "alumno@correo.com" },
  });
  assert.ok(Number.isInteger(r.cuerpo?.id), "Para probar las consultas, primero debe funcionar POST /api/inscripciones (ejercicio 05)");
  return r.cuerpo;
}

test("GET /api/inscripciones responde 200 con un arreglo", async () => {
  const r = await pedir("/api/inscripciones");
  assert.equal(r.status, 200, `GET /api/inscripciones debería responder 200 (respondió ${r.status}: ¿creaste router.get('/')?)`);
  assert.ok(Array.isArray(r.cuerpo), `GET /api/inscripciones debería responder un arreglo (respondió ${mostrar(r.cuerpo)})`);
});

test("la lista incluye la inscripción recién creada", async () => {
  const creada = await crear("Valeria Mora");
  const r = await pedir("/api/inscripciones");
  const encontrada = Array.isArray(r.cuerpo) && r.cuerpo.some((i) => i?.id === creada.id);
  assert.ok(encontrada, `GET /api/inscripciones debería incluir la inscripción con id ${creada.id} (respondió ${mostrar(r.cuerpo)}: ¿guardas con push en el arreglo del service?)`);
});

test("GET /api/inscripciones/:id responde la inscripción pedida", async () => {
  const creada = await crear("Samuel Acosta");
  const r = await pedir(`/api/inscripciones/${creada.id}`);
  const pista = r.status === 404 && r.cuerpo?.error ? ": tu ruta dice que no existe: ¿convertiste el id con Number()?" : "";
  assert.equal(r.status, 200, `GET /api/inscripciones/${creada.id} debería responder 200 (respondió ${r.status}${pista})`);
  assert.deepEqual(r.cuerpo, creada, `GET /api/inscripciones/${creada.id} debería responder ${mostrar(creada)} (respondió ${mostrar(r.cuerpo)})`);
});

test("un id que no existe responde 404 en JSON", async () => {
  const r = await pedir(`/api/inscripciones/${ID_INEXISTENTE}`);
  const pista = r.status === 200 ? ": ¿falta el if que responde 404 cuando no encuentra la inscripción?" : "";
  assert.equal(r.status, 404, `GET /api/inscripciones/${ID_INEXISTENTE} debería responder 404 (respondió ${r.status}${pista})`);
  assert.match(r.tipo, /application\/json/, "El 404 debería responder JSON con res.status(404).json(...), no la página de error de Express");
});

test("el error del 404 es un texto que menciona el id pedido", async () => {
  const r = await pedir(`/api/inscripciones/${ID_INEXISTENTE}`);
  const error = r.cuerpo?.error;
  assert.ok(typeof error === "string" && error.includes(String(ID_INEXISTENTE)), `La respuesta debería traer error con un texto que incluya ${ID_INEXISTENTE} (trae ${mostrar(r.cuerpo)})`);
});
