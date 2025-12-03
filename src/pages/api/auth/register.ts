/**
 * API Endpoint: Registro de Usuario
 * POST /api/auth/register
 */

import type { APIRoute } from "astro";
import { register, createAuthCookie } from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validaciones básicas
    if (!email || !password || !firstName || !lastName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Todos los campos son requeridos",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Formato de email inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Registrar usuario
    const result = await register(email, password, firstName, lastName);

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear respuesta con cookie de autenticación
    return new Response(
      JSON.stringify({
        success: true,
        user: result.user,
        message: "Cuenta creada exitosamente",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": createAuthCookie(result.token!),
        },
      }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
