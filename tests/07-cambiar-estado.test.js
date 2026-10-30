import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar } from "./servidor.js";

before(encenderServidor);
after(apagarServidor);

const ID_INEXISTENTE = 99999;

async function crear() {
  const r = await pedir("/api/inscripciones", {
    metodo: "POST",
    cuerpo: { claseId: 3, alumnoNombre: "Mariana Quintero", alumnoCorreo: "mariana.q@correo.com" },
  });
  assert.ok(Number.isInteger(r.cuerpo?.id), "Para probar el cambio de estado, primero debe funcionar POST /api/inscripciones (ejercicio 05)");
  return r.cuerpo;
}

test("PATCH /api/inscripciones/:id responde 200 con el estado nuevo", async () => {
  const creada = await crear();
  const r = await pedir(`/api/inscripciones/${creada.id}`, { metodo: "PATCH", cuerpo: { estado: "CONFIRMADA" } });
  const pista = r.status === 404 && !r.cuerpo ? ": ¿creaste router.patch('/:id')?" : "";
  assert.equal(r.status, 200, `PATCH /api/inscripciones/${creada.id} debería responder 200 (respondió ${r.status}${pista})`);
  assert.equal(r.cuerpo?.estado, "CONFIRMADA", `Después del PATCH, la inscripción debería traer estado: "CONFIRMADA" (trae ${mostrar(r.cuerpo)})`);
});

test("el estado nuevo queda guardado", async () => {
  const creada = await crear();
  await pedir(`/api/inscripciones/${creada.id}`, { metodo: "PATCH", cuerpo: { estado: "CANCELADA" } });
  const r = await pedir(`/api/inscripciones/${creada.id}`);
  assert.equal(r.cuerpo?.estado, "CANCELADA", `Al consultar después del PATCH, el estado debería ser "CANCELADA" (trae ${mostrar(r.cuerpo)}: ¿cambias el objeto guardado o solo una copia?)`);
});

test("el PATCH no cambia los demás campos", async () => {
  const creada = await crear();
  const r = await pedir(`/api/inscripciones/${creada.id}`, { metodo: "PATCH", cuerpo: { estado: "CONFIRMADA" } });
  assert.deepEqual(r.cuerpo, { ...creada, estado: "CONFIRMADA" }, `El PATCH solo cambia el estado: debería responder ${mostrar({ ...creada, estado: "CONFIRMADA" })} (respondió ${mostrar(r.cuerpo)})`);
});

test("cambiar el estado de un id que no existe responde 404", async () => {
  const r = await pedir(`/api/inscripciones/${ID_INEXISTENTE}`, { metodo: "PATCH", cuerpo: { estado: "CONFIRMADA" } });
  assert.equal(r.status, 404, `PATCH /api/inscripciones/${ID_INEXISTENTE} debería responder 404 (respondió ${r.status})`);
  assert.ok(typeof r.cuerpo?.error === "string", `El 404 debería traer un JSON con error (trae ${mostrar(r.cuerpo)})`);
});
