import { l as login, c as createAuthCookie } from '../../../chunks/auth_B9u7kCyc.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email y contraseña son requeridos"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const result = await login(email, password);
    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        user: result.user,
        message: "Inicio de sesión exitoso"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": createAuthCookie(result.token)
        }
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
