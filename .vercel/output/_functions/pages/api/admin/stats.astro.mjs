import { d as db, a as orders, b as products } from '../../../chunks/index_DYsU1aow.mjs';
import { sql, eq, and, gt } from 'drizzle-orm';
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
    const [salesResult] = await db.select({
      total: sql`COALESCE(SUM(${orders.total}), 0)`
    }).from(orders).where(eq(orders.paymentStatus, "paid"));
    const totalSales = salesResult?.total || 0;
    const [ordersResult] = await db.select({
      count: sql`COUNT(*)`
    }).from(orders);
    const totalOrders = ordersResult?.count || 0;
    const [productsResult] = await db.select({
      count: sql`COUNT(*)`
    }).from(products).where(eq(products.isActive, true));
    const totalProducts = productsResult?.count || 0;
    const [lowStockResult] = await db.select({
      count: sql`COUNT(*)`
    }).from(products).where(
      and(
        eq(products.isActive, true),
        sql`${products.stock} <= ${products.lowStockThreshold}`
      )
    );
    const lowStockItems = lowStockResult?.count || 0;
    const [pendingOrdersResult] = await db.select({
      count: sql`COUNT(*)`
    }).from(orders).where(eq(orders.status, "pending"));
    const pendingOrders = pendingOrdersResult?.count || 0;
    const now = /* @__PURE__ */ new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [monthlySalesResult] = await db.select({
      total: sql`COALESCE(SUM(${orders.total}), 0)`
    }).from(orders).where(
      and(
        eq(orders.paymentStatus, "paid"),
        gt(orders.createdAt, firstDayOfMonth)
      )
    );
    const monthlySales = monthlySalesResult?.total || 0;
    const recentOrders = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      total: orders.total,
      createdAt: orders.createdAt,
      shippingFirstName: orders.shippingFirstName,
      shippingLastName: orders.shippingLastName
    }).from(orders).orderBy(sql`${orders.createdAt} DESC`).limit(5);
    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalSales,
          totalOrders,
          totalProducts,
          lowStockItems,
          pendingOrders,
          monthlySales
        },
        recentOrders
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error del servidor" }),
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
