import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { RAIZ, archivosDe } from "./utilidades.js";

function coleccion() {
  const archivos = archivosDe("postman", ".json");
  assert.ok(archivos.length > 0, "No encuentro tu colección: exporta desde Postman (Export → Collection v2.1) y guárdala en la carpeta postman/");
  try {
    return JSON.parse(fs.readFileSync(path.join(RAIZ, archivos[0]), "utf8"));
  } catch {
    assert.fail(`${archivos[0]} no es un JSON válido: vuelve a exportarla desde Postman sin editarla a mano`);
  }
}

// Recorre carpetas y peticiones: Postman permite agrupar peticiones dentro de carpetas.
function peticiones(items = []) {
  return items.flatMap((item) => (Array.isArray(item?.item) ? peticiones(item.item) : item?.request ? [item.request] : []));
}

function urlDe(peticion) {
  const url = peticion?.url;
  return typeof url === "string" ? url : url?.raw || "";
}

test("existe una colección de Postman en la carpeta postman/", () => {
  coleccion();
});

test("la colección está exportada en formato v2.1", () => {
  const c = coleccion();
  assert.match(String(c?.info?.schema || ""), /v2\.1/, `La colección debería exportarse como Collection v2.1 (el schema dice ${c?.info?.schema})`);
});

test("la colección tiene al menos 5 peticiones", () => {
  const lista = peticiones(coleccion().item);
  assert.ok(lista.length >= 5, `La colección debería tener una petición por endpoint de inscripciones, al menos 5 (tiene ${lista.length})`);
});

test("hay un POST, un GET, un PATCH y un DELETE a /api/inscripciones", () => {
  const lista = peticiones(coleccion().item).filter((p) => urlDe(p).includes("/api/inscripciones"));
  const metodos = new Set(lista.map((p) => String(p.method || "GET").toUpperCase()));
  for (const metodo of ["POST", "GET", "PATCH", "DELETE"]) {
    assert.ok(metodos.has(metodo), `Falta una petición ${metodo} a /api/inscripciones en tu colección (encontré: ${[...metodos].join(", ") || "ninguna"})`);
  }
});
