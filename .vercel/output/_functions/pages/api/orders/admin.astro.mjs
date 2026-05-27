import { d as db, o as orders } from '../../../chunks/index_ThQEX7AB.mjs';
import { g as getTokenFromCookie, d as requireAdmin } from '../../../chunks/auth_B9u7kCyc.mjs';
import { desc, eq } from 'drizzle-orm';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request, url }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);
    await requireAdmin(token);
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let allOrders = await db.select({
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
      createdAt: orders.createdAt
    }).from(orders).orderBy(desc(orders.createdAt));
    if (status) {
      allOrders = allOrders.filter((o) => o.status === status);
    }
    const total = allOrders.length;
    const paginatedOrders = allOrders.slice(offset, offset + limit);
    return new Response(
      JSON.stringify({
        success: true,
        orders: paginatedOrders,
        pagination: { total, limit, offset }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error.message?.includes("Acceso denegado") || error.message?.includes("No autenticado")) {
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
const PUT = async ({ request }) => {
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
      adminNotes
    } = body;
    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: "ID de orden requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      return new Response(
        JSON.stringify({ success: false, error: "Orden no encontrada" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const updates = { updatedAt: /* @__PURE__ */ new Date() };
    if (status) {
      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded"
      ];
      if (!validStatuses.includes(status)) {
        return new Response(
          JSON.stringify({ success: false, error: "Estado inválido" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      updates.status = status;
      if (status === "shipped") updates.shippedAt = /* @__PURE__ */ new Date();
      if (status === "delivered") updates.deliveredAt = /* @__PURE__ */ new Date();
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
      if (paymentStatus === "paid") updates.paidAt = /* @__PURE__ */ new Date();
    }
    if (trackingNumber !== void 0) updates.trackingNumber = trackingNumber;
    if (trackingUrl !== void 0) updates.trackingUrl = trackingUrl;
    if (adminNotes !== void 0) updates.adminNotes = adminNotes;
    await db.update(orders).set(updates).where(eq(orders.id, orderId));
    return new Response(
      JSON.stringify({ success: true, message: "Orden actualizada" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error.message?.includes("Acceso denegado") || error.message?.includes("No autenticado")) {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
