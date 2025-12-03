/**
 * API Endpoint: Órdenes del Usuario
 * GET /api/orders - Lista las órdenes del usuario autenticado
 * GET /api/orders?id=xxx - Detalle de una orden específica
 */

import type { APIRoute } from "astro";
import { db, orders, orderItems } from "../../db";
import { requireAuth, getTokenFromCookie } from "../../lib/auth";
import { eq, desc } from "drizzle-orm";

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Verificar autenticación
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);
    const user = await requireAuth(token);

    const orderId = url.searchParams.get("id");

    if (orderId) {
      // Obtener orden específica (async con libsql)
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));

      if (!order) {
        return new Response(
          JSON.stringify({ success: false, error: "Orden no encontrada" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Verificar que la orden pertenece al usuario (a menos que sea admin)
      if (order.userId !== user.id && user.role !== "admin") {
        return new Response(
          JSON.stringify({ success: false, error: "Acceso denegado" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

      // Obtener items de la orden (async con libsql)
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      return new Response(
        JSON.stringify({ success: true, order: { ...order, items } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Listar todas las órdenes del usuario (async con libsql)
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt));

    return new Response(JSON.stringify({ success: true, orders: userOrders }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    if (
      error.message?.includes("No autenticado") ||
      error.message?.includes("Sesión inválida")
    ) {
      return new Response(
        JSON.stringify({ success: false, error: "Debes iniciar sesión" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Error obteniendo órdenes:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error al obtener órdenes" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
