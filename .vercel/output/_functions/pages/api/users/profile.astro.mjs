import { d as db, u as users } from '../../../chunks/index_ThQEX7AB.mjs';
import { eq } from 'drizzle-orm';
import { v as validateSession } from '../../../chunks/auth_B9u7kCyc.mjs';
export { renderers } from '../../../renderers.mjs';

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
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Sesión inválida" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const userId = user.id;
    const body = await request.json();
    const { type, data } = body;
    if (!type || !data) {
      return new Response(
        JSON.stringify({ success: false, error: "Datos incompletos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    let updateData = {
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (type === "profile") {
      const { firstName, lastName, phone } = data;
      if (!firstName?.trim() || !lastName?.trim()) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Nombre y apellido son requeridos"
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      updateData.firstName = firstName.trim();
      updateData.lastName = lastName.trim();
      updateData.phone = phone?.trim() || null;
    } else if (type === "address") {
      const { address, city, postalCode, country } = data;
      if (!address?.trim() || !city?.trim() || !postalCode?.trim()) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Dirección, ciudad y código postal son requeridos"
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      updateData.address = address.trim();
      updateData.city = city.trim();
      updateData.postalCode = postalCode.trim();
      updateData.country = country?.trim() || "México";
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Tipo de actualización no válido"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await db.update(users).set(updateData).where(eq(users.id, userId));
    const [updatedUser] = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      phone: users.phone,
      address: users.address,
      city: users.city,
      postalCode: users.postalCode,
      country: users.country
    }).from(users).where(eq(users.id, userId));
    return new Response(
      JSON.stringify({
        success: true,
        message: type === "profile" ? "Información actualizada correctamente" : "Dirección actualizada correctamente",
        user: updatedUser
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
