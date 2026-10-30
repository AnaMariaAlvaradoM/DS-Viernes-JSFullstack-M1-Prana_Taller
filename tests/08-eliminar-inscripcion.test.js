import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar } from "./servidor.js";

before(encenderServidor);
after(apagarServidor);

const ID_INEXISTENTE = 99999;

async function crear() {
  const r = await pedir("/api/inscripciones", {
    metodo: "POST",
    cuerpo: { claseId: 4, alumnoNombre: "Felipe Cárdenas", alumnoCorreo: "felipe.c@correo.com" },
  });
  assert.ok(Number.isInteger(r.cuerpo?.id), "Para probar la eliminación, primero debe funcionar POST /api/inscripciones (ejercicio 05)");
  return r.cuerpo;
}

test("DELETE /api/inscripciones/:id responde 204", async () => {
  const creada = await crear();
  const r = await pedir(`/api/inscripciones/${creada.id}`, { metodo: "DELETE" });
  const pista = r.status === 200 ? ": un DELETE exitoso no devuelve cuerpo, usa res.status(204).end()" : r.status === 404 && !r.cuerpo ? ": ¿creaste router.delete('/:id')?" : "";
  assert.equal(r.status, 204, `DELETE /api/inscripciones/${creada.id} debería responder 204 (respondió ${r.status}${pista})`);
});

test("después de eliminarla, consultarla responde 404", async () => {
  const creada = await crear();
  await pedir(`/api/inscripciones/${creada.id}`, { metodo: "DELETE" });
  const r = await pedir(`/api/inscripciones/${creada.id}`);
  assert.equal(r.status, 404, `Después del DELETE, GET /api/inscripciones/${creada.id} debería responder 404 (respondió ${r.status}: ¿la sacaste del arreglo con splice?)`);
});

test("después de eliminarla, ya no aparece en la lista", async () => {
  const creada = await crear();
  await pedir(`/api/inscripciones/${creada.id}`, { metodo: "DELETE" });
  const r = await pedir("/api/inscripciones");
  assert.ok(Array.isArray(r.cuerpo), `GET /api/inscripciones debería responder un arreglo (respondió ${mostrar(r.cuerpo)})`);
  assert.ok(!r.cuerpo.some((i) => i?.id === creada.id), `La inscripción ${creada.id} sigue en la lista después del DELETE`);
});

test("eliminar un id que no existe responde 404", async () => {
  const r = await pedir(`/api/inscripciones/${ID_INEXISTENTE}`, { metodo: "DELETE" });
  assert.equal(r.status, 404, `DELETE /api/inscripciones/${ID_INEXISTENTE} debería responder 404 (respondió ${r.status})`);
  assert.ok(typeof r.cuerpo?.error === "string", `El 404 debería traer un JSON con error (trae ${mostrar(r.cuerpo)})`);
});
