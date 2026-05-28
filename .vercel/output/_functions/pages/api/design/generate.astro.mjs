export { renderers } from '../../../renderers.mjs';

const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt";
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 1024;
const FETCH_TIMEOUT_MS = 9e4;
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
function arrayBufferToBase64DataUri(buffer, mimeType) {
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:${mimeType};base64,${base64}`;
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
    const pollinationsUrl = buildPollinationsUrl(prompt);
    console.log(`[IA Proxy] Generando imagen para: "${prompt}"`);
    console.log(`[IA Proxy] URL: ${pollinationsUrl}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let imageResponse;
    try {
      imageResponse = await fetch(pollinationsUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          // Simular un navegador para evitar bloqueos por User-Agent
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/*, */*"
        }
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        console.error("[IA Proxy] Timeout al descargar imagen");
        return jsonResponse(
          {
            success: false,
            error: "La generación de la imagen tomó demasiado tiempo. Intenta con un prompt más corto."
          },
          504
        );
      }
      console.error("[IA Proxy] Error de red:", fetchError);
      return jsonResponse(
        {
          success: false,
          error: "No se pudo conectar con el servicio de generación de imágenes."
        },
        502
      );
    }
    if (!imageResponse.ok) {
      console.error(
        `[IA Proxy] Pollinations respondió con status ${imageResponse.status}`
      );
      return jsonResponse(
        {
          success: false,
          error: `El servicio de IA respondió con error (${imageResponse.status}). Intenta de nuevo.`
        },
        502
      );
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const responseMime = imageResponse.headers.get("content-type") || "image/jpeg";
    const mimeType = responseMime.split(";")[0].trim();
    const base64DataUri = arrayBufferToBase64DataUri(imageBuffer, mimeType);
    console.log(
      `[IA Proxy] Imagen generada exitosamente (${(imageBuffer.byteLength / 1024).toFixed(1)} KB)`
    );
    return jsonResponse(
      {
        success: true,
        imageUrl: base64DataUri,
        prompt
      },
      200
    );
  } catch (error) {
    console.error("[IA Proxy] Error inesperado:", error);
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
