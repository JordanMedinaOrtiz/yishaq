/**
 * API para obtener estadísticas del dashboard de administración
 * GET /api/admin/stats
 */

import type { APIRoute } from "astro";
import { db } from "../../../db";
import { orders, products, orderItems } from "../../../db/schema";
import { eq, sql, and, gt } from "drizzle-orm";
import { validateSession } from "../../../lib/auth";

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Obtener token de la cookie
    const token = cookies.get("auth_token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "No autorizado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validar sesión y verificar que es admin
    const user = await validateSession(token);

    if (!user || user.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, error: "Acceso denegado" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener ventas totales (solo pedidos pagados)
    const salesResult = db
      .select({
        total: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
      })
      .from(orders)
      .where(eq(orders.paymentStatus, "paid"))
      .get();

    const totalSales = salesResult?.total || 0;

    // Obtener total de pedidos
    const ordersResult = db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .get();

    const totalOrders = ordersResult?.count || 0;

    // Obtener total de productos activos
    const productsResult = db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(products)
      .where(eq(products.isActive, true))
      .get();

    const totalProducts = productsResult?.count || 0;

    // Obtener productos con stock bajo (menor al umbral definido o menor a 10)
    const lowStockResult = db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          sql`${products.stock} <= ${products.lowStockThreshold}`
        )
      )
      .get();

    const lowStockItems = lowStockResult?.count || 0;

    // Obtener pedidos pendientes
    const pendingOrdersResult = db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orders)
      .where(eq(orders.status, "pending"))
      .get();

    const pendingOrders = pendingOrdersResult?.count || 0;

    // Obtener ventas del mes actual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlySalesResult = db
      .select({
        total: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.paymentStatus, "paid"),
          gt(orders.createdAt, firstDayOfMonth)
        )
      )
      .get();

    const monthlySales = monthlySalesResult?.total || 0;

    // Obtener pedidos recientes (últimos 5)
    const recentOrders = db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        total: orders.total,
        createdAt: orders.createdAt,
        shippingFirstName: orders.shippingFirstName,
        shippingLastName: orders.shippingLastName,
      })
      .from(orders)
      .orderBy(sql`${orders.createdAt} DESC`)
      .limit(5)
      .all();

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalSales,
          totalOrders,
          totalProducts,
          lowStockItems,
          pendingOrders,
          monthlySales,
        },
        recentOrders,
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
