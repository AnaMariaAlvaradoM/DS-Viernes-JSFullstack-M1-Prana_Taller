# Fase 4 · IA en el negocio y entrega final

> [!quote] 📧 Correo de la clienta
> **De:** Lucía Ortiz · Estudio Prana Yoga
> **Asunto:** Los mensajes de bienvenida
>
> Hola. Cada vez que alguien se inscribe, le escribo a mano un mensaje de bienvenida con su clase, la instructora y la hora. Con 15 colchonetas por clase, eso es mucho tiempo.
>
> ¿La API puede redactar ese mensaje por mí? Yo lo leo antes de enviarlo. Eso sí: que no invente promociones ni horarios, y que si la inteligencia artificial falla, lo demás siga funcionando.

En esta fase haces lo mismo que hicimos en clase con Agendia: un endpoint que busca los datos **reales** en la base, arma un **prompt** con rol, tarea, límites y formato, le pide el texto a la API de OpenAI y responde **503** si la IA no contesta, sin que se caiga el resto de la API. Al final, entregas el proyecto documentado.

---

### 0 · Recibe la fase y prepara tu proyecto

1. En tu fork, **Sync fork → Update branch**. En tu computador: `git pull`.
2. Instala lo nuevo (el SDK oficial `openai` ya está en `package.json`):

```bash
npm install
```

3. Agrega a tu `.env` (que no se sube) tu llave y el modelo:

```text
OPENAI_API_KEY="tu llave real"
OPENAI_MODEL="gpt-6-luna"
```

4. Agrega esas mismas dos variables a `.env.example`, **sin** tu llave real (por ejemplo `OPENAI_API_KEY="tu-llave-de-openai"`). Ese sí se sube.

> [!warning] Tu llave es como la clave de una tarjeta
> Nunca la escribas en el código, ni en `.env.example`, ni en `PROYECTO.md`, ni la pegues en un chat. Si la subes a GitHub por error, bórrala en platform.openai.com y crea otra: borrar el commit no basta.

> [!note] Si no tienes llave
> Los tests **no** usan tu llave: traen una "IA de mentiras" que responde como OpenAI. Puedes sacar 5.0 sin llave. La necesitas solo para ver mensajes reales en Postman.

---

### 1 · El servicio de IA: `src/services/ia.service.js`

Igual que en Agendia:

- Trae el SDK con `import OpenAI from 'openai';`.
- Crea el cliente **dentro** de la función que llama a la IA, con `new OpenAI({ timeout: 15 * 1000, maxRetries: 1 })`. La llave la lee sola de `OPENAI_API_KEY`.
- Pide el texto con `cliente.responses.create({ model, instructions, input })` y usa `respuesta.output_text`.
- El modelo sale de `process.env.OPENAI_MODEL`, con `'gpt-6-luna'` si no está.
- Usa `inscripcionesService.buscarPorId(...)` y `clasesService.buscarPorId(...)` para traer los datos: así el 400 y el 404 salen solos.

### 2 · El prompt

Las **instrucciones** (`instructions`) dicen, en líneas separadas:

| Pieza | Qué dice |
|---|---|
| Rol | Quién es el asistente (de Estudio Prana) |
| Tarea | Qué escribe: el mensaje de bienvenida de un alumno recién inscrito |
| Límites | Usar solo los datos entregados; no inventar precios, promociones ni horarios |
| Formato | Largo, idioma, tono |

Los **datos** (`input`) van aparte y salen de la base: nombre del alumno, nombre de la clase, instructora y horario.

### 3 · El endpoint

| Método y ruta | Debe responder |
|---|---|
| `POST /api/ia/inscripciones/:id/bienvenida` | **200** con `{ "inscripcionId", "correo", "mensaje" }` |
| … con un id que no es número | **400** |
| … con una inscripción que no existe | **404** (sin llamar a la IA) |
| … con una inscripción `CANCELADA` | **409** (sin llamar a la IA) |
| … si la IA falla, rechaza la llave o devuelve un texto vacío | **503** con `{ "error": "mensaje claro" }` |

Organízalo en capas: `src/routes/ia.routes.js`, `src/controllers/ia.controller.js` (sin `openai` adentro) y `app.use('/api/ia', ...)` en `src/app.js`, **antes** del middleware de errores.

### 4 · Cuando la IA falla

- Atrapa el error de la IA con `try/catch` y lánzalo como `new ErrorHttp(503, '...')`. El middleware de errores de la Fase 3 lo responde.
- Si `output_text` llega vacío, también es un fallo (503).
- Después de un fallo de la IA, el resto de la API (salud, clases, inscripciones) sigue respondiendo.

### 5 · Refactor final

- Aplica lo que te señaló tu compañero en el *issue* de la Fase 3.
- Quita código duplicado, comentado o que no se usa.
- Revisa que cada capa haga una sola cosa: rutas reciben, controladores responden, services deciden.

### 6 · `PROYECTO.md`

Crea en la raíz del proyecto un archivo `PROYECTO.md` con estas secciones (los títulos deben decir esas palabras):

1. `## Qué problema resuelve`: dos o tres frases sobre Estudio Prana y la API.
2. `## Cómo instalarlo y correrlo`: los pasos desde cero, con `npm install`, `npx prisma migrate dev` y `npm run dev`.
3. `## Variables de entorno`: qué es `DATABASE_URL`, qué es `OPENAI_API_KEY` (y `OPENAI_MODEL`), **sin valores reales**.
4. `## Endpoints`: una tabla con método, ruta y qué hace cada uno, incluido el de la IA.
5. `## Prompt`: tus instrucciones tal cual y por qué las armaste así.

No cambies el `README.md` del repo: ese es la guía del taller.

---

### Cómo es tu proyecto al terminar

```text
taller-prana-api/
├── postman/
├── prisma/
├── src/
│   ├── controllers/
│   │   └── ia.controller.js      ← nuevo
│   ├── routes/
│   │   └── ia.routes.js          ← nuevo
│   ├── services/
│   │   └── ia.service.js         ← nuevo
│   └── app.js                    ← monta /api/ia
├── .env                          (no se sube: aquí va tu llave)
├── .env.example                  ← con OPENAI_API_KEY sin valor real
└── PROYECTO.md                   ← nuevo
```

### Cómo pruebas tu nota

1. Lo de la Fase 3 sigue igual: PostgreSQL encendido y la base migrada.
2. Apaga tu servidor (`Ctrl + C`) y corre `npm test`. Solo la IA: `npm test -- 17`.
3. Los tests encienden una IA de prueba en el puerto **4011** y le dicen a tu servidor que le hable a ella: no gastan tu llave. Por eso usa el SDK oficial `openai` (lee `OPENAI_API_KEY` y `OPENAI_BASE_URL` solo) y no le pases una dirección propia.
4. Entrega final: **viernes 20 de noviembre**, en el mismo Pull Request.

### Uso de IA permitido

Nivel 2 (Copiloto). Puedes pedirle a la IA el código repetitivo (la ruta y el controlador a partir de los que ya tienes), pero debes poder explicar cada línea. El prompt y la decisión de cuándo responder 503 o 409 son tuyos.

---

> © 2026 Ana Alvarado · Educadora Tech & Desarrolladora Full Stack · Todos los derechos reservados · linkedin.com/in/ana-alvarado-instructora-full-stack
