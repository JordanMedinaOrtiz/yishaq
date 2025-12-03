/**
 * Script para migrar datos de SQLite local a Turso
 * Ejecutar con: npx tsx scripts/migrate-to-turso.ts
 */

import Database from "better-sqlite3";
import { createClient } from "@libsql/client";

// Configuración
const LOCAL_DB_PATH = "yishaq.db"; // DB local
const TURSO_URL = process.env.TURSO_DATABASE_URL!;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN!;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error("❌ Configura TURSO_DATABASE_URL y TURSO_AUTH_TOKEN");
  process.exit(1);
}

// Conectar a ambas DBs
const localDb = new Database(LOCAL_DB_PATH);
const tursoClient = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

// Tablas a migrar (en orden por dependencias de FK)
const TABLES = [
  "users",
  "sessions",
  "categories",
  "sizes",
  "products",
  "product_sizes",
  "orders",
  "order_items",
  "coupons",
];

async function migrateTable(tableName: string) {
  console.log(`\n📦 Migrando tabla: ${tableName}`);

  // Obtener todos los registros de la tabla local
  const rows = localDb.prepare(`SELECT * FROM ${tableName}`).all();

  if (rows.length === 0) {
    console.log(`   ⏭️  Tabla vacía, saltando...`);
    return 0;
  }

  console.log(`   📊 Encontrados ${rows.length} registros`);

  let inserted = 0;
  let skipped = 0;

  for (const row of rows) {
    const columns = Object.keys(row as object);
    const values = Object.values(row as object);
    const placeholders = columns.map(() => "?").join(", ");

    const sql = `INSERT OR IGNORE INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (${placeholders})`;

    try {
      const result = await tursoClient.execute({
        sql,
        args: values as any[],
      });
      if (result.rowsAffected > 0) {
        inserted++;
      } else {
        skipped++;
      }
    } catch (error: any) {
      if (error.message?.includes("UNIQUE constraint")) {
        skipped++;
      } else {
        console.error(`   ❌ Error en registro:`, error.message);
      }
    }
  }

  console.log(
    `   ✅ Insertados: ${inserted}, Saltados (ya existían): ${skipped}`
  );
  return inserted;
}

async function main() {
  console.log("🚀 Iniciando migración de SQLite local a Turso...\n");
  console.log(`📂 DB Local: ${LOCAL_DB_PATH}`);
  console.log(`☁️  Turso: ${TURSO_URL}\n`);

  let totalInserted = 0;

  for (const table of TABLES) {
    try {
      const inserted = await migrateTable(table);
      totalInserted += inserted;
    } catch (error: any) {
      console.error(`❌ Error migrando ${table}:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✨ Migración completada!`);
  console.log(`📊 Total de registros nuevos insertados: ${totalInserted}`);

  localDb.close();
}

main().catch(console.error);
