import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor } from "./servidor.js";
import { codigoSinComentarios, archivosDe } from "./utilidades.js";

before(encenderServidor);
after(apagarServidor);

const CUATRO_PARAMETROS = /\(\s*\w+\s*,\s*\w+\s*,\s*\w+\s*,\s*\w+\s*\)/;

test("existe un middleware de errores con cuatro parámetros en src/middlewares/", () => {
  const archivos = archivosDe("src/middlewares");
  assert.ok(archivos.length > 0, "No encuentro la carpeta src/middlewares/ con tu middleware de errores");
  const alguno = archivos.some((a) => CUATRO_PARAMETROS.test(codigoSinComentarios(a)));
  assert.ok(alguno, "Tu middleware de errores debería recibir cuatro parámetros (err, req, res, next): con tres, Express no lo reconoce como manejador de errores");
});

test("app.js registra el middleware de errores después de las rutas", () => {
  const codigo = codigoSinComentarios("src/app.js");
  const usos = [...codigo.matchAll(/app\.use\s*\(/g)].map((m) => m.index);
  const rutas = codigo.lastIndexOf("/api/inscripciones");
  assert.match(codigo, /from\s+['"]\.\/middlewares\//, "src/app.js debería importar tu middleware desde './middlewares/...'");
  assert.ok(usos.length > 0 && usos[usos.length - 1] > rutas, "El último app.use(...) de src/app.js debería ser el del middleware de errores, después de los routers");
});

test("un JSON mal escrito responde 400 en JSON", async () => {
  const r = await fetch("http://localhost:3000/api/inscripciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"claseId": 1,',
    signal: AbortSignal.timeout(3000),
  });
  const tipo = r.headers.get("content-type") || "";
  assert.equal(r.status, 400, `Un cuerpo con JSON mal escrito debería responder 400 (respondió ${r.status})`);
  assert.match(tipo, /application\/json/, "Un JSON mal escrito debería responder JSON con error, no la página HTML de Express: revisa err.type === 'entity.parse.failed' en tu middleware");
});

test("los controladores ya no repiten el 404: lo decide el service", () => {
  for (const archivo of archivosDe("src/controllers")) {
    assert.doesNotMatch(codigoSinComentarios(archivo), /status\s*\(\s*404\s*\)/, `${archivo} todavía responde 404 por su cuenta: en la Fase 3 el service lanza el error y el middleware responde`);
  }
});
