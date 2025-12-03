import { defineConfig } from "drizzle-kit";

// Usar Turso en producción, SQLite local en desarrollo
const isProduction = !!process.env.TURSO_DATABASE_URL;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "file:yishaq.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
