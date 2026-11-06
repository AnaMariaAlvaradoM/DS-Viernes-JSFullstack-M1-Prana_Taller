import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, reiniciarServidor, pedir, mostrar, PISTA_BASE } from "./servidor.js";

const creadas = [];

before(encenderServidor);
after(async () => {
  for (const id of creadas) await pedir(`/api/inscripciones/${id}`, { metodo: "DELETE" }).catch(() => {});
  apagarServidor();
});

function pista(r) {
  return r.status === 500 ? `: ${PISTA_BASE}` : "";
}

test("el catálogo de clases sale de la base de datos y sobrevive a un reinicio", async () => {
  const antes = await pedir("/api/clases");
  assert.ok(Array.isArray(antes.cuerpo) && antes.cuerpo.length >= 4, `GET /api/clases debería traer al menos 4 clases (respondió ${antes.status}${pista(antes)}: ${mostrar(antes.cuerpo)}; ¿corriste npx prisma db seed?)`);
  await reiniciarServidor();
  const despues = await pedir("/api/clases");
  assert.deepEqual(despues.cuerpo, antes.cuerpo, `Después de reiniciar, GET /api/clases debería responder lo mismo (respondió ${mostrar(despues.cuerpo)})`);
});

test("una inscripción sigue ahí después de reiniciar el servidor", async () => {
  const r = await pedir("/api/inscripciones", {
    metodo: "POST",
    cuerpo: { claseId: 1, alumnoNombre: "Juliana Restrepo", alumnoCorreo: "juliana.r@correo.com" },
  });
  assert.equal(r.status, 201, `POST /api/inscripciones debería responder 201 (respondió ${r.status}${pista(r)}: ${mostrar(r.cuerpo)})`);
  creadas.push(r.cuerpo.id);
  await reiniciarServidor();
  const despues = await pedir(`/api/inscripciones/${r.cuerpo.id}`);
  assert.equal(despues.status, 200, `Después de reiniciar, GET /api/inscripciones/${r.cuerpo.id} debería responder 200 (respondió ${despues.status}: ¿tus services todavía guardan en un arreglo?)`);
  assert.deepEqual(despues.cuerpo, r.cuerpo, `Después de reiniciar, la inscripción debería ser la misma (trae ${mostrar(despues.cuerpo)})`);
});

test("los ids no se repiten después de un reinicio", async () => {
  const cuerpo = { claseId: 1, alumnoNombre: "Esteban Mejía", alumnoCorreo: "esteban.m@correo.com" };
  const a = await pedir("/api/inscripciones", { metodo: "POST", cuerpo });
  assert.ok(Number.isInteger(a.cuerpo?.id), `POST /api/inscripciones debería responder la inscripción con su id (respondió ${a.status}${pista(a)}: ${mostrar(a.cuerpo)})`);
  creadas.push(a.cuerpo.id);
  await reiniciarServidor();
  const b = await pedir("/api/inscripciones", { metodo: "POST", cuerpo });
  assert.ok(Number.isInteger(b.cuerpo?.id), `Después de reiniciar, POST /api/inscripciones debería seguir funcionando (respondió ${b.status}${pista(b)}: ${mostrar(b.cuerpo)})`);
  creadas.push(b.cuerpo.id);
  assert.ok(b.cuerpo.id > a.cuerpo.id, `Después de reiniciar, el id nuevo (${b.cuerpo.id}) debería ser mayor que el anterior (${a.cuerpo.id}): ¿el contador volvió a empezar?`);
});
