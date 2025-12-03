/**
 * API Endpoint: Logout de Usuario
 * POST /api/auth/logout
 */

import type { APIRoute } from "astro";
import {
  logout,
  getTokenFromCookie,
  createLogoutCookie,
} from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);

    if (token) {
      await logout(token);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Sesión cerrada" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": createLogoutCookie(),
        },
      }
    );
  } catch (error) {
    console.error("Error en logout:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
