/**
 * Conexión a la Base de Datos con Drizzle ORM
 *
 * - Producción (Vercel): Usa Turso (LibSQL en la nube)
 * - Desarrollo local: Usa SQLite local con better-sqlite3
 */

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Determinar si estamos en producción o desarrollo
const isProduction =
  process.env.NODE_ENV === "production" || process.env.TURSO_DATABASE_URL;

// Cliente de LibSQL (Turso en producción, SQLite local en desarrollo)
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:yishaq.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Crear instancia de Drizzle con el esquema
export const db = drizzle(client, { schema });

// Exportar el esquema para uso en queries
export * from "./schema";
