import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar } from "./servidor.js";

before(encenderServidor);
after(apagarServidor);

const ID_INEXISTENTE = 99999;

async function catalogo() {
  const r = await pedir("/api/clases");
  assert.ok(Array.isArray(r.cuerpo) && r.cuerpo.length > 0, "Para probar la búsqueda, primero debe funcionar GET /api/clases (ejercicio 02)");
  return r.cuerpo;
}

test("GET /api/clases/:id responde 200 con la primera clase", async () => {
  const [primera] = await catalogo();
  const r = await pedir(`/api/clases/${primera.id}`);
  const pista = r.status === 404 && r.cuerpo?.error ? "tu ruta dice que no existe: ¿convertiste el id con Number()?" : "¿creaste la ruta con :id?";
  assert.equal(r.status, 200, `GET /api/clases/${primera.id} debería responder 200 (respondió ${r.status}: ${pista})`);
});

test("la clase que responde es la del id pedido", async () => {
  const [primera] = await catalogo();
  const r = await pedir(`/api/clases/${primera.id}`);
  assert.deepEqual(r.cuerpo, primera, `GET /api/clases/${primera.id} debería responder ${mostrar(primera)} (respondió ${mostrar(r.cuerpo)}; ¿convertiste el id con Number()?)`);
});

test("también encuentra la última clase del catálogo", async () => {
  const clases = await catalogo();
  const ultima = clases[clases.length - 1];
  const r = await pedir(`/api/clases/${ultima.id}`);
  assert.deepEqual(r.cuerpo, ultima, `GET /api/clases/${ultima.id} debería responder ${mostrar(ultima)} (respondió ${mostrar(r.cuerpo)})`);
});

test("un id que no existe responde 404 en JSON", async () => {
  const r = await pedir(`/api/clases/${ID_INEXISTENTE}`);
  const pista = r.status === 200 ? ": ¿falta el if que responde 404 cuando find no encuentra la clase?" : "";
  assert.equal(r.status, 404, `GET /api/clases/${ID_INEXISTENTE} debería responder 404 (respondió ${r.status}${pista})`);
  assert.match(r.tipo, /application\/json/, "El 404 debería responder JSON con res.status(404).json(...), no la página de error de Express");
});

test("el error del 404 es un texto que menciona el id pedido", async () => {
  const r = await pedir(`/api/clases/${ID_INEXISTENTE}`);
  const error = r.cuerpo?.error;
  assert.ok(typeof error === "string" && error.includes(String(ID_INEXISTENTE)), `La respuesta debería traer error con un texto que incluya ${ID_INEXISTENTE} (trae ${mostrar(r.cuerpo)})`);
});
