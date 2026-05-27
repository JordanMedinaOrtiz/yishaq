import { d as db, o as orders, a as orderItems } from '../../chunks/index_ThQEX7AB.mjs';
import { g as getTokenFromCookie, e as requireAuth } from '../../chunks/auth_B9u7kCyc.mjs';
import { eq, desc } from 'drizzle-orm';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request, url }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);
    const user = await requireAuth(token);
    const orderId = url.searchParams.get("id");
    if (orderId) {
      const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
      if (!order) {
        return new Response(
          JSON.stringify({ success: false, error: "Orden no encontrada" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      if (order.userId !== user.id && user.role !== "admin") {
        return new Response(
          JSON.stringify({ success: false, error: "Acceso denegado" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
      return new Response(
        JSON.stringify({ success: true, order: { ...order, items } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const userOrders = await db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(desc(orders.createdAt));
    return new Response(JSON.stringify({ success: true, orders: userOrders }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (error.message?.includes("No autenticado") || error.message?.includes("Sesión inválida")) {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
