/**
 * @fileoverview Endpoint REST PROXY para generación de imágenes con IA.
 *
 * ARQUITECTURA PROXY:
 * El navegador NO hace la petición a Pollinations.ai directamente
 * (eso causa 403 Forbidden por CORS/bloqueo). En su lugar, este
 * endpoint actúa como PROXY:
 *
 * 1. Recibe el prompt del frontend.
 * 2. Hace fetch a Pollinations.ai DESDE EL SERVIDOR (sin restricciones CORS).
 * 3. Convierte los bytes de la imagen a un data URI Base64.
 * 4. Retorna el Base64 al frontend en el JSON.
 *
 * El frontend recibe `data:image/jpeg;base64,...` que funciona directamente
 * como src de <img> y como URL para TextureLoader de Three.js — sin CORS.
 *
 * @route POST /api/design/generate
 * @author Equipo 6 — Integración SOA
 */

import type { APIRoute } from "astro";

// ─────────────────────────────────────────────────────────────
// Constantes del servicio
// ─────────────────────────────────────────────────────────────

/** URL base de la API de Pollinations.ai */
const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt";

/** Dimensiones de la imagen generada (cuadrada para textura 3D) */
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 1024;

/**
 * Timeout para la descarga de la imagen (en milisegundos).
 * Pollinations genera la imagen on-demand, lo cual tarda entre 10-60s.
 * Usamos 90s para dar margen suficiente.
 */
const FETCH_TIMEOUT_MS = 90_000;

// ─────────────────────────────────────────────────────────────
// Tipos del contrato REST
// ─────────────────────────────────────────────────────────────

interface GenerateRequest {
  prompt: string;
}

interface GenerateSuccessResponse {
  success: true;
  /** Data URI Base64 de la imagen (data:image/jpeg;base64,...) */
  imageUrl: string;
  prompt: string;
}

interface GenerateErrorResponse {
  success: false;
  error: string;
}

// ─────────────────────────────────────────────────────────────
// Funciones auxiliares
// ─────────────────────────────────────────────────────────────

/**
 * Crea una respuesta JSON estandarizada con headers CORS.
 */
function jsonResponse(
  body: GenerateSuccessResponse | GenerateErrorResponse,
  status: number
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

/**
 * Construye la URL de Pollinations.ai para generación de imágenes.
 */
function buildPollinationsUrl(prompt: string): string {
  const encodedPrompt = encodeURIComponent(prompt);
  const seed = Date.now();
  return `${POLLINATIONS_BASE_URL}/${encodedPrompt}?width=${IMAGE_WIDTH}&height=${IMAGE_HEIGHT}&nologo=true&seed=${seed}`;
}

/**
 * Convierte un ArrayBuffer de imagen a un data URI Base64.
 *
 * @param buffer - Los bytes crudos de la imagen descargada
 * @param mimeType - El MIME type de la imagen (ej. "image/jpeg")
 * @returns Data URI completo listo para usar como src de <img> o TextureLoader
 */
function arrayBufferToBase64DataUri(
  buffer: ArrayBuffer,
  mimeType: string
): string {
  // Buffer.from es la API nativa de Node.js: hasta 10x más rápido que
  // el loop btoa para imágenes grandes (>500 KB). btoa en loop puede
  // tardar >10s en una imagen 1024×1024 y hacer timeout al request.
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

// ─────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────

/** Preflight CORS */
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

/**
 * POST /api/design/generate — PROXY de generación de imágenes.
 *
 * Flujo completo:
 * 1. Recibe y valida el prompt del frontend.
 * 2. Construye la URL de Pollinations.ai.
 * 3. Hace GET a Pollinations DESDE EL SERVIDOR (evita 403 del navegador).
 * 4. Descarga los bytes completos de la imagen generada.
 * 5. Convierte a Base64 data URI.
 * 6. Retorna el data URI al frontend en JSON.
 *
 * El frontend recibe algo como:
 * { "imageUrl": "data:image/jpeg;base64,/9j/4AAQ..." }
 *
 * Esto funciona directamente con <img src={imageUrl}> y con
 * THREE.TextureLoader sin problemas de CORS.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // ── Paso 1: Validar Content-Type ──
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return jsonResponse(
        {
          success: false,
          error: "Content-Type inválido. Se requiere 'application/json'.",
        },
        400
      );
    }

    // ── Paso 2: Parsear body ──
    let body: GenerateRequest;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        {
          success: false,
          error: "El body de la petición no es un JSON válido.",
        },
        400
      );
    }

    // ── Paso 3: Validar prompt ──
    const prompt = body.prompt?.trim();
    if (!prompt) {
      return jsonResponse(
        {
          success: false,
          error: "El campo 'prompt' es obligatorio y no puede estar vacío.",
        },
        400
      );
    }

    // ── Paso 4: Construir la URL y hacer fetch desde el servidor ──
    const pollinationsUrl = buildPollinationsUrl(prompt);
    console.log(`[IA Proxy] Generando imagen para: "${prompt}"`);
    console.log(`[IA Proxy] URL: ${pollinationsUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let imageResponse: globalThis.Response;
    try {
      imageResponse = await fetch(pollinationsUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          // Simular un navegador para evitar bloqueos por User-Agent
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/*, */*",
        },
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);

      // Diferenciar timeout de error de red
      if (
        fetchError instanceof DOMException &&
        fetchError.name === "AbortError"
      ) {
        console.error("[IA Proxy] Timeout al descargar imagen");
        return jsonResponse(
          {
            success: false,
            error:
              "La generación de la imagen tomó demasiado tiempo. Intenta con un prompt más corto.",
          },
          504
        );
      }

      console.error("[IA Proxy] Error de red:", fetchError);
      return jsonResponse(
        {
          success: false,
          error:
            "No se pudo conectar con el servicio de generación de imágenes.",
        },
        502
      );
    }

    // ── Paso 5: Verificar que la respuesta sea exitosa ──
    if (!imageResponse.ok) {
      console.error(
        `[IA Proxy] Pollinations respondió con status ${imageResponse.status}`
      );
      return jsonResponse(
        {
          success: false,
          error: `El servicio de IA respondió con error (${imageResponse.status}). Intenta de nuevo.`,
        },
        502
      );
    }

    // ── Paso 6: Descargar los bytes y convertir a Base64 ──
    const imageBuffer = await imageResponse.arrayBuffer();

    // Detectar MIME type de la respuesta, fallback a jpeg
    const responseMime =
      imageResponse.headers.get("content-type") || "image/jpeg";
    const mimeType = responseMime.split(";")[0].trim(); // Limpiar charset si existe

    const base64DataUri = arrayBufferToBase64DataUri(imageBuffer, mimeType);

    console.log(
      `[IA Proxy] Imagen generada exitosamente (${(imageBuffer.byteLength / 1024).toFixed(1)} KB)`
    );

    // ── Paso 7: Retornar el data URI Base64 al frontend ──
    return jsonResponse(
      {
        success: true,
        imageUrl: base64DataUri,
        prompt,
      },
      200
    );
  } catch (error) {
    console.error("[IA Proxy] Error inesperado:", error);
    return jsonResponse(
      {
        success: false,
        error: "Error interno del servidor. Intente de nuevo más tarde.",
      },
      500
    );
  }
};
