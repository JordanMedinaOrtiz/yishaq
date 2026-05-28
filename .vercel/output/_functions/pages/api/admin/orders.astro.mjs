import { d as db, a as orders, o as orderItems } from '../../../chunks/index_DYsU1aow.mjs';
import { desc, eq } from 'drizzle-orm';
import { v as validateSession } from '../../../chunks/auth_BhSwItoV.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ cookies }) => {
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
    const allOrders = await db.select({
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
      deliveredAt: orders.deliveredAt
    }).from(orders).orderBy(desc(orders.createdAt));
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db.select({
          id: orderItems.id,
          productName: orderItems.productName,
          productImage: orderItems.productImage,
          size: orderItems.size,
          quantity: orderItems.quantity,
          unitPrice: orderItems.unitPrice,
          totalPrice: orderItems.totalPrice
        }).from(orderItems).where(eq(orderItems.orderId, order.id));
        return {
          ...order,
          items
        };
      })
    );
    return new Response(
      JSON.stringify({
        success: true,
        orders: ordersWithItems
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
const PUT = async ({ request, cookies }) => {
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
    const updateData = {
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (status) {
      updateData.status = status;
      if (status === "shipped") {
        updateData.shippedAt = /* @__PURE__ */ new Date();
      } else if (status === "delivered") {
        updateData.deliveredAt = /* @__PURE__ */ new Date();
      }
    }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === "paid") {
        updateData.paidAt = /* @__PURE__ */ new Date();
      }
    }
    if (trackingNumber !== void 0) {
      updateData.trackingNumber = trackingNumber;
    }
    if (adminNotes !== void 0) {
      updateData.adminNotes = adminNotes;
    }
    await db.update(orders).set(updateData).where(eq(orders.id, orderId));
    const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, orderId));
    return new Response(
      JSON.stringify({
        success: true,
        message: "Pedido actualizado correctamente",
        order: updatedOrder
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
