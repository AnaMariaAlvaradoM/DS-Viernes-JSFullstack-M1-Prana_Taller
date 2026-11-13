import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { RAIZ, existe } from "./utilidades.js";

function proyecto() {
  assert.ok(existe("PROYECTO.md"), "No encuentro PROYECTO.md en la raíz del proyecto (lee la sección 6 de enunciados/fase-4.md)");
  return fs.readFileSync(path.join(RAIZ, "PROYECTO.md"), "utf8");
}

function seccion(texto, patronTitulo) {
  const lineas = texto.split(/\r?\n/);
  const inicio = lineas.findIndex((l) => /^#{1,4}\s/.test(l) && patronTitulo.test(l));
  if (inicio === -1) return null;
  const resto = lineas.slice(inicio + 1);
  const fin = resto.findIndex((l) => /^#{1,2}\s/.test(l));
  return (fin === -1 ? resto : resto.slice(0, fin)).join("\n");
}

test("PROYECTO.md explica qué problema resuelve la API", () => {
  const s = seccion(proyecto(), /problema/i);
  assert.ok(s !== null && s.trim().length >= 40, "PROYECTO.md debería tener una sección cuyo título diga 'problema' (por ejemplo ## Qué problema resuelve) con al menos un par de frases");
});

test("PROYECTO.md dice cómo instalarlo y correrlo", () => {
  const s = seccion(proyecto(), /instal|correr/i);
  assert.ok(s !== null, "PROYECTO.md debería tener una sección '## Cómo instalarlo y correrlo'");
  for (const comando of ["npm install", "prisma migrate", "npm run dev"]) {
    assert.ok(s.includes(comando), `La sección de instalación debería incluir el comando ${comando}`);
  }
});

test("PROYECTO.md lista las variables de entorno sin valores reales", () => {
  const s = seccion(proyecto(), /variables/i);
  assert.ok(s !== null, "PROYECTO.md debería tener una sección '## Variables de entorno'");
  for (const variable of ["DATABASE_URL", "OPENAI_API_KEY"]) {
    assert.ok(s.includes(variable), `La sección de variables de entorno debería explicar ${variable}`);
  }
});

test("PROYECTO.md tiene la tabla de endpoints y el prompt documentado", () => {
  const texto = proyecto();
  const endpoints = seccion(texto, /endpoints/i);
  assert.ok(endpoints !== null && endpoints.includes("/api/ia/inscripciones"), "PROYECTO.md debería tener una sección '## Endpoints' con una tabla que incluya /api/ia/inscripciones/:id/bienvenida");
  const prompt = seccion(texto, /prompt/i);
  assert.ok(prompt !== null && prompt.trim().length >= 120, "PROYECTO.md debería tener una sección '## Prompt' con tu prompt y por qué lo armaste así (al menos unas líneas)");
});
