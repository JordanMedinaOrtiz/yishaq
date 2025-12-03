/**
 * API Endpoint: Verificar sesión actual
 * GET /api/auth/me
 */

import type { APIRoute } from "astro";
import { validateSession, getTokenFromCookie } from "../../../lib/auth";

export const GET: APIRoute = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
      return new Response(JSON.stringify({ success: false, user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await validateSession(token);

    if (!user) {
      return new Response(JSON.stringify({ success: false, user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return new Response(JSON.stringify({ success: false, user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
