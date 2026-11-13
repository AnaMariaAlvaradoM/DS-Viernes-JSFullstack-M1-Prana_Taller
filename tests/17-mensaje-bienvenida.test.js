import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { encenderServidor, apagarServidor, pedir, mostrar, PISTA_BASE } from "./servidor.js";
import { encenderIaFalsa, apagarIaFalsa, modoDeLaIa, pedidosALaIa, TEXTO_DE_LA_IA } from "./ia-falsa.js";

const ALUMNA = `Valeria Prueba ${Date.now() % 100000}`;
const CORREO = "valeria.prueba@correo.com";
let clase = null;
let inscripcion = null;

before(async () => {
  await encenderIaFalsa();
  await encenderServidor();
});
after(async () => {
  if (inscripcion) await pedir(`/api/inscripciones/${inscripcion.id}`, { metodo: "DELETE" }).catch(() => {});
  if (clase) await pedir(`/api/clases/${clase.id}`, { metodo: "DELETE" }).catch(() => {});
  apagarServidor();
  apagarIaFalsa();
});

async function inscripcionDePrueba() {
  if (inscripcion) return inscripcion;
  const c = await pedir("/api/clases", {
    metodo: "POST",
    cuerpo: { nombre: "Yin yoga al atardecer", instructora: "Marcela Díaz", horario: "Jueves 6:00 p. m.", cupo: 8 },
  });
  assert.ok(Number.isInteger(c.cuerpo?.id), `Para probar la IA, primero debe funcionar POST /api/clases (respondió ${c.status}${c.status === 500 ? ": " + PISTA_BASE : ""})`);
  clase = c.cuerpo;
  const i = await pedir("/api/inscripciones", {
    metodo: "POST",
    cuerpo: { claseId: clase.id, alumnoNombre: ALUMNA, alumnoCorreo: CORREO },
  });
  assert.ok(Number.isInteger(i.cuerpo?.id), `Para probar la IA, primero debe funcionar POST /api/inscripciones (respondió ${i.status}: ${mostrar(i.cuerpo)})`);
  inscripcion = i.cuerpo;
  return inscripcion;
}

async function pedirBienvenida(id) {
  return pedir(`/api/ia/inscripciones/${id}/bienvenida`, { metodo: "POST" });
}

test("POST /api/ia/inscripciones/:id/bienvenida responde 200 con el mensaje de la IA", async () => {
  modoDeLaIa("ok");
  const { id } = await inscripcionDePrueba();
  const r = await pedirBienvenida(id);
  const pista = r.status === 404 && !r.cuerpo?.error ? ": ¿montaste el router en app.use('/api/ia', ...) y la ruta router.post('/inscripciones/:id/bienvenida', ...)?" : "";
  assert.equal(r.status, 200, `POST /api/ia/inscripciones/${id}/bienvenida debería responder 200 (respondió ${r.status}${pista}: ${mostrar(r.cuerpo)})`);
  assert.equal(r.cuerpo?.mensaje, TEXTO_DE_LA_IA, `La respuesta debería traer { "mensaje": "<lo que escribió la IA>" } (trae ${mostrar(r.cuerpo)})`);
});

test("la respuesta dice de qué inscripción es y a qué correo va", async () => {
  modoDeLaIa("ok");
  const { id } = await inscripcionDePrueba();
  const r = await pedirBienvenida(id);
  assert.equal(r.cuerpo?.inscripcionId, id, `La respuesta debería traer inscripcionId: ${id} (trae ${mostrar(r.cuerpo)})`);
  assert.equal(r.cuerpo?.correo, CORREO, `La respuesta debería traer correo: "${CORREO}" (trae ${mostrar(r.cuerpo)})`);
});

test("el prompt lleva los datos reales de la inscripción y de su clase", async () => {
  modoDeLaIa("ok");
  const { id } = await inscripcionDePrueba();
  const antes = pedidosALaIa.length;
  await pedirBienvenida(id);
  const pedido = pedidosALaIa.slice(antes).map((p) => {
    try {
      return JSON.stringify(JSON.parse(p.cuerpo));
    } catch {
      return p.cuerpo;
    }
  }).join(" ");
  assert.ok(pedido !== "", "Tu API no le pidió nada a la IA: ¿llamas a responses.create (o chat.completions.create) en ia.service.js?");
  for (const dato of [ALUMNA, "Yin yoga al atardecer", "Marcela Díaz", "Jueves 6:00 p. m."]) {
    assert.ok(pedido.includes(dato), `Lo que le enviaste a la IA debería incluir "${dato}", que sale de la base de datos (no lo escribas a mano en el código)`);
  }
});

test("una inscripción que no existe responde 404 y no gasta IA", async () => {
  modoDeLaIa("ok");
  const antes = pedidosALaIa.length;
  const r = await pedirBienvenida(999999);
  assert.equal(r.status, 404, `Con una inscripción que no existe debería responder 404 (respondió ${r.status}: ${mostrar(r.cuerpo)})`);
  assert.ok(typeof r.cuerpo?.error === "string", `El 404 debería venir de tu service, en JSON: { "error": "No existe la inscripción..." } (trae ${mostrar(r.cuerpo)}: ¿ya existe la ruta de la IA?)`);
  assert.equal(pedidosALaIa.length, antes, "Le pediste un mensaje a la IA para una inscripción que no existe: busca la inscripción ANTES de llamar a la IA");
});

test("un id que no es número responde 400", async () => {
  const r = await pedirBienvenida("abc");
  assert.equal(r.status, 400, `POST /api/ia/inscripciones/abc/bienvenida debería responder 400 (respondió ${r.status}: ¿usas leerId como en los otros services?)`);
  assert.ok(typeof r.cuerpo?.error === "string", `El 400 debería traer { "error": "..." } (trae ${mostrar(r.cuerpo)})`);
});

test("una inscripción cancelada responde 409 y no gasta IA", async () => {
  modoDeLaIa("ok");
  const { id } = await inscripcionDePrueba();
  const cancelar = await pedir(`/api/inscripciones/${id}`, { metodo: "PATCH", cuerpo: { estado: "CANCELADA" } });
  assert.equal(cancelar.status, 200, `Para esta prueba, PATCH a CANCELADA debería responder 200 (respondió ${cancelar.status})`);
  const antes = pedidosALaIa.length;
  const r = await pedirBienvenida(id);
  await pedir(`/api/inscripciones/${id}`, { metodo: "PATCH", cuerpo: { estado: "PENDIENTE" } });
  assert.equal(r.status, 409, `Una inscripción CANCELADA no necesita bienvenida: debería responder 409 (respondió ${r.status})`);
  assert.equal(pedidosALaIa.length, antes, "Le pediste un mensaje a la IA para una inscripción cancelada: revisa el estado ANTES de llamar a la IA");
});
