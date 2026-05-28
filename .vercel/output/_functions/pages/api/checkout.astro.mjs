import { d as db, b as products, a as orders, o as orderItems } from '../../chunks/index_DYsU1aow.mjs';
import { g as getTokenFromCookie, v as validateSession } from '../../chunks/auth_BhSwItoV.mjs';
import { eq } from 'drizzle-orm';
export { renderers } from '../../renderers.mjs';

function generateOrderNumber() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `YSQ-${year}-${timestamp}${random}`;
}
const POST = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);
    let userId = null;
    if (token) {
      const user = await validateSession(token);
      if (user) {
        userId = user.id;
      }
    }
    const body = await request.json();
    const { items, shippingInfo, paymentMethod, customerNotes } = body;
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "El carrito está vacío" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!shippingInfo || !shippingInfo.firstName || !shippingInfo.email || !shippingInfo.address) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Información de envío incompleta"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!paymentMethod || !["card", "oxxo", "transfer"].includes(paymentMethod)) {
      return new Response(
        JSON.stringify({ success: false, error: "Método de pago inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    let subtotal = 0;
    const validatedItems = [];
    for (const item of items) {
      console.log(`[Checkout] Buscando producto con ID: "${item.productId}"`);
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      if (!product) {
        console.error(
          `[Checkout] Producto NO encontrado. ID buscado: "${item.productId}", Nombre: "${item.name}"`
        );
        return new Response(
          JSON.stringify({
            success: false,
            error: `Producto no encontrado: ${item.name}`,
            debug: {
              searchedId: item.productId,
              productName: item.name,
              hint: "Verifica que el productId sea el UUID correcto de la base de datos"
            }
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      console.log(
        `[Checkout] Producto encontrado: "${product.name}" (ID: ${product.id})`
      );
      if (!product.isActive) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Producto no disponible: ${item.name}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      if (product.stock < item.quantity) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Stock insuficiente para ${item.name}. Disponible: ${product.stock}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      subtotal += product.price * item.quantity;
      validatedItems.push({
        ...item,
        price: product.price,
        productData: product
      });
    }
    const shippingCost = subtotal >= 1e3 ? 0 : 99;
    const tax = 0;
    const discount = 0;
    const total = subtotal + shippingCost + tax - discount;
    const orderId = crypto.randomUUID();
    const orderNumber = generateOrderNumber();
    const now = /* @__PURE__ */ new Date();
    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      userId,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      shippingFirstName: shippingInfo.firstName,
      shippingLastName: shippingInfo.lastName || "",
      shippingEmail: shippingInfo.email,
      shippingPhone: shippingInfo.phone || null,
      shippingAddress: shippingInfo.address,
      shippingCity: shippingInfo.city,
      shippingPostalCode: shippingInfo.postalCode,
      shippingCountry: shippingInfo.country || "México",
      customerNotes: customerNotes || null,
      createdAt: now,
      updatedAt: now
    });
    for (const item of validatedItems) {
      await db.insert(orderItems).values({
        id: crypto.randomUUID(),
        orderId,
        productId: item.productId,
        productName: item.productData.name,
        productImage: item.productData.imageUrl,
        productSku: item.productData.sku,
        size: item.size || null,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity
      });
      await db.update(products).set({
        stock: item.productData.stock - item.quantity,
        updatedAt: now
      }).where(eq(products.id, item.productId));
    }
    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: orderId,
          orderNumber,
          total,
          status: "pending",
          paymentMethod,
          message: getPaymentInstructions(paymentMethod, orderNumber, total)
        }
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en checkout:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error al procesar la orden" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
function getPaymentInstructions(method, orderNumber, total) {
  switch (method) {
    case "card":
      return "Serás redirigido a la pasarela de pago segura.";
    case "oxxo":
      return `Presenta este número de orden (${orderNumber}) en cualquier OXXO y paga $${total.toFixed(
        2
      )} MXN. Tu pedido será procesado una vez confirmado el pago.`;
    case "transfer":
      return `Realiza una transferencia de $${total.toFixed(
        2
      )} MXN con el concepto: ${orderNumber}. Recibirás los datos bancarios por email.`;
    default:
      return "Gracias por tu compra.";
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
