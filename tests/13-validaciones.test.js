import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar, PISTA_BASE } from "./servidor.js";

before(encenderServidor);
after(apagarServidor);

const BUENA = { claseId: 1, alumnoNombre: "Paula Ríos", alumnoCorreo: "paula.rios@correo.com" };

function esperar400(r, descripcion) {
  const pista = r.status === 201 ? ": todavía no validas ese dato" : r.status === 500 ? `: tu servidor falló en vez de validar (${PISTA_BASE})` : "";
  assert.equal(r.status, 400, `${descripcion} debería responder 400 (respondió ${r.status}${pista})`);
  assert.ok(typeof r.cuerpo?.error === "string" && r.cuerpo.error.trim() !== "", `El 400 debería traer un JSON con error que diga qué está mal (trae ${mostrar(r.cuerpo)})`);
}

test("una inscripción sin alumnoNombre responde 400", async () => {
  const { alumnoNombre, ...sinNombre } = BUENA;
  esperar400(await pedir("/api/inscripciones", { metodo: "POST", cuerpo: sinNombre }), "Una inscripción sin alumnoNombre");
});

test("un correo sin @ responde 400", async () => {
  esperar400(await pedir("/api/inscripciones", { metodo: "POST", cuerpo: { ...BUENA, alumnoCorreo: "paula.correo.com" } }), "Una inscripción con alumnoCorreo sin @");
});

test("un claseId que no es número responde 400", async () => {
  esperar400(await pedir("/api/inscripciones", { metodo: "POST", cuerpo: { ...BUENA, claseId: "abc" } }), "Una inscripción con claseId \"abc\"");
});

test("inscribirse a una clase que no existe responde 404", async () => {
  const r = await pedir("/api/inscripciones", { metodo: "POST", cuerpo: { ...BUENA, claseId: 99999 } });
  const pista = r.status === 500 ? ": la base rechazó la inscripción porque la clase no existe; búscala antes de crear" : "";
  assert.equal(r.status, 404, `Una inscripción a la clase 99999 debería responder 404 (respondió ${r.status}${pista})`);
  assert.ok(typeof r.cuerpo?.error === "string", `El 404 debería traer un JSON con error (trae ${mostrar(r.cuerpo)})`);
});

test("un estado que no existe responde 400", async () => {
  const creada = await pedir("/api/inscripciones", { metodo: "POST", cuerpo: BUENA });
  assert.ok(Number.isInteger(creada.cuerpo?.id), `Para probar el estado, primero debe funcionar POST /api/inscripciones (respondió ${creada.status})`);
  const r = await pedir(`/api/inscripciones/${creada.cuerpo.id}`, { metodo: "PATCH", cuerpo: { estado: "QUIZAS" } });
  await pedir(`/api/inscripciones/${creada.cuerpo.id}`, { metodo: "DELETE" });
  esperar400(r, "Un PATCH con estado \"QUIZAS\"");
});

test("GET /api/clases/abc responde 400 y no 404", async () => {
  esperar400(await pedir("/api/clases/abc"), "GET /api/clases/abc");
});
