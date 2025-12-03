/**
 * API Endpoint: Obtener órdenes del usuario
 * GET /api/users/orders
 *
 * Retorna todas las órdenes del usuario autenticado con sus items
 */

import type { APIRoute } from "astro";
import { db, orders, orderItems } from "../../../db";
import { validateSession, getTokenFromCookie } from "../../../lib/auth";
import { eq, desc } from "drizzle-orm";

// Tipo para la respuesta
interface OrderItemResponse {
  id: string;
  productName: string;
  productImage: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: string;
  shippingCity: string;
  trackingNumber: string | null;
  createdAt: string;
  paidAt: string | null;
  items: OrderItemResponse[];
}

export const GET: APIRoute = async ({ request }) => {
  try {
    // 1. Verificar autenticación
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "No autenticado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await validateSession(token);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Sesión inválida" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Obtener todas las órdenes del usuario - async con libsql
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt));

    // 3. Para cada orden, obtener sus items - async con libsql
    const ordersWithItems: OrderResponse[] = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            productName: orderItems.productName,
            productImage: orderItems.productImage,
            size: orderItems.size,
            quantity: orderItems.quantity,
            unitPrice: orderItems.unitPrice,
            totalPrice: orderItems.totalPrice,
          })
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          total: order.total,
          shippingAddress: order.shippingAddress,
          shippingCity: order.shippingCity,
          trackingNumber: order.trackingNumber,
          createdAt:
            order.createdAt instanceof Date
              ? order.createdAt.toISOString()
              : new Date(order.createdAt as any).toISOString(),
          paidAt:
            order.paidAt instanceof Date
              ? order.paidAt.toISOString()
              : order.paidAt
              ? new Date(order.paidAt as any).toISOString()
              : null,
          items,
        };
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        orders: ordersWithItems,
        count: ordersWithItems.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error al obtener órdenes" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
