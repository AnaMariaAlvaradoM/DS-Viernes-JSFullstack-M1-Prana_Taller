# Fase 1 · La base de la API de Estudio Prana

> [!quote] 📧 Correo de la clienta
> **De:** Lucía Ortiz · Estudio Prana Yoga
> **Asunto:** Inscripciones a clases
>
> Hola. Damos clases de yoga con cupos limitados: el salón tiene 15 colchonetas. Las inscripciones las llevamos en una hoja de cálculo y ya nos pasó que llegaron 18 personas a la clase de las 7:00 a. m.
>
> Necesitamos que los alumnos vean las clases (nombre, instructora, horario y cupo) y se inscriban, y que el sistema no deje inscribir a nadie cuando la clase esté llena.

En esta fase construyes lo mismo que hicimos en clase con Agendia, pero para Prana: un servidor con Express que responde el catálogo de clases.

---

### Dónde trabajas

Todo tu código va en `src/index.js`. Es el único archivo que se califica en esta fase.

### Lo que debe responder tu API

| Método y ruta | Debe responder |
|---|---|
| `GET /api/salud` | Código 200 y `{ "estado": "ok", "servicio": "prana-api" }` |
| `GET /api/clases` | Código 200 y un arreglo con **al menos 4 clases** |
| `GET /api/clases/:id` | Código 200 y la clase con ese `id` |
| `GET /api/clases/:id` (si no existe) | Código **404** y un JSON con `error`, por ejemplo `{ "error": "No existe la clase con id 99" }` |

### Cómo es cada clase

Cada clase es un objeto con estos cinco campos, escritos exactamente así:

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id` | número entero, sin repetirse | `1` |
| `nombre` | texto | `"Hatha suave"` |
| `instructora` | texto | `"Lucía Ortiz"` |
| `horario` | texto | `"Lunes 7:00 a. m."` |
| `cupo` | número entero entre 1 y 15 | `15` |

El cupo nunca pasa de 15: es el número de colchonetas del salón.

### Reglas de la fase

- El servidor escucha en el puerto **3000**.
- El mensaje de `error` del 404 incluye el `id` que se pidió.
- Inventa tus propias clases: nombres, instructoras y horarios realistas.

### Cómo pruebas tu nota

1. Apaga tu servidor si lo tienes encendido (`Ctrl + C`): los tests lo encienden solos en el puerto 3000.
2. En la terminal, desde la carpeta del proyecto: `npm test`.

### Uso de IA permitido

Nivel 1 (Revisor): escribe tú el código y pídele a la IA que lo revise. No le pidas que lo genere.

---

> © 2026 Ana Alvarado · Educadora Tech & Desarrolladora Full Stack · Todos los derechos reservados · linkedin.com/in/ana-alvarado-instructora-full-stack
