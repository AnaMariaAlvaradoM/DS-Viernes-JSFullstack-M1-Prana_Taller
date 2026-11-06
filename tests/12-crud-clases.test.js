import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar, PISTA_BASE } from "./servidor.js";

const ID_INEXISTENTE = 99999;
const NUEVA = { nombre: "Yin yoga", instructora: "Marcela Díaz", horario: "Jueves 7:30 p. m.", cupo: 8 };
const creadas = [];

before(encenderServidor);
after(async () => {
  for (const id of creadas) await pedir(`/api/clases/${id}`, { metodo: "DELETE" }).catch(() => {});
  apagarServidor();
});

async function crear(datos = NUEVA) {
  const r = await pedir("/api/clases", { metodo: "POST", cuerpo: datos });
  if (Number.isInteger(r.cuerpo?.id)) creadas.push(r.cuerpo.id);
  return r;
}

function pista(r) {
  if (r.status === 404 && !r.cuerpo) return ": ¿creaste la ruta en clases.routes.js?";
  if (r.status === 500) return `: ${PISTA_BASE}`;
  return "";
}

test("POST /api/clases crea una clase y responde 201 con sus datos", async () => {
  const r = await crear();
  assert.equal(r.status, 201, `POST /api/clases debería responder 201 (respondió ${r.status}${pista(r)})`);
  assert.ok(Number.isInteger(r.cuerpo?.id), `La clase creada debería traer un id numérico (trae ${mostrar(r.cuerpo)})`);
  for (const campo of Object.keys(NUEVA)) {
    assert.equal(r.cuerpo?.[campo], NUEVA[campo], `La clase creada debería traer ${campo}: ${mostrar(NUEVA[campo])} (trae ${mostrar(r.cuerpo)})`);
  }
});

test("POST /api/clases con un cupo mayor que 15 responde 400", async () => {
  const r = await crear({ ...NUEVA, cupo: 20 });
  assert.equal(r.status, 400, `Una clase con cupo 20 debería responder 400 (respondió ${r.status}${pista(r)}): el salón tiene 15 colchonetas`);
  assert.ok(typeof r.cuerpo?.error === "string", `El 400 debería traer un JSON con error (trae ${mostrar(r.cuerpo)})`);
});

test("PUT /api/clases/:id actualiza la clase", async () => {
  const creada = (await crear()).cuerpo;
  assert.ok(Number.isInteger(creada?.id), "Para probar el PUT, primero debe funcionar POST /api/clases");
  const cambios = { ...NUEVA, horario: "Jueves 8:00 p. m.", cupo: 10 };
  const r = await pedir(`/api/clases/${creada.id}`, { metodo: "PUT", cuerpo: cambios });
  assert.equal(r.status, 200, `PUT /api/clases/${creada.id} debería responder 200 (respondió ${r.status}${pista(r)})`);
  assert.deepEqual(r.cuerpo, { ...cambios, id: creada.id }, `PUT /api/clases/${creada.id} debería responder ${mostrar({ ...cambios, id: creada.id })} (respondió ${mostrar(r.cuerpo)})`);
});

test("PUT a una clase que no existe responde 404", async () => {
  const r = await pedir(`/api/clases/${ID_INEXISTENTE}`, { metodo: "PUT", cuerpo: NUEVA });
  assert.equal(r.status, 404, `PUT /api/clases/${ID_INEXISTENTE} debería responder 404 (respondió ${r.status}${pista(r)})`);
  assert.ok(typeof r.cuerpo?.error === "string", `El 404 debería traer un JSON con error (trae ${mostrar(r.cuerpo)})`);
});

test("DELETE /api/clases/:id responde 204 y la clase deja de existir", async () => {
  const creada = (await crear()).cuerpo;
  assert.ok(Number.isInteger(creada?.id), "Para probar el DELETE, primero debe funcionar POST /api/clases");
  const r = await pedir(`/api/clases/${creada.id}`, { metodo: "DELETE" });
  assert.equal(r.status, 204, `DELETE /api/clases/${creada.id} debería responder 204 (respondió ${r.status}${pista(r)})`);
  const despues = await pedir(`/api/clases/${creada.id}`);
  assert.equal(despues.status, 404, `Después del DELETE, GET /api/clases/${creada.id} debería responder 404 (respondió ${despues.status})`);
});
