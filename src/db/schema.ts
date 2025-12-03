/**
 * Esquema de Base de Datos para YISHAQ E-commerce
 *
 * Arquitectura relacional completa con:
 * - Users (autenticación y roles)
 * - Categories (normalización de categorías)
 * - Products (productos con FK a categorías)
 * - ProductSizes (relación many-to-many para tallas)
 * - Orders (pedidos de clientes)
 * - OrderItems (items de cada pedido)
 * - Sessions (manejo de sesiones de usuario)
 */

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ============================================
// TABLA: USERS
// ============================================
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // UUID
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role", { enum: ["admin", "client"] })
    .notNull()
    .default("client"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country").default("México"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ============================================
// TABLA: SESSIONS (para manejo de JWT/cookies)
// ============================================
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // UUID del token
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ============================================
// TABLA: CATEGORIES
// ============================================
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ============================================
// TABLA: PRODUCTS
// ============================================
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  compareAtPrice: real("compare_at_price"), // Precio anterior (para descuentos)
  imageUrl: text("image_url").notNull(),
  images: text("images", { mode: "json" }).$type<string[]>(), // Imágenes adicionales
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  stock: integer("stock").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  sku: text("sku").unique(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ============================================
// TABLA: SIZES (catálogo de tallas)
// ============================================
export const sizes = sqliteTable("sizes", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(), // XS, S, M, L, XL, XXL
  sortOrder: integer("sort_order").notNull().default(0),
});

// ============================================
// TABLA INTERMEDIA: PRODUCT_SIZES
// ============================================
export const productSizes = sqliteTable("product_sizes", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sizeId: text("size_id")
    .notNull()
    .references(() => sizes.id, { onDelete: "cascade" }),
  stock: integer("stock").notNull().default(0), // Stock específico por talla
});

// ============================================
// TABLA: ORDERS (Pedidos)
// ============================================
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(), // YSQ-2024-0001
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }), // Puede ser null para guest checkout

  // Estado del pedido
  status: text("status", {
    enum: [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ],
  })
    .notNull()
    .default("pending"),

  // Información de pago
  paymentStatus: text("payment_status", {
    enum: ["pending", "paid", "failed", "refunded"],
  })
    .notNull()
    .default("pending"),
  paymentMethod: text("payment_method"),
  paymentReference: text("payment_reference"),

  // Totales
  subtotal: real("subtotal").notNull(),
  shippingCost: real("shipping_cost").notNull().default(0),
  tax: real("tax").notNull().default(0),
  discount: real("discount").notNull().default(0),
  total: real("total").notNull(),

  // Dirección de envío (snapshot al momento de la compra)
  shippingFirstName: text("shipping_first_name").notNull(),
  shippingLastName: text("shipping_last_name").notNull(),
  shippingEmail: text("shipping_email").notNull(),
  shippingPhone: text("shipping_phone"),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingPostalCode: text("shipping_postal_code").notNull(),
  shippingCountry: text("shipping_country").notNull().default("México"),

  // Notas y tracking
  customerNotes: text("customer_notes"),
  adminNotes: text("admin_notes"),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  paidAt: integer("paid_at", { mode: "timestamp" }),
  shippedAt: integer("shipped_at", { mode: "timestamp" }),
  deliveredAt: integer("delivered_at", { mode: "timestamp" }),
});

// ============================================
// TABLA: ORDER_ITEMS (Items de cada pedido)
// ============================================
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, {
    onDelete: "set null",
  }),

  // Snapshot del producto al momento de la compra
  productName: text("product_name").notNull(),
  productImage: text("product_image").notNull(),
  productSku: text("product_sku"),

  size: text("size"),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  totalPrice: real("total_price").notNull(),
});

// ============================================
// TABLA: COUPONS (Cupones de descuento)
// ============================================
export const coupons = sqliteTable("coupons", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type", {
    enum: ["percentage", "fixed"],
  }).notNull(),
  discountValue: real("discount_value").notNull(),
  minimumPurchase: real("minimum_purchase").default(0),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  startsAt: integer("starts_at", { mode: "timestamp" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ============================================
// RELACIONES (para queries con joins)
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  sizes: many(productSizes),
  orderItems: many(orderItems),
}));

export const sizesRelations = relations(sizes, ({ many }) => ({
  products: many(productSizes),
}));

export const productSizesRelations = relations(productSizes, ({ one }) => ({
  product: one(products, {
    fields: [productSizes.productId],
    references: [products.id],
  }),
  size: one(sizes, {
    fields: [productSizes.sizeId],
    references: [sizes.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// ============================================
// TIPOS EXPORTADOS
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type Session = typeof sessions.$inferSelect;
