/**
 * @fileoverview Custom Hook `useAiDesign` para consumir el servicio de
 * generación de imágenes con IA.
 *
 * Este hook encapsula toda la lógica de comunicación con el endpoint
 * `/api/design/generate`, siguiendo el principio SOA de loose coupling:
 * el componente consumidor no necesita conocer los detalles de la API,
 * solo el contrato del hook.
 *
 * Características:
 * - Manejo de estados: `idle`, `loading`, `success`, `error`.
 * - Cancelación automática de requests pendientes con `AbortController`.
 * - Limpieza de recursos en el cleanup del componente (unmount).
 * - Función `reset()` para reiniciar el estado.
 *
 * @module lib/hooks/useAiDesign
 * @author Equipo 6 — Integración SOA
 */

import { useState, useCallback, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// Tipos del hook
// ─────────────────────────────────────────────────────────────

/** Posibles estados del flujo de generación */
type AiDesignStatus = "idle" | "loading" | "success" | "error";

/** Estructura de la respuesta exitosa del endpoint */
interface ApiSuccessResponse {
  success: true;
  imageUrl: string;
  prompt: string;
}

/** Estructura de la respuesta de error del endpoint */
interface ApiErrorResponse {
  success: false;
  error: string;
}

/** Tipo unión de las posibles respuestas del endpoint */
type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

/** Contrato público del hook — lo que expone al componente consumidor */
export interface UseAiDesignReturn {
  /** URL de la imagen generada (null si no se ha generado aún) */
  imageUrl: string | null;

  /** Indica si la petición está en curso */
  isLoading: boolean;

  /** Mensaje de error (null si no hay error) */
  error: string | null;

  /** Estado actual del flujo de generación */
  status: AiDesignStatus;

  /** Función para iniciar la generación de un diseño a partir de un prompt */
  generateDesign: (prompt: string) => Promise<void>;

  /** Función para reiniciar el hook a su estado inicial */
  reset: () => void;
}

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

/** URL del endpoint de generación de diseños */
const API_ENDPOINT = "/api/design/generate";

// ─────────────────────────────────────────────────────────────
// Hook principal
// ─────────────────────────────────────────────────────────────

/**
 * Hook personalizado para generar diseños de playeras con IA.
 *
 * Encapsula la comunicación con el servicio REST de generación de
 * imágenes, proporcionando una interfaz declarativa y reactiva
 * para los componentes de React.
 *
 * @returns {@link UseAiDesignReturn} — Objeto con estado y acciones del hook
 *
 * @example
 * ```tsx
 * function DesignGenerator() {
 *   const { imageUrl, isLoading, error, generateDesign, reset } = useAiDesign();
 *
 *   return (
 *     <div>
 *       <button onClick={() => generateDesign("dragón japonés minimalista")}>
 *         Generar
 *       </button>
 *       {isLoading && <p>Generando diseño...</p>}
 *       {error && <p>Error: {error}</p>}
 *       {imageUrl && <img src={imageUrl} alt="Diseño generado" />}
 *       <button onClick={reset}>Limpiar</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAiDesign(): UseAiDesignReturn {
  // ── Estado reactivo ──
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AiDesignStatus>("idle");

  // ── Referencia al AbortController para cancelar requests pendientes ──
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Cancela cualquier petición en curso.
   * Se invoca antes de cada nueva petición y en el cleanup del componente.
   */
  const cancelPendingRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Reinicia el hook a su estado inicial (`idle`).
   * Útil para limpiar resultados previos antes de una nueva generación.
   */
  const reset = useCallback(() => {
    cancelPendingRequest();
    setImageUrl(null);
    setError(null);
    setStatus("idle");
  }, [cancelPendingRequest]);

  /**
   * Inicia la generación de un diseño a partir de un prompt de texto.
   *
   * Flujo interno:
   * 1. Cancela cualquier request pendiente.
   * 2. Establece el estado como `loading`.
   * 3. Hace POST al endpoint `/api/design/generate`.
   * 4. Actualiza el estado a `success` o `error` según la respuesta.
   *
   * @param prompt - Texto descriptivo del diseño deseado
   */
  const generateDesign = useCallback(
    async (prompt: string): Promise<void> => {
      // Validación del lado del cliente (fail-fast)
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) {
        setError("El prompt no puede estar vacío.");
        setStatus("error");
        return;
      }

      // Cancelar request anterior si existe
      cancelPendingRequest();

      // Crear nuevo AbortController para esta petición
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Transicionar a estado de carga
      setImageUrl(null);
      setError(null);
      setStatus("loading");

      try {
        // ── Realizar la petición al endpoint SOA ──
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: trimmedPrompt }),
          signal: controller.signal,
        });

        // ── Parsear la respuesta JSON ──
        const data: ApiResponse = await response.json();

        // Verificar si la petición fue abortada durante el procesamiento
        if (controller.signal.aborted) return;

        // ── Evaluar resultado ──
        if (data.success) {
          setImageUrl(data.imageUrl);
          setStatus("success");
        } else {
          setError(data.error);
          setStatus("error");
        }
      } catch (err) {
        // Ignorar errores por cancelación intencional
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        // Error de red u otro error inesperado
        console.error("Error en useAiDesign:", err);
        setError(
          "No se pudo conectar con el servidor. Verifica tu conexión a internet."
        );
        setStatus("error");
      }
    },
    [cancelPendingRequest]
  );

  // ── Cleanup: cancelar requests al desmontar el componente ──
  useEffect(() => {
    return () => cancelPendingRequest();
  }, [cancelPendingRequest]);

  return {
    imageUrl,
    isLoading: status === "loading",
    error,
    status,
    generateDesign,
    reset,
  };
}
