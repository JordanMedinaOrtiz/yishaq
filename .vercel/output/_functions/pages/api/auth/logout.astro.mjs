import { g as getTokenFromCookie, a as logout, b as createLogoutCookie } from '../../../chunks/auth_B9u7kCyc.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
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
          "Set-Cookie": createLogoutCookie()
        }
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
