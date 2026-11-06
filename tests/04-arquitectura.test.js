import test from "node:test";
import assert from "node:assert/strict";
import { existe, codigoSinComentarios, archivosDe } from "./utilidades.js";

test("existe src/app.js con la aplicación de Express", () => {
  assert.ok(existe("src/app.js"), "No encuentro src/app.js: ahí va la configuración de Express (app, express.json() y las rutas)");
  assert.match(codigoSinComentarios("src/app.js"), /express\s*\(\s*\)/, "src/app.js debería crear la aplicación con express()");
  assert.match(codigoSinComentarios("src/app.js"), /export\s+default\s+app\b/, "src/app.js debería terminar con export default app para que index.js la use");
});

test("src/index.js importa la app y solo la enciende", () => {
  const codigo = codigoSinComentarios("src/index.js");
  assert.match(codigo, /from\s+['"]\.\/app\.js['"]/, "src/index.js debería traer la aplicación con import app from './app.js'");
  assert.match(codigo, /\.listen\s*\(/, "src/index.js debería encender el servidor con app.listen(...)");
  assert.doesNotMatch(codigo, /\.(get|post|patch|put|delete|use)\s*\(/, "src/index.js solo enciende el servidor: las rutas y los app.use van en app.js y en routes/");
});

test("existen las carpetas routes, controllers y services con sus archivos", () => {
  for (const capa of ["routes", "controllers", "services"]) {
    const archivos = archivosDe(`src/${capa}`);
    assert.ok(archivos.length >= 2, `src/${capa}/ debería tener un archivo para clases y otro para inscripciones (tiene ${archivos.length})`);
  }
});

test("las rutas usan Router de Express", () => {
  const rutas = archivosDe("src/routes");
  assert.ok(rutas.length > 0, "No encuentro archivos en src/routes/");
  for (const archivo of rutas) {
    assert.match(codigoSinComentarios(archivo), /Router\s*\(\s*\)/, `${archivo} debería crear sus rutas con Router() de Express`);
  }
});

test("los datos y las reglas viven en services, no en rutas ni controladores", () => {
  const capasDelgadas = [...archivosDe("src/routes"), ...archivosDe("src/controllers")];
  assert.ok(capasDelgadas.length > 0, "No encuentro archivos en src/routes/ ni en src/controllers/");
  for (const archivo of capasDelgadas) {
    const codigo = codigoSinComentarios(archivo);
    assert.doesNotMatch(codigo, /instructora/, `${archivo} tiene el catálogo de clases: los datos van en src/services/`);
    assert.doesNotMatch(codigo, /PENDIENTE/, `${archivo} decide el estado inicial: esa regla va en src/services/`);
  }
});
