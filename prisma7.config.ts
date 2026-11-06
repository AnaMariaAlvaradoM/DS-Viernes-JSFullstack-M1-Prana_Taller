// Configuración de Prisma del taller (no la modifiques: viene del repo de la profe).
// Lee DATABASE_URL de tu archivo .env y usa tu prisma/schema.prisma, tus migraciones y tu prisma/seed.js.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
