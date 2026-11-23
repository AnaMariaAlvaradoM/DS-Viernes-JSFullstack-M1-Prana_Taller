import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { RAIZ, existe, codigoSinComentarios, archivosDe } from "./utilidades.js";

function schema() {
  assert.ok(existe("prisma/schema.prisma"), "No encuentro prisma/schema.prisma: ahí van tus modelos (lee enunciados/fase-3.md)");
  return codigoSinComentarios("prisma/schema.prisma");
}

test("schema.prisma usa PostgreSQL y el generador prisma-client", () => {
  const codigo = schema();
  assert.match(codigo, /provider\s*=\s*"postgresql"/, "El datasource de schema.prisma debería tener provider = \"postgresql\"");
  assert.match(codigo, /provider\s*=\s*"prisma-client"/, "El generator de schema.prisma debería tener provider = \"prisma-client\"");
});

test("schema.prisma tiene los modelos Clase e Inscripcion relacionados de uno a muchos", () => {
  const codigo = schema();
  assert.match(codigo, /model\s+Clase\s*\{/, "Falta el modelo Clase en schema.prisma");
  assert.match(codigo, /model\s+Inscripcion\s*\{/, "Falta el modelo Inscripcion en schema.prisma (sin tilde)");
  assert.match(codigo, /\w+\s+Inscripcion\[\]/, "El modelo Clase debería tener un campo con la lista de inscripciones (por ejemplo inscripciones Inscripcion[])");
  assert.match(codigo, /@relation\(\s*fields:\s*\[\s*claseId\s*\]\s*,\s*references:\s*\[\s*id\s*\]\s*\)/, "La Inscripcion debería apuntar a su Clase con @relation(fields: [claseId], references: [id])");
});

test("el estado de la inscripción es un enum con los cuatro estados", () => {
  const codigo = schema();
  const bloque = (codigo.match(/enum\s+\w+\s*\{([^}]*)\}/) || [])[1] || "";
  assert.ok(bloque, "schema.prisma debería tener un enum para el estado de la inscripción");
  for (const estado of ["PENDIENTE", "CONFIRMADA", "CANCELADA", "ASISTIO"]) {
    assert.match(bloque, new RegExp(`\\b${estado}\\b`), `El enum de estados debería incluir ${estado}`);
  }
});

test("la migración inicial está guardada en prisma/migrations", () => {
  const carpetas = existe("prisma/migrations")
    ? fs.readdirSync(path.join(RAIZ, "prisma/migrations")).filter((n) => existe(`prisma/migrations/${n}/migration.sql`))
    : [];
  assert.ok(carpetas.length > 0, "No encuentro ninguna migración: corre npx prisma migrate dev --name init y sube la carpeta prisma/migrations");
});

test("los services usan Prisma y no un arreglo en memoria", () => {
  const services = archivosDe("src/services");
  assert.ok(services.length >= 2, "No encuentro tus services en src/services/");
  for (const archivo of services) {
    const codigo = codigoSinComentarios(archivo);
    assert.match(codigo, /prisma/, `${archivo} debería usar el cliente de Prisma (import prisma from '../lib/prisma.js')`);
    assert.doesNotMatch(codigo, /=\s*\[\s*\]\s*;|\.push\s*\(/, `${archivo} todavía guarda datos en un arreglo: en la Fase 3 los datos viven en PostgreSQL`);
  }
});

test("hay un prisma/seed.js y un .env.example sin contraseña real", () => {
  assert.ok(existe("prisma/seed.js"), "Falta prisma/seed.js: es el que crea las 4 clases del catálogo con npx prisma db seed");
  assert.ok(existe(".env.example"), "Falta .env.example en la raíz del proyecto, con la variable DATABASE_URL sin tu contraseña real");
  assert.match(fs.readFileSync(path.join(RAIZ, ".env.example"), "utf8"), /DATABASE_URL\s*=/, ".env.example debería tener la línea DATABASE_URL=...");
});
