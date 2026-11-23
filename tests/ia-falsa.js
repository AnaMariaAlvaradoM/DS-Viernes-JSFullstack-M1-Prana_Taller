// Fase 4: una "IA de mentiras" para calificar sin gastar una llave real de OpenAI.
// Se enciende en el puerto 4011 y le dice a TU servidor que le hable a ella (OPENAI_BASE_URL).
// Responde como la API de OpenAI (Responses o Chat Completions) y guarda lo que le pidieron.
// No hace falta que lo modifiques.
import http from "node:http";

const PUERTO_IA = 4011;
export const TEXTO_DE_LA_IA = "¡Bienvenida a Estudio Prana! Te esperamos en tu clase. (texto de prueba del calificador)";

let modo = "ok";
let servidorIa = null;
export const pedidosALaIa = [];

// modo: "ok" responde el texto, "error" responde 500, "llave" responde 401, "vacio" responde un texto vacío
export function modoDeLaIa(nuevo) {
  modo = nuevo;
}

function respuestaResponses(texto, modelo) {
  return {
    id: "resp_calificador",
    object: "response",
    created_at: Math.floor(Date.now() / 1000),
    status: "completed",
    model: modelo || "modelo-de-prueba",
    output: [
      {
        id: "msg_calificador",
        type: "message",
        role: "assistant",
        status: "completed",
        content: [{ type: "output_text", text: texto, annotations: [] }],
      },
    ],
    usage: { input_tokens: 80, output_tokens: 30, total_tokens: 110 },
  };
}

function respuestaChat(texto, modelo) {
  return {
    id: "chatcmpl_calificador",
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: modelo || "modelo-de-prueba",
    choices: [{ index: 0, message: { role: "assistant", content: texto }, finish_reason: "stop" }],
    usage: { prompt_tokens: 80, completion_tokens: 30, total_tokens: 110 },
  };
}

export function encenderIaFalsa() {
  process.env.OPENAI_BASE_URL = `http://localhost:${PUERTO_IA}/v1`;
  process.env.OPENAI_API_KEY = "clave-de-prueba-del-calificador";
  return new Promise((resolve) => {
    servidorIa = http.createServer((req, res) => {
      let cuerpo = "";
      req.on("data", (dato) => (cuerpo += dato));
      req.on("end", () => {
        pedidosALaIa.push({ ruta: req.url, cuerpo });
        res.setHeader("Content-Type", "application/json");
        res.setHeader("x-should-retry", "false");
        if (modo === "error") {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: { message: "La IA de prueba falló a propósito", type: "server_error" } }));
        }
        if (modo === "llave") {
          res.statusCode = 401;
          return res.end(JSON.stringify({ error: { message: "Incorrect API key provided", type: "invalid_request_error", code: "invalid_api_key" } }));
        }
        let modelo = "";
        try {
          modelo = JSON.parse(cuerpo).model;
        } catch {
          modelo = "";
        }
        const texto = modo === "vacio" ? "" : TEXTO_DE_LA_IA;
        const respuesta = req.url.includes("chat/completions") ? respuestaChat(texto, modelo) : respuestaResponses(texto, modelo);
        res.end(JSON.stringify(respuesta));
      });
    });
    servidorIa.listen(PUERTO_IA, resolve);
  });
}

export function apagarIaFalsa() {
  if (servidorIa) servidorIa.close();
}
