/**
 * Script de Seed para inicializar la base de datos
 * Ejecutar con: npx tsx src/db/seed.ts
 */

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import * as schema from "./schema";

const sqlite = new Database("yishaq.db");
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite, { schema });

// Helper para generar IDs únicos
function generateId(): string {
  return crypto.randomUUID();
}

// Helper para generar slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seed() {
  console.log("🌱 Iniciando seed de la base de datos...\n");

  // ============================================
  // 1. CREAR TABLAS (SQL directo para SQLite)
  // ============================================
  console.log("📦 Creando tablas...");

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client' CHECK(role IN ('admin', 'client')),
      phone TEXT,
      address TEXT,
      city TEXT,
      postal_code TEXT,
      country TEXT DEFAULT 'México',
      is_active INTEGER NOT NULL DEFAULT 1,
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      compare_at_price REAL,
      image_url TEXT NOT NULL,
      images TEXT,
      category_id TEXT NOT NULL REFERENCES categories(id),
      stock INTEGER NOT NULL DEFAULT 0,
      low_stock_threshold INTEGER NOT NULL DEFAULT 5,
      sku TEXT UNIQUE,
      featured INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      meta_title TEXT,
      meta_description TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sizes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_sizes (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      size_id TEXT NOT NULL REFERENCES sizes(id) ON DELETE CASCADE,
      stock INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
      payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
      payment_method TEXT,
      payment_reference TEXT,
      subtotal REAL NOT NULL,
      shipping_cost REAL NOT NULL DEFAULT 0,
      tax REAL NOT NULL DEFAULT 0,
      discount REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      shipping_first_name TEXT NOT NULL,
      shipping_last_name TEXT NOT NULL,
      shipping_email TEXT NOT NULL,
      shipping_phone TEXT,
      shipping_address TEXT NOT NULL,
      shipping_city TEXT NOT NULL,
      shipping_postal_code TEXT NOT NULL,
      shipping_country TEXT NOT NULL DEFAULT 'México',
      customer_notes TEXT,
      admin_notes TEXT,
      tracking_number TEXT,
      tracking_url TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      paid_at INTEGER,
      shipped_at INTEGER,
      delivered_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL,
      product_image TEXT NOT NULL,
      product_sku TEXT,
      size TEXT,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      discount_type TEXT NOT NULL CHECK(discount_type IN ('percentage', 'fixed')),
      discount_value REAL NOT NULL,
      minimum_purchase REAL DEFAULT 0,
      max_uses INTEGER,
      used_count INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      starts_at INTEGER,
      expires_at INTEGER,
      created_at INTEGER NOT NULL
    );

    -- Índices para mejorar rendimiento
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  // ============================================
  // 2. INSERTAR TALLAS
  // ============================================
  console.log("📏 Insertando tallas...");

  const sizesData = [
    { id: generateId(), name: "XS", sortOrder: 1 },
    { id: generateId(), name: "S", sortOrder: 2 },
    { id: generateId(), name: "M", sortOrder: 3 },
    { id: generateId(), name: "L", sortOrder: 4 },
    { id: generateId(), name: "XL", sortOrder: 5 },
    { id: generateId(), name: "XXL", sortOrder: 6 },
  ];

  for (const size of sizesData) {
    try {
      db.insert(schema.sizes)
        .values({
          id: size.id,
          name: size.name,
          sortOrder: size.sortOrder,
        })
        .run();
    } catch (e) {
      // Ignorar si ya existe
    }
  }

  // Obtener tallas insertadas
  const allSizes = db.select().from(schema.sizes).all();
  const sizeMap = new Map(allSizes.map((s) => [s.name, s.id]));

  // ============================================
  // 3. INSERTAR CATEGORÍAS
  // ============================================
  console.log("📂 Insertando categorías...");

  const categoriesData = [
    {
      name: "Artistas",
      slug: "artistas",
      description: "Camisetas con diseños de artistas urbanos",
      sortOrder: 1,
    },
    {
      name: "Calaveras",
      slug: "calaveras",
      description: "Diseños con temática de calaveras para gym",
      sortOrder: 2,
    },
    {
      name: "Carros Urbanos",
      slug: "carros-urbanos",
      description: "Diseños inspirados en autos deportivos",
      sortOrder: 3,
    },
    {
      name: "Motos",
      slug: "motos",
      description: "Diseños inspirados en motos",
      sortOrder: 4,
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const id = generateId();
    try {
      db.insert(schema.categories)
        .values({
          id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          sortOrder: cat.sortOrder,
          createdAt: new Date(),
        })
        .run();
      categoryMap.set(cat.name, id);
    } catch (e) {
      // Si ya existe, obtener el ID
      const existing = db
        .select()
        .from(schema.categories)
        .where(eq(schema.categories.slug, cat.slug))
        .get();
      if (existing) categoryMap.set(cat.name, existing.id);
    }
  }

  // ============================================
  // 4. INSERTAR PRODUCTOS
  // ============================================
  console.log("👕 Insertando productos...");

  // Productos del ProductContext.tsx original
  const productsData = [
    // Artistas
    {
      name: "Eladio Carrion",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/0.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: true,
    },
    {
      name: "Jhayco Cortez",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/1.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: true,
    },
    {
      name: "Duki SSJ",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/2.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 25,
      featured: true,
    },
    {
      name: "Youngchimi",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/3.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 15,
      featured: false,
    },
    {
      name: "Feid Ferxxo",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/4.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 22,
      featured: true,
    },
    {
      name: "Fuerza Regida",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/5.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 12,
      featured: false,
    },
    {
      name: "Karol G",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/6.jpeg",
      category: "Artistas",
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 30,
      featured: true,
    },
    {
      name: "Mora",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/7.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 16,
      featured: false,
    },
    {
      name: "Natael Cano",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/8.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 14,
      featured: false,
    },
    {
      name: "Peso Pluma",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/9.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 28,
      featured: true,
    },
    {
      name: "Rauw Alejandro",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/10.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "Bad Bunny",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/11.jpeg",
      category: "Artistas",
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 35,
      featured: true,
    },
    {
      name: "Anuel AA",
      description: "Diseño artístico exclusivo.",
      price: 280,
      image: "/artistas/12.jpeg",
      category: "Artistas",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },

    // Calaveras
    {
      name: "Tu Mamá Es Mi Cardio",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/0.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: true,
    },
    {
      name: "NMS Culeros Quien se Tomó Mi Agua",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/1.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 15,
      featured: false,
    },
    {
      name: "Engaño al Musculo Cómo Mi Ex a Mí",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/2.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Hoy Toca Culo y Piernita",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/3.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 22,
      featured: true,
    },
    {
      name: "Hola Brazo De 35 CM Ponte A Entrenar",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/4.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 16,
      featured: false,
    },
    {
      name: "Quien Dijo Que Quería Tener Abdomen",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/5.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 14,
      featured: false,
    },
    {
      name: "No Muestro Mis Gains Porque No Tengo",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/6.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "Así Es Bro, Yo No Pago La Mensualidad",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/7.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Levanto Pesas Porque Culos Ni Uno",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/8.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 25,
      featured: true,
    },
    {
      name: "Seré Virgen Pero Flaco Jamás",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/9.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 22,
      featured: false,
    },
    {
      name: "No Me Des Tips Brazo de ES",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/10.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 16,
      featured: false,
    },
    {
      name: "Ya Te Dije Que Estoy En Volumen",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/11.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "ALV La Dieta, Pura Comida De Mi Jefa",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/12.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Orgullosamente Deudor Del Smart Fit",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/13.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 15,
      featured: false,
    },
    {
      name: "Ábrase Culos, Llegó El Top Global",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/14.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 22,
      featured: false,
    },
    {
      name: "Tranquilo Solo Es Un Ciclo",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/15.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Agárrense Culeros Ya Llego El Top Municipal",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/16.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "Mi Pasión El GYM Mi Debilidad Mamás Solteras",
      description: "Estilo calaverístico único.",
      price: 280,
      image: "/calaveras/17.png",
      category: "Calaveras",
      sizes: ["S", "M", "L", "XL"],
      stock: 25,
      featured: true,
    },

    // Carros Urbanos
    {
      name: "Porsche Type 993",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/0.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 15,
      featured: true,
    },
    {
      name: "Porsche Classic Type 991",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/1.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Porsche Type GT3 RS",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/2.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: true,
    },
    {
      name: "Nissan 370z",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/3.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 16,
      featured: false,
    },
    {
      name: "Nissan K34",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/4.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 14,
      featured: false,
    },
    {
      name: "Nissan Silvia",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/5.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 22,
      featured: false,
    },
    {
      name: "Nissan Silvia K34",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/6.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Toyota Supra MK4",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/7.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 25,
      featured: true,
    },
    {
      name: "Toyota Supra MK4 V2",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/8.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "BMW M3",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/9.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Mazda RX7",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/10.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 15,
      featured: false,
    },
    {
      name: "Mitsubishi Lancer",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/11.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "Mitsubishi Evolution",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/12.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Mitsubishi Evolution V2",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/13.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 16,
      featured: false,
    },
    {
      name: "Volkswagen GTI",
      description: "Diseño urbano inspirado en autos.",
      price: 280,
      image: "/carrosUrbanos/14.jpeg",
      category: "Carros Urbanos",
      sizes: ["S", "M", "L", "XL"],
      stock: 22,
      featured: false,
    },

    // Motos
    {
      name: "Suzuki GSX",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/0.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: true,
    },
    {
      name: "Choppers Classic",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/1.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Honda CBR",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/2.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 25,
      featured: true,
    },
    {
      name: "Honda CBR V2",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/3.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 15,
      featured: false,
    },
    {
      name: "Pulsar NS",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/4.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 22,
      featured: false,
    },
    {
      name: "Suzuki Hayabusa",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/5.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Yamaha R1",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/6.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "Yamaha R6",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/7.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 16,
      featured: false,
    },
    {
      name: "BMW S1000RR",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/8.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 25,
      featured: true,
    },
    {
      name: "BMW Choppers",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/9.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Ducati Panigale",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/10.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 22,
      featured: false,
    },
    {
      name: "Ducati Monster",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/11.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "Honda Africa Twin",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/12.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 15,
      featured: false,
    },
    {
      name: "Husqvarna",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/13.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Kawasaki Ninja",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/14.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 25,
      featured: true,
    },
    {
      name: "Kawasaki Z900",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/15.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "KTM Duke",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/16.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
    {
      name: "Vespa Classic",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/17.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 22,
      featured: false,
    },
    {
      name: "Yamaha MT-09",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/18.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 16,
      featured: false,
    },
    {
      name: "BMW R nineT",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/19.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 20,
      featured: false,
    },
    {
      name: "Yamaha XSR",
      description: "Diseño veloz inspirado en motos.",
      price: 280,
      image: "/motos/20.jpeg",
      category: "Motos",
      sizes: ["S", "M", "L", "XL"],
      stock: 18,
      featured: false,
    },
  ];

  let productCount = 0;
  for (const product of productsData) {
    const productId = generateId();
    const categoryId = categoryMap.get(product.category);

    if (!categoryId) {
      console.error(`Categoría no encontrada: ${product.category}`);
      continue;
    }

    const slug = slugify(product.name);
    const sku = `YSQ-${slug.toUpperCase().slice(0, 8)}-${productCount + 1}`;

    try {
      db.insert(schema.products)
        .values({
          id: productId,
          name: product.name,
          slug: `${slug}-${productCount + 1}`,
          description: product.description,
          price: product.price,
          imageUrl: product.image,
          categoryId,
          stock: product.stock,
          sku,
          featured: product.featured,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .run();

      // Insertar relaciones de tallas
      for (const sizeName of product.sizes) {
        const sizeId = sizeMap.get(sizeName);
        if (sizeId) {
          db.insert(schema.productSizes)
            .values({
              id: generateId(),
              productId,
              sizeId,
              stock: Math.floor(product.stock / product.sizes.length),
            })
            .run();
        }
      }

      productCount++;
    } catch (e) {
      console.error(`Error insertando producto ${product.name}:`, e);
    }
  }

  console.log(`   ✅ ${productCount} productos insertados`);

  // ============================================
  // 5. CREAR USUARIO ADMIN
  // ============================================
  console.log("👤 Creando usuario administrador...");

  const adminId = generateId();
  const adminPassword = hashSync("Admin123!", 12);

  try {
    db.insert(schema.users)
      .values({
        id: adminId,
        email: "admin@yishaq.com",
        passwordHash: adminPassword,
        firstName: "Admin",
        lastName: "YISHAQ",
        role: "admin",
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .run();
    console.log("   ✅ Admin creado: admin@yishaq.com / Admin123!");
  } catch (e) {
    console.log("   ⚠️  Usuario admin ya existe");
  }

  // ============================================
  // 6. CREAR CUPÓN DE EJEMPLO
  // ============================================
  console.log("🎟️  Creando cupón de ejemplo...");

  try {
    db.insert(schema.coupons)
      .values({
        id: generateId(),
        code: "BIENVENIDO10",
        description: "10% de descuento en tu primera compra",
        discountType: "percentage",
        discountValue: 10,
        minimumPurchase: 500,
        maxUses: 100,
        isActive: true,
        createdAt: new Date(),
      })
      .run();
    console.log("   ✅ Cupón BIENVENIDO10 creado");
  } catch (e) {
    console.log("   ⚠️  Cupón ya existe");
  }

  console.log("\n✨ Seed completado exitosamente!");
  console.log("\n📊 Resumen:");
  console.log(`   - ${sizesData.length} tallas`);
  console.log(`   - ${categoriesData.length} categorías`);
  console.log(`   - ${productCount} productos`);
  console.log(`   - 1 usuario admin`);
  console.log(`   - 1 cupón de descuento`);
}

// Ejecutar
seed().catch(console.error);
