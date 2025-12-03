# 🗄️ Arquitectura de Base de Datos - YISHAQ E-commerce

## Diagrama Entidad-Relación

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           ESQUEMA DE BASE DE DATOS                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│      USERS       │         │     SESSIONS     │         │     COUPONS      │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ id (PK)          │◄────────│ user_id (FK)     │         │ id (PK)          │
│ email (UNIQUE)   │         │ id (PK)          │         │ code (UNIQUE)    │
│ password_hash    │         │ expires_at       │         │ discount_type    │
│ first_name       │         │ created_at       │         │ discount_value   │
│ last_name        │         └──────────────────┘         │ minimum_purchase │
│ role             │                                       │ max_uses         │
│ phone            │                                       │ used_count       │
│ address          │                                       │ is_active        │
│ city             │                                       │ starts_at        │
│ postal_code      │                                       │ expires_at       │
│ country          │                                       └──────────────────┘
│ is_active        │
│ email_verified   │         ┌──────────────────┐
│ created_at       │◄────────│     ORDERS       │
│ updated_at       │         ├──────────────────┤
└──────────────────┘         │ id (PK)          │         ┌──────────────────┐
                             │ order_number     │         │   ORDER_ITEMS    │
                             │ user_id (FK)     │         ├──────────────────┤
                             │ status           │◄────────│ order_id (FK)    │
                             │ payment_status   │         │ id (PK)          │
                             │ payment_method   │         │ product_id (FK)  │────────┐
                             │ subtotal         │         │ product_name     │        │
                             │ shipping_cost    │         │ product_image    │        │
                             │ tax              │         │ size             │        │
                             │ discount         │         │ quantity         │        │
                             │ total            │         │ unit_price       │        │
                             │ shipping_*       │         │ total_price      │        │
                             │ tracking_*       │         └──────────────────┘        │
                             │ created_at       │                                     │
                             │ updated_at       │                                     │
                             └──────────────────┘                                     │
                                                                                      │
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐       │
│   CATEGORIES     │         │    PRODUCTS      │         │  PRODUCT_SIZES   │       │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤       │
│ id (PK)          │◄────────│ category_id (FK) │◄────────│ product_id (FK)  │◄──────┘
│ name (UNIQUE)    │         │ id (PK)          │         │ id (PK)          │
│ slug (UNIQUE)    │         │ name             │         │ size_id (FK)     │────────┐
│ description      │         │ slug (UNIQUE)    │         │ stock            │        │
│ image_url        │         │ description      │         └──────────────────┘        │
│ sort_order       │         │ price            │                                     │
│ is_active        │         │ compare_at_price │                                     │
│ created_at       │         │ image_url        │         ┌──────────────────┐        │
└──────────────────┘         │ images           │         │      SIZES       │        │
                             │ stock            │         ├──────────────────┤        │
                             │ low_stock_thresh │         │ id (PK)          │◄───────┘
                             │ sku (UNIQUE)     │         │ name (UNIQUE)    │
                             │ featured         │         │ sort_order       │
                             │ is_active        │         └──────────────────┘
                             │ meta_title       │
                             │ meta_description │
                             │ created_at       │
                             │ updated_at       │
                             └──────────────────┘
```

## 📊 Tablas Detalladas

### 1. `users` - Usuarios del Sistema

| Campo          | Tipo        | Descripción                  |
| -------------- | ----------- | ---------------------------- |
| id             | TEXT (UUID) | Identificador único          |
| email          | TEXT        | Email único del usuario      |
| password_hash  | TEXT        | Hash bcrypt de la contraseña |
| first_name     | TEXT        | Nombre                       |
| last_name      | TEXT        | Apellido                     |
| role           | ENUM        | 'admin' o 'client'           |
| phone          | TEXT        | Teléfono (opcional)          |
| address        | TEXT        | Dirección (opcional)         |
| city           | TEXT        | Ciudad (opcional)            |
| postal_code    | TEXT        | Código postal (opcional)     |
| country        | TEXT        | País (default: México)       |
| is_active      | BOOLEAN     | Cuenta activa                |
| email_verified | BOOLEAN     | Email verificado             |
| created_at     | TIMESTAMP   | Fecha de creación            |
| updated_at     | TIMESTAMP   | Última actualización         |

### 2. `sessions` - Sesiones de Usuario

| Campo      | Tipo        | Descripción                   |
| ---------- | ----------- | ----------------------------- |
| id         | TEXT (UUID) | ID de sesión (también en JWT) |
| user_id    | TEXT (FK)   | Referencia al usuario         |
| expires_at | TIMESTAMP   | Fecha de expiración           |
| created_at | TIMESTAMP   | Fecha de creación             |

### 3. `categories` - Categorías de Productos

| Campo       | Tipo        | Descripción            |
| ----------- | ----------- | ---------------------- |
| id          | TEXT (UUID) | Identificador único    |
| name        | TEXT        | Nombre de la categoría |
| slug        | TEXT        | URL amigable           |
| description | TEXT        | Descripción (opcional) |
| image_url   | TEXT        | Imagen de categoría    |
| sort_order  | INTEGER     | Orden de visualización |
| is_active   | BOOLEAN     | Categoría activa       |
| created_at  | TIMESTAMP   | Fecha de creación      |

### 4. `products` - Productos

| Campo               | Tipo        | Descripción                   |
| ------------------- | ----------- | ----------------------------- |
| id                  | TEXT (UUID) | Identificador único           |
| name                | TEXT        | Nombre del producto           |
| slug                | TEXT        | URL amigable única            |
| description         | TEXT        | Descripción                   |
| price               | REAL        | Precio actual                 |
| compare_at_price    | REAL        | Precio anterior (descuento)   |
| image_url           | TEXT        | Imagen principal              |
| images              | JSON        | Array de imágenes adicionales |
| category_id         | TEXT (FK)   | Referencia a categoría        |
| stock               | INTEGER     | Stock total                   |
| low_stock_threshold | INTEGER     | Umbral de bajo stock          |
| sku                 | TEXT        | Código SKU único              |
| featured            | BOOLEAN     | Producto destacado            |
| is_active           | BOOLEAN     | Producto activo               |
| meta_title          | TEXT        | SEO título                    |
| meta_description    | TEXT        | SEO descripción               |
| created_at          | TIMESTAMP   | Fecha de creación             |
| updated_at          | TIMESTAMP   | Última actualización          |

### 5. `sizes` - Catálogo de Tallas

| Campo      | Tipo        | Descripción                   |
| ---------- | ----------- | ----------------------------- |
| id         | TEXT (UUID) | Identificador único           |
| name       | TEXT        | Nombre (XS, S, M, L, XL, XXL) |
| sort_order | INTEGER     | Orden de visualización        |

### 6. `product_sizes` - Relación Producto-Talla

| Campo      | Tipo        | Descripción                |
| ---------- | ----------- | -------------------------- |
| id         | TEXT (UUID) | Identificador único        |
| product_id | TEXT (FK)   | Referencia al producto     |
| size_id    | TEXT (FK)   | Referencia a la talla      |
| stock      | INTEGER     | Stock específico por talla |

### 7. `orders` - Pedidos

| Campo             | Tipo        | Descripción                     |
| ----------------- | ----------- | ------------------------------- |
| id                | TEXT (UUID) | Identificador único             |
| order_number      | TEXT        | Número de orden (YSQ-YYYY-XXXX) |
| user_id           | TEXT (FK)   | Usuario (nullable para guest)   |
| status            | ENUM        | Estado del pedido               |
| payment_status    | ENUM        | Estado del pago                 |
| payment_method    | TEXT        | Método de pago                  |
| payment_reference | TEXT        | Referencia de pago              |
| subtotal          | REAL        | Subtotal                        |
| shipping_cost     | REAL        | Costo de envío                  |
| tax               | REAL        | Impuestos                       |
| discount          | REAL        | Descuento aplicado              |
| total             | REAL        | Total final                     |
| shipping\_\*      | TEXT        | Datos de envío (snapshot)       |
| tracking_number   | TEXT        | Número de rastreo               |
| tracking_url      | TEXT        | URL de rastreo                  |
| customer_notes    | TEXT        | Notas del cliente               |
| admin_notes       | TEXT        | Notas del admin                 |
| created_at        | TIMESTAMP   | Fecha de creación               |
| updated_at        | TIMESTAMP   | Última actualización            |
| paid_at           | TIMESTAMP   | Fecha de pago                   |
| shipped_at        | TIMESTAMP   | Fecha de envío                  |
| delivered_at      | TIMESTAMP   | Fecha de entrega                |

### 8. `order_items` - Items de Pedido

| Campo         | Tipo        | Descripción                       |
| ------------- | ----------- | --------------------------------- |
| id            | TEXT (UUID) | Identificador único               |
| order_id      | TEXT (FK)   | Referencia al pedido              |
| product_id    | TEXT (FK)   | Referencia al producto (nullable) |
| product_name  | TEXT        | Nombre (snapshot)                 |
| product_image | TEXT        | Imagen (snapshot)                 |
| product_sku   | TEXT        | SKU (snapshot)                    |
| size          | TEXT        | Talla seleccionada                |
| quantity      | INTEGER     | Cantidad                          |
| unit_price    | REAL        | Precio unitario                   |
| total_price   | REAL        | Precio total del item             |

### 9. `coupons` - Cupones de Descuento

| Campo            | Tipo        | Descripción            |
| ---------------- | ----------- | ---------------------- |
| id               | TEXT (UUID) | Identificador único    |
| code             | TEXT        | Código del cupón       |
| description      | TEXT        | Descripción            |
| discount_type    | ENUM        | 'percentage' o 'fixed' |
| discount_value   | REAL        | Valor del descuento    |
| minimum_purchase | REAL        | Compra mínima          |
| max_uses         | INTEGER     | Máximo de usos         |
| used_count       | INTEGER     | Veces usado            |
| is_active        | BOOLEAN     | Cupón activo           |
| starts_at        | TIMESTAMP   | Inicio de validez      |
| expires_at       | TIMESTAMP   | Fin de validez         |
| created_at       | TIMESTAMP   | Fecha de creación      |

## 🔄 Estados de Pedido

```
pending → confirmed → processing → shipped → delivered
    ↓                                    ↓
cancelled                            refunded
```

## 🔐 Sistema de Autenticación

1. **Registro**: Hash de contraseña con bcrypt (12 rounds)
2. **Login**: Verificación de credenciales + creación de sesión
3. **JWT**: Token firmado con HS256, expira en 7 días
4. **Cookie**: HttpOnly, SameSite=Strict, Secure (en producción)
5. **Sesiones**: Almacenadas en BD para invalidación manual

## 📁 Estructura de Archivos

```
src/
├── db/
│   ├── index.ts      # Conexión a SQLite
│   ├── schema.ts     # Definición de tablas (Drizzle ORM)
│   └── seed.ts       # Script de inicialización
├── lib/
│   └── auth.ts       # Lógica de autenticación
├── pages/
│   └── api/
│       ├── auth/
│       │   ├── register.ts
│       │   ├── login.ts
│       │   ├── logout.ts
│       │   └── me.ts
│       └── products/
│           ├── index.ts    # GET productos
│           └── admin.ts    # CRUD admin
└── context/
    └── AuthContext.tsx  # Estado de auth en React
```

## 🚀 Comandos Útiles

```bash
# Inicializar base de datos
npm run db:seed

# Ver datos en Drizzle Studio
npm run db:studio

# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:migrate
```

## 👤 Usuario Admin de Prueba

- **Email**: admin@yishaq.com
- **Contraseña**: Admin123!
