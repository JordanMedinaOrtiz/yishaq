/**
 * API Endpoint: Procesar Checkout
 * POST /api/checkout
 *
 * Recibe los datos del carrito y crea una orden en la base de datos
 */

import type { APIRoute } from "astro";
import {
  db,
  orders,
  orderItems,
  products,
  productSizes,
  users,
} from "../../db";
import { validateSession, getTokenFromCookie } from "../../lib/auth";
import { eq } from "drizzle-orm";

// Tipos para el request
interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    postalCode: string;
    country?: string;
  };
  paymentMethod: "card" | "oxxo" | "transfer";
  customerNotes?: string;
}

// Generar número de orden único
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `YSQ-${year}-${timestamp}${random}`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Verificar autenticación (opcional - permitir guest checkout)
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);
    let userId: string | null = null;

    if (token) {
      const user = await validateSession(token);
      if (user) {
        userId = user.id;
      }
    }

    // 2. Parsear body
    const body: CheckoutRequest = await request.json();
    const { items, shippingInfo, paymentMethod, customerNotes } = body;

    // 3. Validaciones básicas
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "El carrito está vacío" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (
      !shippingInfo ||
      !shippingInfo.firstName ||
      !shippingInfo.email ||
      !shippingInfo.address
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Información de envío incompleta",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (
      !paymentMethod ||
      !["card", "oxxo", "transfer"].includes(paymentMethod)
    ) {
      return new Response(
        JSON.stringify({ success: false, error: "Método de pago inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Verificar stock y calcular totales
    let subtotal = 0;
    const validatedItems: Array<CheckoutItem & { productData: any }> = [];

    for (const item of items) {
      // Log para debugging
      console.log(`[Checkout] Buscando producto con ID: "${item.productId}"`);

      // Obtener producto de la BD (async con libsql)
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId));

      if (!product) {
        console.error(
          `[Checkout] Producto NO encontrado. ID buscado: "${item.productId}", Nombre: "${item.name}"`
        );
        return new Response(
          JSON.stringify({
            success: false,
            error: `Producto no encontrado: ${item.name}`,
            debug: {
              searchedId: item.productId,
              productName: item.name,
              hint: "Verifica que el productId sea el UUID correcto de la base de datos",
            },
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log(
        `[Checkout] Producto encontrado: "${product.name}" (ID: ${product.id})`
      );

      if (!product.isActive) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Producto no disponible: ${item.name}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (product.stock < item.quantity) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Stock insuficiente para ${item.name}. Disponible: ${product.stock}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Usar el precio de la BD (no confiar en el cliente)
      subtotal += product.price * item.quantity;
      validatedItems.push({
        ...item,
        price: product.price,
        productData: product,
      });
    }

    // 5. Calcular totales
    const shippingCost = subtotal >= 1000 ? 0 : 99; // Envío gratis arriba de $1000
    const tax = 0; // Impuestos ya incluidos en precio
    const discount = 0; // TODO: Implementar cupones
    const total = subtotal + shippingCost + tax - discount;

    // 6. Crear la orden (async con libsql)
    const orderId = crypto.randomUUID();
    const orderNumber = generateOrderNumber();
    const now = new Date();

    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      userId,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      shippingFirstName: shippingInfo.firstName,
      shippingLastName: shippingInfo.lastName || "",
      shippingEmail: shippingInfo.email,
      shippingPhone: shippingInfo.phone || null,
      shippingAddress: shippingInfo.address,
      shippingCity: shippingInfo.city,
      shippingPostalCode: shippingInfo.postalCode,
      shippingCountry: shippingInfo.country || "México",
      customerNotes: customerNotes || null,
      createdAt: now,
      updatedAt: now,
    });

    // 7. Crear los items de la orden y actualizar stock
    for (const item of validatedItems) {
      // Insertar item de orden (async con libsql)
      await db.insert(orderItems).values({
        id: crypto.randomUUID(),
        orderId,
        productId: item.productId,
        productName: item.productData.name,
        productImage: item.productData.imageUrl,
        productSku: item.productData.sku,
        size: item.size || null,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      });

      // Actualizar stock del producto (async con libsql)
      await db
        .update(products)
        .set({
          stock: item.productData.stock - item.quantity,
          updatedAt: now,
        })
        .where(eq(products.id, item.productId));
    }

    // 8. Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: orderId,
          orderNumber,
          total,
          status: "pending",
          paymentMethod,
          message: getPaymentInstructions(paymentMethod, orderNumber, total),
        },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en checkout:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error al procesar la orden" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// Helper para instrucciones de pago
function getPaymentInstructions(
  method: string,
  orderNumber: string,
  total: number
): string {
  switch (method) {
    case "card":
      return "Serás redirigido a la pasarela de pago segura.";
    case "oxxo":
      return `Presenta este número de orden (${orderNumber}) en cualquier OXXO y paga $${total.toFixed(
        2
      )} MXN. Tu pedido será procesado una vez confirmado el pago.`;
    case "transfer":
      return `Realiza una transferencia de $${total.toFixed(
        2
      )} MXN con el concepto: ${orderNumber}. Recibirás los datos bancarios por email.`;
    default:
      return "Gracias por tu compra.";
  }
}
