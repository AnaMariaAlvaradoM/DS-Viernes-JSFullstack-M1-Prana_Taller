# 🧘 Estudio Prana · Taller de API con calificación automática

**JavaScript AI Fullstack Expert Developer · Dev Senior Code · Módulo 1**

---

## ¿Qué es esto?

### El caso

Estudio Prana es un estudio de yoga con cupos limitados. Lucía, su dueña, necesita una API para que los alumnos vean las clases y se inscriban sin pasarse del cupo. Durante el Módulo 1 vas a construir esa API, fase por fase, aplicando lo mismo que hacemos en clase con Agendia.

### Cómo se califica

Cada vez que subes tu código, GitHub corre unos **tests** sobre tu API y te pone una nota de 0.0 a 5.0 en tu Pull Request. No tienes que esperar a nadie: la nota llega sola en unos minutos.

### ¿Qué es un test?

**Definición técnica:** un test es un programa que ejecuta tu código con datos conocidos y compara lo que responde con lo que debería responder.

**En la vida real:** es como el control de calidad de una fábrica: alguien prueba cada producto con un procedimiento fijo y anota si pasa o no.

Aquí los tests encienden tu servidor, le hacen peticiones (`GET /api/clases`, por ejemplo) y revisan el código de estado y el JSON que responde.

---

## Las fases del taller

El taller crece clase a clase. Cada fase nueva llega a este mismo repositorio y la entregas en el **mismo** Pull Request.

| Fase | Qué construyes | Enunciado |
|---|---|---|
| 1 | Salud de la API, catálogo de clases y clase por id | `enunciados/fase-1.md` |
| 2 | Arquitectura en capas, CRUD de inscripciones y colección de Postman | `enunciados/fase-2.md` |
| 3 | PostgreSQL con Prisma, CRUD de clases, validaciones (400), regla del cupo (409) y errores centralizados | `enunciados/fase-3.md` |
| 4 | Mensaje de bienvenida con IA (OpenAI), fallos de la IA (503), refactor y `PROYECTO.md` | `enunciados/fase-4.md` |

Tu código va en la carpeta `src/` y, desde la Fase 2, tu colección de Postman va en `postman/`. Desde la Fase 3 también entregas `prisma/` (schema, migraciones y seed) y `.env.example`, y en la Fase 4, `PROYECTO.md`. El archivo de arranque siempre es `src/index.js`.

---

## Paso 1 · Fork

### Qué es

**Definición técnica:** un *fork* es una copia de un repositorio de otra persona en tu propia cuenta de GitHub. Puedes cambiarla sin afectar el original.

**En la vida real:** es como fotocopiar el cuaderno de la profe: escribes en tu copia, y el original sigue intacto.

### Cómo hacerlo

1. Abre el enlace del repositorio que te compartió la profe.
2. Arriba a la derecha, clic en **Fork**.
3. Deja el nombre como está y clic en **Create fork**.

### Cómo sabes que quedó bien

Arriba a la izquierda ves **tu-usuario/taller-prana-api** y, debajo, "forked from" con el usuario de la profe.

---

## Paso 2 · Clone

### Qué es

Clonar es descargar **tu** fork a tu computador para trabajar en él.

### Cómo hacerlo

1. En tu fork, clic en el botón verde **Code** y copia la dirección HTTPS. Debe tener **tu** usuario, no el de la profe.
2. Abre Cursor, y luego la terminal con **Terminal → New Terminal**.
3. Ve a la carpeta donde guardas tus proyectos y ejecuta, cambiando la dirección por la tuya:

```bash
git clone https://github.com/TU-USUARIO/taller-prana-api.git
```

4. Entra a la carpeta e instala Express:

```bash
cd taller-prana-api
npm install
```

5. En Cursor: **File → Open Folder** y eliges `taller-prana-api`.

---

## Paso 3 · Resolver

### Dónde escribes

En la carpeta `src/` (en la Fase 1, todo en `src/index.js`; desde la Fase 2, repartido en capas) y, desde la Fase 2, la colección en `postman/`. Lee primero el enunciado de la fase en la carpeta `enunciados/`.

### Las tres reglas de oro

1. **El servidor escucha en el puerto 3000.** Los tests lo buscan ahí.
2. **Respeta los nombres exactos** de las rutas y de los campos (`/api/clases`, `instructora`, `cupo`…). Un campo mal escrito es un test que falla.
3. **Toda ruta termina respondiendo** con `res.json(...)`. Si una ruta no responde, el test espera 3 segundos y falla.

### La forma general (no resuelve ninguna fase)

Así se ve una ruta cualquiera en Express. Tú decides cuáles crear y qué responden:

```javascript
app.get('/api/ejemplo', (req, res) => {
  res.json({ mensaje: 'hola' });
});
```

Mientras trabajas, puedes encender tu servidor con `npm run dev` y probarlo en el navegador.

---

## Paso 4 · Probar la nota en tu computador

### Antes de probar

**Apaga tu servidor** (`Ctrl + C` en la terminal donde corre `npm run dev`). Los tests encienden su propia copia en el puerto 3000, y si el puerto está ocupado no pueden.

### Todos los ejercicios

```bash
npm test
```

### Solo uno (por ejemplo, el 02)

```bash
npm test -- 02
```

### Cómo leer el resultado

- ✅ todos los tests de ese ejercicio pasan.
- 🟡 pasan algunos: lee los mensajes con `→`, dicen qué falta.
- ❌ no pasa ninguno.

Al final aparece tu nota: `🎯 Nota: 5.0 / 5.0`.

---

## Paso 5 · Subir tu código

```bash
git add .
git commit -m "feat: fase 1 de la API de Prana"
git push
```

- `git add .` pone tus cambios en la caja.
- `git commit -m "..."` cierra la caja y le pone una etiqueta.
- `git push` envía la caja a tu fork en GitHub.

---

## Paso 6 · Pull Request (solo UNO en todo el taller)

### Qué es

**Definición técnica:** un *Pull Request* (PR) es una solicitud para que el dueño de un repositorio revise los cambios de tu fork.

**En la vida real:** es como radicar un documento en una oficina: queda registrado con tu nombre y te responden sobre él.

### Cómo hacerlo

1. En tu fork, clic en **Contribute → Open pull request**.
2. Revisa que vaya de **tu-usuario/taller-prana-api** hacia el repositorio de la profe.
3. **Título:** tu nombre completo.
4. Clic en **Create pull request**.

Abres el PR **una sola vez**. Las fases siguientes se entregan con `git push` sobre el mismo PR.

---

## Paso 7 · Ver tu nota

- En unos minutos aparece un **comentario** en tu PR con la nota y una tabla por ejercicio.
- La **etiqueta** `Nota X.X` también muestra la nota en la lista de PRs.
- El enlace **Ver qué falta por corregir** muestra cada test que falló y por qué.
- Para subir la nota: corrige, prueba con `npm test` y vuelve a hacer `git push`. La nota se actualiza sola.

### Ojo con la fecha límite

Después de la fecha de cierre, los `git push` ya no cambian la nota. Si tu primera entrega llega tarde, el PR queda con la etiqueta `⏰ Fuera de plazo`.

### Cuando llega una fase nueva

1. En tu fork, clic en **Sync fork → Update branch**.
2. En tu computador: `git pull`.
3. Lee el enunciado nuevo en `enunciados/`. Tu nota cuenta todas las fases publicadas hasta ese momento.

---

## Archivos que NO debes modificar

`tests/`, `scripts/`, `.github/`, `enunciados/`, `package.json`, `package-lock.json` y `prisma7.config.ts`.

Si los modificas, tu PR queda con la etiqueta `⚠️ Revisar` y la profe lo revisa a mano. La nota se calcula igual, con los tests originales: cambiarlos no sube la nota.

---

## Errores frecuentes

### "npm no se reconoce como un comando"

Node.js no está instalado o la terminal se abrió antes de instalarlo. Instala la versión LTS desde nodejs.org y abre una terminal nueva.

### "No encuentro Express: corre npm install"

Te faltó `npm install` en la carpeta del proyecto.

### "El puerto 3000 ya está ocupado"

Tu servidor sigue encendido en otra terminal. Apágalo con `Ctrl + C` y vuelve a correr `npm test`.

### "Tu servidor se apagó apenas arrancó"

Te falta `app.listen(3000, ...)`: sin él, el programa crea la aplicación y termina.

### "no respondió en 3 segundos"

Esa ruta no termina respondiendo: revisa que tenga `res.json(...)`.

### "Hay un error de sintaxis (SyntaxError) en src/index.js:18"

Revisa esa línea y las de arriba: paréntesis, llaves o comillas sin cerrar.

### "debería responder 200 (respondió 404: tu ruta dice que no existe…)"

El `id` llega como texto en la URL. Conviértelo con `Number(...)` antes de comparar.

### "respondió 500: tu servidor falló al leer el cuerpo"

Te falta `app.use(express.json())` en `src/app.js`, antes de las rutas. Sin esa línea, `req.body` llega vacío.

### "src/index.js solo enciende el servidor"

Moviste el código a capas, pero dejaste rutas o `app.use` en `src/index.js`. Pásalos a `src/app.js` y a `src/routes/`.

### "No encuentro tu colección"

Exporta desde Postman como **Collection v2.1** y guarda el archivo `.json` dentro de la carpeta `postman/` del proyecto.

### "Falta el cliente de Prisma: corre npx prisma generate"

El cliente de Prisma no se sube a GitHub: se genera en tu computador. Corre `npx prisma generate` en la carpeta del proyecto (y otra vez cada vez que cambies `schema.prisma`).

### "respondió 500" en los ejercicios de la Fase 3

Tu API no pudo hablar con la base. Revisa que PostgreSQL esté encendido, que `.env` tenga tu `DATABASE_URL` con la contraseña correcta y que hayas corrido `npx prisma migrate dev` y `npx prisma db seed`.

### "GET /api/clases debería traer al menos 4 clases"

La tabla de clases está vacía: corre `npx prisma db seed`. En GitHub lo corre solo, pero necesita tu `prisma/seed.js`.

### "Please tell me who you are" al hacer commit

Configura Git una sola vez:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

### "debería responder 503 (respondió 500…)" en la Fase 4

El error de la IA llegó sin atrapar al middleware. En `ia.service.js`, envuelve la llamada en `try/catch` y lanza `new ErrorHttp(503, '...')`.

### "Lo que le enviaste a la IA debería incluir…"

Los datos del prompt deben salir de la base (la inscripción y su clase), no estar escritos a mano en el código.

### "Encontré algo que parece una llave real de OpenAI"

Tu llave quedó en el código o en `.env.example`. Muévela a `.env`, cámbiala en platform.openai.com y sube el cambio.

### Error 403 al hacer push

Clonaste el repositorio de la profe en vez de tu fork. Clona otra vez desde **tu** fork (Paso 2).

---

> © 2026 Ana Alvarado · Educadora Tech & Desarrolladora Full Stack · Todos los derechos reservados · linkedin.com/in/ana-alvarado-instructora-full-stack
