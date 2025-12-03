/**
 * API para gestión de pedidos del admin
 * GET /api/admin/orders - Obtener todos los pedidos
 * PUT /api/admin/orders - Actualizar estado de un pedido
 */

import type { APIRoute } from "astro";
import { db } from "../../../db";
import { orders, orderItems, users } from "../../../db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { validateSession } from "../../../lib/auth";

// GET - Obtener todos los pedidos
export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "No autorizado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await validateSession(token);

    if (!user || user.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, error: "Acceso denegado" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener todos los pedidos con información del usuario - async con libsql
    const allOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        paymentMethod: orders.paymentMethod,
        subtotal: orders.subtotal,
        shippingCost: orders.shippingCost,
        total: orders.total,
        shippingFirstName: orders.shippingFirstName,
        shippingLastName: orders.shippingLastName,
        shippingEmail: orders.shippingEmail,
        shippingPhone: orders.shippingPhone,
        shippingAddress: orders.shippingAddress,
        shippingCity: orders.shippingCity,
        shippingPostalCode: orders.shippingPostalCode,
        trackingNumber: orders.trackingNumber,
        customerNotes: orders.customerNotes,
        adminNotes: orders.adminNotes,
        createdAt: orders.createdAt,
        paidAt: orders.paidAt,
        shippedAt: orders.shippedAt,
        deliveredAt: orders.deliveredAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt));

    // Obtener items de cada pedido - async con libsql
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
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
          ...order,
          items,
        };
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        orders: ordersWithItems,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error obteniendo pedidos:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// PUT - Actualizar estado de un pedido
export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get("auth_token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "No autorizado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await validateSession(token);

    if (!user || user.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, error: "Acceso denegado" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { orderId, status, paymentStatus, trackingNumber, adminNotes } = body;

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: "ID de pedido requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Preparar datos de actualización
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;

      // Actualizar timestamps según el estado
      if (status === "shipped") {
        updateData.shippedAt = new Date();
      } else if (status === "delivered") {
        updateData.deliveredAt = new Date();
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;

      // Si se marca como pagado, actualizar la fecha de pago
      if (paymentStatus === "paid") {
        updateData.paidAt = new Date();
      }
    }

    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    // Actualizar pedido - async con libsql
    await db.update(orders).set(updateData).where(eq(orders.id, orderId));

    // Obtener pedido actualizado - async con libsql
    const [updatedOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    return new Response(
      JSON.stringify({
        success: true,
        message: "Pedido actualizado correctamente",
        order: updatedOrder,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error actualizando pedido:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
