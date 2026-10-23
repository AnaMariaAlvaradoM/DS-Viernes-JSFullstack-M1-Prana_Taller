import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar } from "./servidor.js";

before(encenderServidor);
after(apagarServidor);

async function catalogo() {
  const r = await pedir("/api/clases");
  assert.ok(Array.isArray(r.cuerpo) && r.cuerpo.length > 0, `GET /api/clases debería responder un arreglo con clases (respondió ${r.status}: ${mostrar(r.cuerpo)})`);
  return r.cuerpo;
}

test("GET /api/clases responde con código 200", async () => {
  const r = await pedir("/api/clases");
  assert.equal(r.status, 200, `GET /api/clases debería responder 200 (respondió ${r.status}: ¿creaste la ruta?)`);
});

test("GET /api/clases responde al menos 4 clases", async () => {
  const clases = await catalogo();
  assert.ok(clases.length >= 4, `El catálogo debería tener al menos 4 clases (tiene ${clases.length})`);
});

test("cada clase tiene id, nombre, instructora, horario y cupo", async () => {
  const clases = await catalogo();
  clases.forEach((c, i) => {
    assert.ok(Number.isInteger(c?.id), `La clase en la posición ${i} debería tener un id numérico (tiene ${mostrar(c?.id)})`);
    for (const campo of ["nombre", "instructora", "horario"]) {
      assert.ok(typeof c[campo] === "string" && c[campo].trim() !== "", `La clase con id ${c.id} debería tener ${campo} como texto (tiene ${mostrar(c[campo])})`);
    }
    assert.ok(Number.isInteger(c.cupo), `La clase con id ${c.id} debería tener cupo como número (tiene ${mostrar(c.cupo)})`);
  });
});

test("ningún id se repite en el catálogo", async () => {
  const clases = await catalogo();
  const ids = clases.map((c) => c?.id);
  assert.equal(new Set(ids).size, ids.length, `Cada clase debería tener un id distinto (ids: ${mostrar(ids)})`);
});

test("ningún cupo supera las 15 colchonetas del salón", async () => {
  const clases = await catalogo();
  for (const c of clases) {
    assert.ok(c?.cupo >= 1 && c?.cupo <= 15, `La clase con id ${c?.id} tiene cupo ${mostrar(c?.cupo)}: debería estar entre 1 y 15`);
  }
});
