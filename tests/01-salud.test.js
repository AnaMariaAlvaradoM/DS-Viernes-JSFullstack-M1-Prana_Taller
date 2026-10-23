import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar } from "./servidor.js";

before(encenderServidor);
after(apagarServidor);

test("GET /api/salud responde con código 200", async () => {
  const r = await pedir("/api/salud");
  assert.equal(r.status, 200, `GET /api/salud debería responder 200 (respondió ${r.status}: ¿creaste la ruta?)`);
});

test("GET /api/salud responde en formato JSON", async () => {
  const r = await pedir("/api/salud");
  assert.match(r.tipo, /application\/json/, "GET /api/salud debería responder JSON (usa res.json(...))");
});

test("el estado de la API es ok", async () => {
  const r = await pedir("/api/salud");
  assert.equal(r.cuerpo?.estado, "ok", `La respuesta debería traer estado: "ok" (trae ${mostrar(r.cuerpo)})`);
});

test("la API se identifica como prana-api", async () => {
  const r = await pedir("/api/salud");
  assert.equal(r.cuerpo?.servicio, "prana-api", `La respuesta debería traer servicio: "prana-api" (trae ${mostrar(r.cuerpo)})`);
});
