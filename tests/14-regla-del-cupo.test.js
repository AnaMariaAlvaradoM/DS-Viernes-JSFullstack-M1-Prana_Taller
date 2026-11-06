import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar, PISTA_BASE } from "./servidor.js";

let clase = null;
const inscripciones = [];

before(encenderServidor);
after(async () => {
  for (const id of inscripciones) await pedir(`/api/inscripciones/${id}`, { metodo: "DELETE" }).catch(() => {});
  if (clase) await pedir(`/api/clases/${clase.id}`, { metodo: "DELETE" }).catch(() => {});
  apagarServidor();
});

async function claseConCupo2() {
  if (clase) return clase;
  const r = await pedir("/api/clases", {
    metodo: "POST",
    cuerpo: { nombre: "Yoga prenatal", instructora: "Sofía Rincón", horario: "Viernes 10:00 a. m.", cupo: 2 },
  });
  assert.ok(Number.isInteger(r.cuerpo?.id), `Para probar el cupo, primero debe funcionar POST /api/clases (ejercicio 12; respondió ${r.status}: ${mostrar(r.cuerpo)})`);
  clase = r.cuerpo;
  return clase;
}

async function inscribir(alumnoNombre) {
  const { id: claseId } = await claseConCupo2();
  const r = await pedir("/api/inscripciones", {
    metodo: "POST",
    cuerpo: { claseId, alumnoNombre, alumnoCorreo: "alumna@correo.com" },
  });
  if (r.status === 201 && Number.isInteger(r.cuerpo?.id)) inscripciones.push(r.cuerpo.id);
  return r;
}

test("mientras haya cupo, la inscripción responde 201", async () => {
  for (const nombre of ["Ana Lucía Prada", "Carolina Vélez"]) {
    const r = await inscribir(nombre);
    assert.equal(r.status, 201, `Con cupo disponible, la inscripción de ${nombre} debería responder 201 (respondió ${r.status}${r.status === 500 ? ": " + PISTA_BASE : ""}: ${mostrar(r.cuerpo)})`);
  }
});

test("con la clase llena, la inscripción responde 409 con un error", async () => {
  const r = await inscribir("Mónica Salazar");
  const pista = r.status === 201 ? ": todavía no revisas el cupo antes de inscribir" : "";
  assert.equal(r.status, 409, `La tercera inscripción a una clase con cupo 2 debería responder 409 (respondió ${r.status}${pista})`);
  assert.ok(typeof r.cuerpo?.error === "string" && r.cuerpo.error.trim() !== "", `El 409 debería traer un JSON con error que explique que la clase está llena (trae ${mostrar(r.cuerpo)})`);
});

test("el 409 no guarda la inscripción", async () => {
  await inscribir("Mónica Salazar");
  const r = await pedir("/api/inscripciones");
  const enLaClase = Array.isArray(r.cuerpo) ? r.cuerpo.filter((i) => i?.claseId === clase?.id) : [];
  assert.equal(enLaClase.length, 2, `La clase con cupo 2 debería tener 2 inscripciones (tiene ${enLaClase.length}: ¿guardas antes de revisar el cupo?)`);
});

test("una inscripción cancelada libera el cupo", async () => {
  await claseConCupo2();
  assert.ok(inscripciones.length > 0, "Para probar esto, primero deben funcionar las inscripciones con cupo");
  const cancelada = await pedir(`/api/inscripciones/${inscripciones[0]}`, { metodo: "PATCH", cuerpo: { estado: "CANCELADA" } });
  assert.equal(cancelada.status, 200, `PATCH a CANCELADA debería responder 200 (respondió ${cancelada.status})`);
  const r = await inscribir("Mónica Salazar");
  assert.equal(r.status, 201, `Con una inscripción CANCELADA, la clase vuelve a tener cupo: debería responder 201 (respondió ${r.status}: ¿cuentas también las canceladas?)`);
});
