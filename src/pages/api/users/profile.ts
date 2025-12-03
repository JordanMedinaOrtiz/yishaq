/**
 * API para actualizar perfil de usuario
 * PUT /api/users/profile
 */

import type { APIRoute } from "astro";
import { db } from "../../../db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { validateSession, getTokenFromCookie } from "../../../lib/auth";

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    // Obtener token de la cookie
    const token = cookies.get("auth_token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "No autorizado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validar sesión
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

    let updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    // Tipo: información personal
    if (type === "profile") {
      const { firstName, lastName, phone } = data;

      if (!firstName?.trim() || !lastName?.trim()) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Nombre y apellido son requeridos",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      updateData.firstName = firstName.trim();
      updateData.lastName = lastName.trim();
      updateData.phone = phone?.trim() || null;
    }
    // Tipo: dirección
    else if (type === "address") {
      const { address, city, postalCode, country } = data;

      if (!address?.trim() || !city?.trim() || !postalCode?.trim()) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Dirección, ciudad y código postal son requeridos",
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
          error: "Tipo de actualización no válido",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Actualizar en la base de datos
    await db.update(users).set(updateData).where(eq(users.id, userId));

    // Obtener datos actualizados
    const [updatedUser] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        phone: users.phone,
        address: users.address,
        city: users.city,
        postalCode: users.postalCode,
        country: users.country,
      })
      .from(users)
      .where(eq(users.id, userId));

    return new Response(
      JSON.stringify({
        success: true,
        message:
          type === "profile"
            ? "Información actualizada correctamente"
            : "Dirección actualizada correctamente",
        user: updatedUser,
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
