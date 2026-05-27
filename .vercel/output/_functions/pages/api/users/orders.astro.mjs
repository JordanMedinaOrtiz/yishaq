import { d as db, o as orders, a as orderItems } from '../../../chunks/index_ThQEX7AB.mjs';
import { g as getTokenFromCookie, v as validateSession } from '../../../chunks/auth_B9u7kCyc.mjs';
import { eq, desc } from 'drizzle-orm';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request }) => {
  try {
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
    const userOrders = await db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(desc(orders.createdAt));
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
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
          createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : new Date(order.createdAt).toISOString(),
          paidAt: order.paidAt instanceof Date ? order.paidAt.toISOString() : order.paidAt ? new Date(order.paidAt).toISOString() : null,
          items
        };
      })
    );
    return new Response(
      JSON.stringify({
        success: true,
        orders: ordersWithItems,
        count: ordersWithItems.length
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
