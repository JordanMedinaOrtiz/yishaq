/**
 * API Endpoint: Gestión de Órdenes (Admin)
 * GET /api/orders/admin - Lista todas las órdenes
 * PUT /api/orders/admin - Actualizar estado de orden
 */

import type { APIRoute } from "astro";
import { db, orders, orderItems, users } from "../../../db";
import { requireAdmin, getTokenFromCookie } from "../../../lib/auth";
import { eq, desc } from "drizzle-orm";

// Listar todas las órdenes (Admin)
export const GET: APIRoute = async ({ request, url }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);
    await requireAdmin(token);

    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    // Obtener todas las órdenes
    let allOrders = db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        userId: orders.userId,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        paymentMethod: orders.paymentMethod,
        total: orders.total,
        shippingFirstName: orders.shippingFirstName,
        shippingLastName: orders.shippingLastName,
        shippingEmail: orders.shippingEmail,
        shippingCity: orders.shippingCity,
        trackingNumber: orders.trackingNumber,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .all();

    // Filtrar por estado si se especifica
    if (status) {
      allOrders = allOrders.filter((o) => o.status === status);
    }

    // Paginar
    const total = allOrders.length;
    const paginatedOrders = allOrders.slice(offset, offset + limit);

    return new Response(
      JSON.stringify({
        success: true,
        orders: paginatedOrders,
        pagination: { total, limit, offset },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    if (
      error.message?.includes("Acceso denegado") ||
      error.message?.includes("No autenticado")
    ) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Error obteniendo órdenes:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error al obtener órdenes" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// Actualizar orden (Admin)
export const PUT: APIRoute = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);
    await requireAdmin(token);

    const body = await request.json();
    const {
      orderId,
      status,
      paymentStatus,
      trackingNumber,
      trackingUrl,
      adminNotes,
    } = body;

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: "ID de orden requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar que la orden existe
    const order = db.select().from(orders).where(eq(orders.id, orderId)).get();

    if (!order) {
      return new Response(
        JSON.stringify({ success: false, error: "Orden no encontrada" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Preparar actualizaciones
    const updates: Record<string, any> = { updatedAt: new Date() };

    if (status) {
      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ];
      if (!validStatuses.includes(status)) {
        return new Response(
          JSON.stringify({ success: false, error: "Estado inválido" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      updates.status = status;

      // Actualizar timestamps según el estado
      if (status === "shipped") updates.shippedAt = new Date();
      if (status === "delivered") updates.deliveredAt = new Date();
    }

    if (paymentStatus) {
      const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return new Response(
          JSON.stringify({ success: false, error: "Estado de pago inválido" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      updates.paymentStatus = paymentStatus;
      if (paymentStatus === "paid") updates.paidAt = new Date();
    }

    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) updates.trackingUrl = trackingUrl;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;

    // Actualizar orden
    db.update(orders).set(updates).where(eq(orders.id, orderId)).run();

    return new Response(
      JSON.stringify({ success: true, message: "Orden actualizada" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    if (
      error.message?.includes("Acceso denegado") ||
      error.message?.includes("No autenticado")
    ) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Error actualizando orden:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error al actualizar orden" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
