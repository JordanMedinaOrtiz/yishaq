import { r as register, c as createAuthCookie } from '../../../chunks/auth_BhSwItoV.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;
    if (!email || !password || !firstName || !lastName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Todos los campos son requeridos"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Formato de email inválido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const result = await register(email, password, firstName, lastName);
    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        user: result.user,
        message: "Cuenta creada exitosamente"
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": createAuthCookie(result.token)
        }
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
