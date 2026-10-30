// Ayuda para los tests: enciende TU servidor (src/index.js), le hace peticiones y lo apaga.
// No hace falta que lo modifiques.
import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUERTO = 3000;
const ESPERA_MAXIMA_MS = 5000;
const TIEMPO_RESPUESTA_MS = 3000;

let proceso = null;
let salidaError = "";
let problema = "";

function puertoOcupado() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port: PUERTO, host: "localhost" });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

function explicarCaida() {
  const texto = salidaError;
  if (/Cannot find package 'express'/.test(texto)) {
    return "No encuentro Express: corre npm install en la carpeta del proyecto y vuelve a intentarlo.";
  }
  if (/EADDRINUSE/.test(texto)) {
    return "El puerto 3000 ya está ocupado: apaga tu servidor (Ctrl + C donde corre npm run dev) y vuelve a correr npm test.";
  }
  if (/SyntaxError/.test(texto)) {
    const donde = (texto.match(/(src\/[\w./-]+:\d+)/) || [])[1];
    return `Hay un error de sintaxis (SyntaxError)${donde ? " en " + donde : " en tu código"}: revisa paréntesis, llaves y comillas.`;
  }
  if (/ERR_MODULE_NOT_FOUND/.test(texto)) {
    const linea = texto.split("\n").find((l) => /Cannot find/.test(l)) || "";
    return `Tu código importa algo que no existe: ${linea.trim()}`;
  }
  const error = texto.split("\n").find((l) => /Error/.test(l));
  if (error) return `Tu servidor se cayó al arrancar: ${error.trim()}`;
  return "Tu servidor se apagó apenas arrancó: ¿te falta app.listen(3000, ...) para que se quede escuchando?";
}

export async function encenderServidor() {
  const entrada = path.join(RAIZ, "src", "index.js");
  if (!fs.existsSync(entrada)) {
    problema = "No encuentro src/index.js: tu servidor debe arrancar desde ese archivo.";
    return;
  }
  const codigo = fs.readFileSync(entrada, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  if (codigo.trim() === "") {
    problema = "src/index.js todavía no tiene código: empieza por el enunciado en enunciados/fase-1.md.";
    return;
  }
  if (await puertoOcupado()) {
    problema = "El puerto 3000 ya está ocupado: apaga tu servidor (Ctrl + C donde corre npm run dev) y vuelve a correr npm test.";
    return;
  }
  proceso = spawn(process.execPath, [entrada], { cwd: RAIZ, stdio: ["ignore", "ignore", "pipe"] });
  proceso.stderr.on("data", (dato) => (salidaError += dato));

  const inicio = Date.now();
  while (Date.now() - inicio < ESPERA_MAXIMA_MS) {
    if (proceso.exitCode !== null) {
      problema = explicarCaida();
      return;
    }
    if (await puertoOcupado()) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  problema = "Tu servidor no abrió el puerto 3000 en 5 segundos: ¿escribiste app.listen(3000, ...)? ¿O hay un ciclo infinito antes de llegar a él?";
}

export function apagarServidor() {
  if (proceso && proceso.exitCode === null) proceso.kill();
}

process.on("exit", apagarServidor);
process.on("SIGTERM", () => {
  apagarServidor();
  process.exit(1);
});

// opciones (Fase 2 en adelante): { metodo: "POST", cuerpo: { ... } }. Sin opciones hace un GET.
export async function pedir(ruta, opciones = {}) {
  if (problema) throw new Error(problema);
  const metodo = opciones.metodo || "GET";
  const configuracion = { method: metodo, signal: AbortSignal.timeout(TIEMPO_RESPUESTA_MS) };
  if (opciones.cuerpo !== undefined) {
    configuracion.headers = { "Content-Type": "application/json" };
    configuracion.body = JSON.stringify(opciones.cuerpo);
  }
  try {
    const respuesta = await fetch(`http://localhost:${PUERTO}${ruta}`, configuracion);
    const texto = await respuesta.text();
    let cuerpo = null;
    try {
      cuerpo = JSON.parse(texto);
    } catch {
      cuerpo = null;
    }
    return { status: respuesta.status, tipo: respuesta.headers.get("content-type") || "", cuerpo };
  } catch (error) {
    if (error.name === "TimeoutError") {
      throw new Error(`${metodo} ${ruta} no respondió en 3 segundos: ¿a esa ruta le falta responder con res.json(...)?`);
    }
    throw new Error(`No pude conectarme a tu servidor (${error.message}).`);
  }
}

export function mostrar(valor) {
  const texto = JSON.stringify(valor);
  return texto && texto.length > 120 ? texto.slice(0, 120) + "…" : String(texto);
}
