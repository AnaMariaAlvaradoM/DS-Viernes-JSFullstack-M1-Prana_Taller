import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { RAIZ, existe, codigoSinComentarios } from "./utilidades.js";

function archivosJs(carpeta) {
  const ruta = path.join(RAIZ, carpeta);
  if (!fs.existsSync(ruta)) return [];
  const encontrados = [];
  for (const entrada of fs.readdirSync(ruta, { withFileTypes: true })) {
    const relativa = path.posix.join(carpeta, entrada.name);
    if (entrada.isDirectory() && entrada.name !== "generated") encontrados.push(...archivosJs(relativa));
    if (entrada.isFile() && entrada.name.endsWith(".js")) encontrados.push(relativa);
  }
  return encontrados;
}

test("src/services/ia.service.js usa el paquete oficial openai", () => {
  assert.ok(existe("src/services/ia.service.js"), "No encuentro src/services/ia.service.js: ahí vive la conversación con la IA (lee enunciados/fase-4.md)");
  const codigo = codigoSinComentarios("src/services/ia.service.js");
  assert.match(codigo, /from\s+['"]openai['"]/, "ia.service.js debería traer el SDK oficial: import OpenAI from 'openai';");
});

test("la IA tiene su propia ruta y su propio controlador", () => {
  assert.ok(existe("src/routes/ia.routes.js"), "Falta src/routes/ia.routes.js con la ruta de la IA");
  assert.ok(existe("src/controllers/ia.controller.js"), "Falta src/controllers/ia.controller.js");
  assert.match(codigoSinComentarios("src/app.js"), /['"]\/api\/ia['"]/, "src/app.js debería montar el router de la IA en '/api/ia'");
});

test("el controlador no habla directo con OpenAI", () => {
  const codigo = codigoSinComentarios("src/controllers/ia.controller.js");
  assert.ok(codigo.trim() !== "", "No encuentro código en src/controllers/ia.controller.js");
  assert.doesNotMatch(codigo, /from\s+['"]openai['"]|new\s+OpenAI/, "ia.controller.js no debería usar OpenAI: el controlador recibe y responde; la IA vive en ia.service.js");
});

test("ninguna llave de API está escrita en el código", () => {
  assert.ok(existe("src/services/ia.service.js"), "Primero crea src/services/ia.service.js; después reviso que ninguna llave quede escrita en el código");
  const sospechosos = [...archivosJs("src"), ".env.example", "PROYECTO.md"]
    .filter((archivo) => existe(archivo))
    .filter((archivo) => /sk-[A-Za-z0-9_-]{16,}/.test(fs.readFileSync(path.join(RAIZ, archivo), "utf8")));
  assert.deepEqual(sospechosos, [], `Encontré algo que parece una llave real de OpenAI en: ${sospechosos.join(", ")}. La llave va SOLO en .env (que no se sube)`);
});

test(".env.example anuncia OPENAI_API_KEY sin una llave real", () => {
  assert.ok(existe(".env.example"), "No encuentro .env.example en la raíz del proyecto");
  const texto = fs.readFileSync(path.join(RAIZ, ".env.example"), "utf8");
  const linea = texto.split(/\r?\n/).find((l) => /^\s*OPENAI_API_KEY\s*=/.test(l));
  assert.ok(linea, ".env.example debería tener una línea OPENAI_API_KEY=... (sin tu llave real) para que otra persona sepa qué variable crear");
  assert.doesNotMatch(linea, /sk-[A-Za-z0-9_-]{16,}/, ".env.example tiene una llave que parece real: cámbiala por un texto como tu-llave-de-openai");
});
