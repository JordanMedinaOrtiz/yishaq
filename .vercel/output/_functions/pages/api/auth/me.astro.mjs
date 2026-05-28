import { g as getTokenFromCookie, v as validateSession } from '../../../chunks/auth_BhSwItoV.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const token = getTokenFromCookie(cookieHeader);
    if (!token) {
      return new Response(JSON.stringify({ success: false, user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const user = await validateSession(token);
    if (!user) {
      return new Response(JSON.stringify({ success: false, user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return new Response(JSON.stringify({ success: false, user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
