# Fase 3 · Base de datos, validaciones y la regla del cupo

> [!quote] 📧 Correo de la clienta
> **De:** Lucía Ortiz · Estudio Prana Yoga
> **Asunto:** Se borraron las inscripciones
>
> Hola. Ayer en la mañana todas las inscripciones de la semana desaparecieron de la API: nos dijeron que el servidor se había reiniciado.
>
> Necesitamos que lo que se registra no se pierda nunca. Y lo más importante: que el sistema **no deje inscribir a nadie cuando la clase esté llena**. El salón tiene 15 colchonetas y no puede volver a pasar lo de las 18 personas a las 7:00 a. m.
>
> También queremos crear, cambiar y borrar clases nosotras mismas, sin pedírselo a nadie.

En esta fase haces lo mismo que hicimos en clase con Agendia: los datos pasan de los arreglos a **PostgreSQL** con **Prisma**, la API valida lo que recibe (400), aplica la regla de Lucía (409) y responde los errores desde **un solo middleware**. Las rutas y los controladores casi no cambian: ese es el premio de haber separado las capas en la Fase 2.

---

### 0 · Recibe la fase y prepara tu proyecto

1. En tu fork, **Sync fork → Update branch**. En tu computador: `git pull`.
2. Instala lo nuevo (Prisma, el adaptador de PostgreSQL y dotenv ya están en `package.json`):

```bash
npm install
```

3. Crea la base de datos `prana` en PostgreSQL (SQL Shell, igual que creamos `agendia` en la Clase 2):

```sql
CREATE DATABASE prana;
```

4. Crea en la raíz del proyecto el archivo `.env` (no se sube a GitHub: ya está en `.gitignore`), con **tu** contraseña:

```text
DATABASE_URL="postgresql://postgres:TU_CLAVE@localhost:5432/prana"
```

5. Crea también `.env.example` con la misma línea, pero **sin** tu contraseña real (`TU_CLAVE`). Ese sí se sube.

> [!warning] No corras `npx prisma init`
> El repo ya trae `prisma7.config.ts` (la configuración de Prisma del taller) y las dependencias. Tú creas la carpeta `prisma/` a mano, como dice el paso 1.

---

### 1 · Modela la base en `prisma/schema.prisma`

Crea la carpeta `prisma/` y dentro `schema.prisma` con:

- `generator client` con `provider = "prisma-client"` y `output = "../src/generated/prisma"`.
- `datasource db` con `provider = "postgresql"`.
- El modelo **`Clase`** con `id`, `nombre`, `instructora`, `horario`, `cupo` y la lista de sus inscripciones.
- Un **enum** para el estado con `PENDIENTE`, `CONFIRMADA`, `CANCELADA` y `ASISTIO`.
- El modelo **`Inscripcion`** (sin tilde) con `id`, `alumnoNombre`, `alumnoCorreo`, `estado` (empieza en `PENDIENTE`), `claseId` y la relación `@relation(fields: [claseId], references: [id])`.

Una clase tiene muchas inscripciones; cada inscripción pertenece a una sola clase (relación **1 a N**).

Luego, desde la carpeta del proyecto:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

La migración queda en `prisma/migrations/`: **súbela** a GitHub. El cliente generado (`src/generated/prisma`) **no** se sube; cada persona lo genera con `npx prisma generate`.

### 2 · El catálogo nace en la base: `prisma/seed.js`

Crea `prisma/seed.js` que, si la tabla de clases está vacía, cree las **4 clases de la Fase 1** (mismos nombres, instructoras, horarios y cupos). Córrelo con:

```bash
npx prisma db seed
```

Si lo corres dos veces, no debe duplicar las clases.

### 3 · Un solo cliente de Prisma: `src/lib/prisma.js`

Igual que en Agendia: carga el `.env` con `dotenv/config`, crea el adaptador `PrismaPg` con `DATABASE_URL` y exporta **una** instancia de `PrismaClient`.

### 4 · Services con Prisma y CRUD completo del catálogo

Reescribe `clases.service.js` e `inscripciones.service.js` con Prisma (los arreglos desaparecen) y agrega al catálogo:

| Método y ruta | Recibe | Debe responder |
|---|---|---|
| `POST /api/clases` | `{ "nombre", "instructora", "horario", "cupo" }` | **201** y la clase creada |
| `PUT /api/clases/:id` | los mismos cuatro campos | **200** y la clase actualizada, o **404** |
| `DELETE /api/clases/:id` | — | **204**, o **404**. Si la clase tiene inscripciones, **409** |

Todo lo de las fases 1 y 2 debe seguir respondiendo igual.

### 5 · Validaciones: 400 con un mensaje claro

| Caso | Respuesta |
|---|---|
| Inscripción sin `alumnoNombre` o sin `alumnoCorreo` | **400** |
| `alumnoCorreo` sin `@` | **400** |
| `claseId` que no es un número entero positivo (por ejemplo `"abc"`) | **400** |
| `claseId` de una clase que no existe | **404** |
| `PATCH` con un estado que no es uno de los cuatro | **400** |
| `GET /api/clases/abc` (o cualquier id que no sea número) | **400** |
| Clase sin `nombre`, `instructora` u `horario`, o con `cupo` fuera de 1 a 15 | **400** |
| Un cuerpo con JSON mal escrito | **400** en JSON |

Cada error responde `{ "error": "mensaje que dice qué está mal" }`.

### 6 · La regla de Lucía: 409 cuando la clase está llena

Antes de crear una inscripción, cuenta las inscripciones de esa clase que **no** están `CANCELADA`. Si ya son tantas como el `cupo`, responde **409** con un `error` que diga que la clase está llena, y **no guardes nada**. Una inscripción cancelada libera su cupo.

### 7 · Un middleware de errores centralizado

- Los services **lanzan** el error (por ejemplo `throw new ErrorHttp(404, ...)`); los controladores ya no tienen `if` con `res.status(404)`.
- Un archivo en `src/middlewares/` con una función de **cuatro** parámetros `(err, req, res, next)` responde el código y el mensaje.
- `app.js` lo registra con `app.use(...)` **después** de los routers.

### 8 · Revisión entre compañeros

Abre un *issue* en el repositorio del compañero que te asigne la profe, con **dos hallazgos concretos**: qué viste, en qué archivo y qué le sugieres. Sé específico y respetuoso. Esta parte la califica la profe (no es un test).

---

### Cómo es tu proyecto al terminar

```text
taller-prana-api/
├── postman/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── controllers/
│   ├── generated/prisma/      (no se sube)
│   ├── lib/
│   │   └── prisma.js
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── index.js
├── .env                       (no se sube)
├── .env.example
└── prisma7.config.ts          (viene del repo: no lo modifiques)
```

### Cómo pruebas tu nota

1. PostgreSQL encendido, `.env` con tu contraseña, `npx prisma migrate dev`, `npx prisma generate` y `npx prisma db seed` ya corridos.
2. Apaga tu servidor (`Ctrl + C`) y corre `npm test`. Para un solo ejercicio: `npm test -- 14`.
3. Los tests crean clases e inscripciones de prueba y las **borran** al terminar.
4. En GitHub, cada `git push` crea una base vacía, aplica **tus** migraciones, corre **tu** `seed.js` y luego los tests. Por eso tienen que estar en el repo.

### Uso de IA permitido

Nivel 1 (Revisor). Puedes pedirle a la IA que busque casos que no estás cubriendo, por ejemplo: "¿qué datos podrían llegar a este service y romperlo?". Tú decides qué cambias, y debes poder explicar cada línea.

---

> © 2026 Ana Alvarado · Educadora Tech & Desarrolladora Full Stack · Todos los derechos reservados · linkedin.com/in/ana-alvarado-instructora-full-stack
