# Fase 2 · Arquitectura en capas e inscripciones

> [!quote] 📧 Correo de la clienta
> **De:** Lucía Ortiz · Estudio Prana Yoga
> **Asunto:** Ya vemos las clases, ¿y las inscripciones?
>
> Hola. Ya podemos ver el catálogo de clases desde cualquier celular, gracias.
>
> Ahora necesitamos registrar las inscripciones: quién se inscribe, a qué clase y con qué correo. Cada inscripción empieza pendiente y la confirmamos cuando la persona paga. Si alguien cancela, la marcamos como cancelada, y a veces hay que borrar una que se registró por error.

En esta fase haces lo mismo que hicimos en clase con las citas de Agendia, pero para Prana: organizas el proyecto en capas y construyes el CRUD de las **inscripciones**, todavía en memoria.

---

### 1 · Organiza el proyecto en capas

Tu proyecto debe quedar así:

```text
taller-prana-api/
├── postman/
│   └── prana-api.postman_collection.json
└── src/
    ├── controllers/
    │   ├── clases.controller.js
    │   └── inscripciones.controller.js
    ├── routes/
    │   ├── clases.routes.js
    │   └── inscripciones.routes.js
    ├── services/
    │   ├── clases.service.js
    │   └── inscripciones.service.js
    ├── app.js
    └── index.js
```

| Archivo | Qué hace |
|---|---|
| `src/app.js` | Crea la aplicación con `express()`, agrega `app.use(express.json())`, deja `GET /api/salud` y conecta los routers con `app.use(...)`. Termina con `export default app`. |
| `src/index.js` | Solo importa la app (`import app from './app.js'`) y la enciende con `app.listen(3000, ...)`. No tiene rutas. |
| `src/routes/` | Cada archivo crea un `Router()` de Express y dice qué función atiende cada método y ruta. |
| `src/controllers/` | Reciben la petición, llaman al service y responden con el código correcto. No guardan datos. |
| `src/services/` | Guardan los datos en memoria y aplican las reglas (por ejemplo, el estado inicial). |

Los endpoints del catálogo de la Fase 1 se mudan a `clases.routes.js`, `clases.controller.js` y `clases.service.js`, y deben seguir respondiendo **exactamente igual**.

### 2 · Construye el CRUD de inscripciones

| Método y ruta | Recibe | Debe responder |
|---|---|---|
| `POST /api/inscripciones` | `{ "claseId": 2, "alumnoNombre": "Daniela Vargas", "alumnoCorreo": "daniela.vargas@correo.com" }` | **201** y la inscripción creada |
| `GET /api/inscripciones` | — | **200** y el arreglo de inscripciones |
| `GET /api/inscripciones/:id` | — | **200** y la inscripción, o **404** con `error` |
| `PATCH /api/inscripciones/:id` | `{ "estado": "CONFIRMADA" }` | **200** y la inscripción con el estado nuevo, o **404** con `error` |
| `DELETE /api/inscripciones/:id` | — | **204** sin cuerpo, o **404** con `error` |

### Cómo es cada inscripción

| Campo | Tipo | Quién lo pone |
|---|---|---|
| `id` | número entero, sin repetirse | El service (empieza en 1 y aumenta) |
| `claseId` | número | Llega en el cuerpo del `POST`: es el `id` de la clase |
| `alumnoNombre` | texto | Llega en el cuerpo del `POST` |
| `alumnoCorreo` | texto | Llega en el cuerpo del `POST` |
| `estado` | texto | El service: toda inscripción nueva empieza en `"PENDIENTE"` |

Los estados posibles son `PENDIENTE`, `CONFIRMADA`, `CANCELADA` y `ASISTIO`. En esta fase el `PATCH` guarda el estado que llegue; en la Fase 3 validaremos que sea uno de esos cuatro.

### 3 · Exporta tu colección de Postman

1. En Postman, crea una colección llamada **Prana API** con una petición por cada endpoint de inscripciones (al menos 5).
2. Pruébalas en orden: crear, listar, ver una, confirmar y eliminar.
3. Clic en los tres puntos de la colección → **Export** → **Collection v2.1** → guárdala en la carpeta `postman/` de tu proyecto.

### Reglas de la fase

- El servidor sigue arrancando desde `src/index.js` y escucha en el puerto **3000**.
- Los datos viven en los services, no en las rutas ni en los controladores.
- El mensaje de `error` de los 404 incluye el `id` que se pidió.
- No valides los datos todavía: las validaciones (400) y la regla del cupo (409) llegan en la Fase 3.

### Cómo pruebas tu nota

1. Apaga tu servidor si lo tienes encendido (`Ctrl + C`).
2. Desde la carpeta del proyecto: `npm test`. Para ver solo un ejercicio: `npm test -- 05`.
3. Los ejercicios de la Fase 1 (01 a 03) siguen contando: después de mover el código, deben seguir en ✅.

### Uso de IA permitido

Nivel 1 (Revisor): escribe tú el código y pídele a la IA que lo revise. Una buena pregunta: "¿mi controlador tiene alguna lógica que debería estar en el service?". No le pidas que lo genere.

---

> © 2026 Ana Alvarado · Educadora Tech & Desarrolladora Full Stack · Todos los derechos reservados · linkedin.com/in/ana-alvarado-instructora-full-stack
