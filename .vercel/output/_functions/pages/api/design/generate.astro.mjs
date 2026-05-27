export { renderers } from '../../../renderers.mjs';

const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt";
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 1024;
function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
function buildPollinationsUrl(prompt) {
  const encodedPrompt = encodeURIComponent(prompt);
  const seed = Date.now();
  return `${POLLINATIONS_BASE_URL}/${encodedPrompt}?width=${IMAGE_WIDTH}&height=${IMAGE_HEIGHT}&nologo=true&seed=${seed}`;
}
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};
const POST = async ({ request }) => {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return jsonResponse(
        {
          success: false,
          error: "Content-Type inválido. Se requiere 'application/json'."
        },
        400
      );
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        {
          success: false,
          error: "El body de la petición no es un JSON válido."
        },
        400
      );
    }
    const prompt = body.prompt?.trim();
    if (!prompt) {
      return jsonResponse(
        {
          success: false,
          error: "El campo 'prompt' es obligatorio y no puede estar vacío."
        },
        400
      );
    }
    const imageUrl = buildPollinationsUrl(prompt);
    return jsonResponse(
      {
        success: true,
        imageUrl,
        prompt
      },
      200
    );
  } catch (error) {
    console.error("Error inesperado en /api/design/generate:", error);
    return jsonResponse(
      {
        success: false,
        error: "Error interno del servidor. Intente de nuevo más tarde."
      },
      500
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
