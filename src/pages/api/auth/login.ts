/**
 * API Endpoint: Login de Usuario
 * POST /api/auth/login
 */

import type { APIRoute } from "astro";
import { login, createAuthCookie } from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validaciones básicas
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email y contraseña son requeridos",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Intentar login
    const result = await login(email, password);

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear respuesta con cookie de autenticación
    return new Response(
      JSON.stringify({
        success: true,
        user: result.user,
        message: "Inicio de sesión exitoso",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": createAuthCookie(result.token!),
        },
      }
    );
  } catch (error) {
    console.error("Error en login:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
