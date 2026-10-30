// Ayuda para los tests de estructura: lee tu código (sin comentarios) para revisar cómo lo organizaste.
// No hace falta que lo modifiques.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export function existe(rutaRelativa) {
  return fs.existsSync(path.join(RAIZ, rutaRelativa));
}

export function codigoSinComentarios(rutaRelativa) {
  const ruta = path.join(RAIZ, rutaRelativa);
  if (!fs.existsSync(ruta)) return "";
  return fs.readFileSync(ruta, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

// Lista los archivos con cierta extensión de una carpeta (ruta relativa al proyecto). Si no existe, devuelve [].
export function archivosDe(carpeta, extension = ".js") {
  const ruta = path.join(RAIZ, carpeta);
  if (!fs.existsSync(ruta) || !fs.statSync(ruta).isDirectory()) return [];
  return fs.readdirSync(ruta).filter((f) => f.endsWith(extension)).map((f) => path.posix.join(carpeta, f));
}
