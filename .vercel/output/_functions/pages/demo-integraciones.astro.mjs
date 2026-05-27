import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_CJOMfcep.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DejvdVPx.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { FileText, User, CheckCircle2, Clock, AlertCircle, Loader2, RotateCcw, Boxes, Component, Cpu, Sparkles, Server, ArrowRight, RefreshCw, Image, AlertTriangle } from 'lucide-react';
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, d as CardFooter } from '../chunks/card_Dc3WLXaj.mjs';
import { c as cn, B as Button } from '../chunks/button_EkdW3CYr.mjs';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
export { renderers } from '../renderers.mjs';

const ESTADO_CONFIG = {
  Nuevo: {
    badgeClasses: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    accentBarClasses: "bg-rose-500",
    glowClasses: "group-hover:shadow-rose-500/10",
    label: "Nuevo"
  },
  "En Proceso": {
    badgeClasses: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    accentBarClasses: "bg-amber-500",
    glowClasses: "group-hover:shadow-amber-500/10",
    label: "En Proceso"
  },
  Resuelto: {
    badgeClasses: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    accentBarClasses: "bg-emerald-500",
    glowClasses: "group-hover:shadow-emerald-500/10",
    label: "Resuelto"
  }
};
const ESTADO_ICONOS = {
  Nuevo: /* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }),
  "En Proceso": /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
  Resuelto: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" })
};
function TicketCard({
  titulo,
  detalles,
  nombreCliente,
  estado
}) {
  const config = ESTADO_CONFIG[estado];
  const icono = ESTADO_ICONOS[estado];
  return /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(
        // ── Base ──
        "group relative overflow-hidden",
        "bg-card/80 backdrop-blur-sm",
        "border-border/50",
        // ── Transiciones y hover ──
        "transition-all duration-300 ease-out",
        "hover:border-border",
        "hover:shadow-lg",
        config.glowClasses
      ),
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
              "transition-all duration-300",
              "group-hover:w-1.5",
              config.accentBarClasses
            ),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx(CardHeader, { className: "pl-5 pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-semibold leading-snug text-foreground", children: titulo }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: cn(
                "inline-flex items-center gap-1.5",
                "px-2.5 py-1 rounded-full",
                "text-xs font-medium tracking-wide",
                "shrink-0",
                "transition-colors duration-200",
                config.badgeClasses
              ),
              children: [
                icono,
                config.label
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "pl-5 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed", children: [
          /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/60" }),
          /* @__PURE__ */ jsx("p", { className: "line-clamp-3", children: detalles })
        ] }) }),
        /* @__PURE__ */ jsx(CardFooter, { className: "pl-5 pt-0 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground/80", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-secondary", children: /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground/80", children: nombreCliente })
        ] }) })
      ]
    }
  );
}

const API_ENDPOINT = "/api/design/generate";
function useAiDesign() {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const abortControllerRef = useRef(null);
  const cancelPendingRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  const reset = useCallback(() => {
    cancelPendingRequest();
    setImageUrl(null);
    setError(null);
    setStatus("idle");
  }, [cancelPendingRequest]);
  const generateDesign = useCallback(
    async (prompt) => {
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) {
        setError("El prompt no puede estar vacío.");
        setStatus("error");
        return;
      }
      cancelPendingRequest();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setImageUrl(null);
      setError(null);
      setStatus("loading");
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: trimmedPrompt }),
          signal: controller.signal
        });
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (data.success) {
          setImageUrl(data.imageUrl);
          setStatus("success");
        } else {
          setError(data.error);
          setStatus("error");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Error en useAiDesign:", err);
        setError(
          "No se pudo conectar con el servidor. Verifica tu conexión a internet."
        );
        setStatus("error");
      }
    },
    [cancelPendingRequest]
  );
  useEffect(() => {
    return () => cancelPendingRequest();
  }, [cancelPendingRequest]);
  return {
    imageUrl,
    isLoading: status === "loading",
    error,
    status,
    generateDesign,
    reset
  };
}

function TShirtModel({ texturaUrl }) {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(THREE.TextureLoader, texturaUrl);
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = true;
      texture.anisotropy = 16;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
    }
  }, [texture]);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });
  return /* @__PURE__ */ jsxs("group", { children: [
    /* @__PURE__ */ jsxs(
      "mesh",
      {
        ref: meshRef,
        position: [0, 0.2, 0],
        onPointerOver: () => setHovered(true),
        onPointerOut: () => setHovered(false),
        scale: hovered ? 1.02 : 1,
        children: [
          /* @__PURE__ */ jsx("cylinderGeometry", { args: [1.2, 1, 2.4, 32, 1, true, -Math.PI * 0.4, Math.PI * 0.8] }),
          /* @__PURE__ */ jsx(
            "meshStandardMaterial",
            {
              map: texture,
              side: THREE.DoubleSide,
              roughness: 0.8,
              metalness: 0,
              envMapIntensity: 0.3
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      ContactShadows,
      {
        position: [0, -1.1, 0],
        opacity: 0.4,
        scale: 5,
        blur: 2.5,
        far: 4
      }
    )
  ] });
}
function LoadingFallback3D() {
  const ringRef = useRef(null);
  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 2;
    }
  });
  return /* @__PURE__ */ jsxs("mesh", { ref: ringRef, children: [
    /* @__PURE__ */ jsx("torusGeometry", { args: [0.5, 0.05, 16, 64] }),
    /* @__PURE__ */ jsx(
      "meshStandardMaterial",
      {
        color: "#4ade80",
        emissive: "#4ade80",
        emissiveIntensity: 0.5
      }
    )
  ] });
}
function DefaultScene() {
  const meshRef = useRef(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });
  return /* @__PURE__ */ jsxs("group", { children: [
    /* @__PURE__ */ jsxs("mesh", { ref: meshRef, position: [0, 0.2, 0], children: [
      /* @__PURE__ */ jsx("cylinderGeometry", { args: [1.2, 1, 2.4, 32, 1, true, -Math.PI * 0.4, Math.PI * 0.8] }),
      /* @__PURE__ */ jsx(
        "meshStandardMaterial",
        {
          color: "#1a1a2e",
          side: THREE.DoubleSide,
          roughness: 0.9,
          metalness: 0
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ContactShadows,
      {
        position: [0, -1.1, 0],
        opacity: 0.3,
        scale: 5,
        blur: 2.5,
        far: 4
      }
    )
  ] });
}
function TShirtViewer3D({ texturaUrl, className }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "relative w-full h-full min-h-[400px] rounded-xl overflow-hidden",
        "bg-gradient-to-b from-[#0a0a1a] to-[#111128]",
        "border border-border/30",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs(
          Canvas,
          {
            camera: { position: [0, 0.5, 4], fov: 45 },
            gl: {
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2
            },
            dpr: [1, 2],
            children: [
              /* @__PURE__ */ jsx("ambientLight", { intensity: 0.5 }),
              /* @__PURE__ */ jsx("directionalLight", { position: [5, 5, 5], intensity: 1, castShadow: true }),
              /* @__PURE__ */ jsx("directionalLight", { position: [-3, 3, -3], intensity: 0.3 }),
              /* @__PURE__ */ jsx("pointLight", { position: [0, 3, 0], intensity: 0.5, color: "#4ade80" }),
              /* @__PURE__ */ jsx(Environment, { preset: "city" }),
              texturaUrl ? /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(LoadingFallback3D, {}), children: /* @__PURE__ */ jsx(TShirtModel, { texturaUrl }) }) : /* @__PURE__ */ jsx(DefaultScene, {}),
              /* @__PURE__ */ jsx(
                OrbitControls,
                {
                  enablePan: false,
                  enableZoom: true,
                  minDistance: 2.5,
                  maxDistance: 7,
                  minPolarAngle: Math.PI * 0.2,
                  maxPolarAngle: Math.PI * 0.7,
                  autoRotate: false
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-sm border border-border/30 text-xs text-muted-foreground/60 pointer-events-none", children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3" }),
          "Arrastra para rotar"
        ] }),
        texturaUrl && /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium", children: "✦ Textura IA aplicada" })
      ]
    }
  );
}
function TShirtViewerSSR(props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "flex items-center justify-center min-h-[400px] rounded-xl",
          "bg-gradient-to-b from-[#0a0a1a] to-[#111128]",
          "border border-border/30",
          props.className
        ),
        children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 text-primary animate-spin mx-auto mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Cargando visor 3D..." })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsx(TShirtViewer3D, { ...props });
}

const TICKETS_DEMO = [
  {
    titulo: "Error en pedido #1042 — Talla incorrecta",
    detalles: "El cliente reporta que recibió una playera en talla M cuando su pedido especificaba talla XL. Solicita cambio inmediato o reembolso completo del pedido.",
    nombreCliente: "Carlos Méndez García",
    estado: "Nuevo"
  },
  {
    titulo: "Solicitud de diseño personalizado — Logo corporativo",
    detalles: "El cliente requiere la impresión de su logo empresarial en 50 playeras tipo polo. Ya se envió la cotización y estamos esperando la aprobación del arte final.",
    nombreCliente: "Ana Lucía Fernández",
    estado: "En Proceso"
  },
  {
    titulo: "Reembolso procesado — Pedido #987",
    detalles: "Se realizó el reembolso de $450.00 MXN al método de pago original (tarjeta terminación *4521). El cliente confirmó la recepción del monto.",
    nombreCliente: "Roberto Jiménez Solís",
    estado: "Resuelto"
  }
];
const PROMPTS_SUGERIDOS = [
  "Dragón japonés estilo minimalista en tinta negra",
  "Paisaje de montañas geométricas con atardecer en degradado",
  "Calavera mexicana con flores de cempasúchil estilo acuarela",
  "Logo abstracto de lobo aullando a la luna estilo tribal"
];
function DemoIntegraciones() {
  const [prompt, setPrompt] = useState("");
  const { imageUrl, isLoading, error, status, generateDesign, reset } = useAiDesign();
  const [texturaLista, setTexturaLista] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      setTexturaLista(false);
      await generateDesign(prompt);
    }
  };
  const handleSuggestionClick = (sugerido) => {
    setPrompt(sugerido);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("header", { className: "relative overflow-hidden border-b border-border/50", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-6xl mx-auto px-6 py-16 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm mb-6 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Boxes, { className: "w-4 h-4 text-primary" }),
          "Ingeniería de Software — CBSE & SOA"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-bold tracking-tight mb-4", children: [
          "Demo de",
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Integraciones" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed", children: "Demostración funcional de los componentes integrados al e-commerce YISHAQ: un componente reutilizable de tickets (Equipo 8) y un servicio de generación de diseños con IA (Equipo 6)." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-6xl mx-auto px-6 py-12 space-y-20", children: [
      /* @__PURE__ */ jsxs("section", { id: "ticket-card-demo", "aria-labelledby": "tickets-heading", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsx(Component, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-primary tracking-widest uppercase", children: "Objetivo 1 — Equipo 8" }),
            /* @__PURE__ */ jsx("h2", { id: "tickets-heading", className: "text-2xl font-bold tracking-tight", children: "Componente TicketCard" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-8 max-w-3xl", children: [
          "Componente React reutilizable que replica el Web Component",
          " ",
          /* @__PURE__ */ jsx("code", { className: "text-sm bg-card px-1.5 py-0.5 rounded border border-border", children: "<ticket-card>" }),
          " ",
          "del equipo original. Cambia su estilo dinámicamente según el estado del ticket, siguiendo principios de",
          " ",
          /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "CBSE" }),
          " (Component-Based Software Engineering)."
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: TICKETS_DEMO.map((ticket, index) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "transform transition-all duration-300 hover:-translate-y-1",
            children: /* @__PURE__ */ jsx(TicketCard, { ...ticket })
          },
          index
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Cpu, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "Nota técnica:" }),
            " Los tipos están separados en",
            " ",
            /* @__PURE__ */ jsx("code", { className: "bg-card px-1 py-0.5 rounded border border-border text-xs", children: "support/types.ts" }),
            " ",
            "y el componente en",
            " ",
            /* @__PURE__ */ jsx("code", { className: "bg-card px-1 py-0.5 rounded border border-border text-xs", children: "support/TicketCard.tsx" }),
            ", cumpliendo el principio de cohesión de CBSE."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-border/50" }),
        /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-muted-foreground/40" }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-border/50" })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "ai-design-demo", "aria-labelledby": "ai-heading", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20", children: /* @__PURE__ */ jsx(Server, { className: "w-5 h-5 text-accent" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-accent tracking-widest uppercase", children: "Objetivo 2 — Equipo 6" }),
            /* @__PURE__ */ jsx("h2", { id: "ai-heading", className: "text-2xl font-bold tracking-tight", children: "Generador de Diseños con IA + Visor 3D" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-8 max-w-3xl", children: [
          "Servicio REST real que consume Pollinations.ai para generar imágenes por IA. La textura generada se aplica dinámicamente sobre un modelo 3D de playera usando",
          " ",
          /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "React Three Fiber" }),
          " y",
          " ",
          /* @__PURE__ */ jsx("code", { className: "text-sm bg-card px-1.5 py-0.5 rounded border border-border", children: "useLoader(TextureLoader)" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "ai-prompt-input",
                    className: "block text-sm font-medium text-foreground mb-2",
                    children: "Describe tu diseño de playera"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    id: "ai-prompt-input",
                    value: prompt,
                    onChange: (e) => setPrompt(e.target.value),
                    placeholder: "Ej: Dragón japonés estilo minimalista con tinta negra sobre fondo blanco...",
                    rows: 3,
                    className: cn(
                      "w-full px-4 py-3 rounded-lg text-sm",
                      "bg-card border border-border/60",
                      "text-foreground placeholder:text-muted-foreground/50",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                      "resize-none transition-all duration-200"
                    ),
                    disabled: isLoading
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: isLoading || !prompt.trim(),
                    className: "flex-1 gap-2",
                    children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                      "Generando..."
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }),
                      "Generar Diseño con IA",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
                    ] })
                  }
                ),
                status !== "idle" && /* @__PURE__ */ jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => {
                      reset();
                      setPrompt("");
                      setTexturaLista(false);
                    },
                    className: "gap-2",
                    children: [
                      /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }),
                      "Limpiar"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-3", children: "Prompts sugeridos" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: PROMPTS_SUGERIDOS.map((sugerido, index) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleSuggestionClick(sugerido),
                  disabled: isLoading,
                  className: cn(
                    "px-3 py-1.5 rounded-full text-xs",
                    "bg-secondary/50 text-muted-foreground",
                    "border border-border/40",
                    "hover:bg-secondary hover:text-foreground hover:border-border",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  ),
                  children: sugerido
                },
                index
              )) })
            ] }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: cn(
                  "relative rounded-xl overflow-hidden",
                  "border border-border/50",
                  "bg-card/30 backdrop-blur-sm",
                  "min-h-[250px]",
                  "flex items-center justify-center"
                ),
                children: [
                  status === "idle" && /* @__PURE__ */ jsxs("div", { className: "text-center p-6", children: [
                    /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/50 mb-3", children: /* @__PURE__ */ jsx(Image, { className: "w-6 h-6 text-muted-foreground/50" }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-muted-foreground/60 text-sm", children: "El preview 2D aparecerá aquí" })
                  ] }),
                  status === "loading" && /* @__PURE__ */ jsxs("div", { className: "text-center p-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative inline-flex items-center justify-center w-16 h-16 mb-3", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" }),
                      /* @__PURE__ */ jsx(Sparkles, { className: "w-6 h-6 text-primary animate-pulse" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Generando diseño con IA..." }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground/50 mt-1", children: "Pollinations.ai está creando tu imagen (10-30s)" })
                  ] }),
                  status === "error" && error && /* @__PURE__ */ jsxs("div", { className: "text-center p-6", children: [
                    /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-destructive/10 mb-3", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-6 h-6 text-destructive" }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium mb-1", children: "Error al generar" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground max-w-xs mx-auto", children: error })
                  ] }),
                  status === "success" && imageUrl && /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: imageUrl,
                        alt: `Diseño IA: ${prompt}`,
                        className: "w-full h-auto object-contain rounded-xl",
                        onLoad: () => setTexturaLista(true),
                        crossOrigin: "anonymous"
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground/70", children: "Prompt:" }),
                      " ",
                      prompt
                    ] }) })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Cpu, { className: "w-5 h-5 text-accent shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "Flujo SOA real:" }),
                " ",
                "Frontend",
                " ",
                /* @__PURE__ */ jsx("code", { className: "bg-card px-1 py-0.5 rounded border border-border text-xs", children: "POST /api/design/generate" }),
                " ",
                "→ Endpoint construye URL de Pollinations.ai → Frontend recibe URL →",
                /* @__PURE__ */ jsx("code", { className: "bg-card px-1 py-0.5 rounded border border-border text-xs", children: "useLoader(TextureLoader)" }),
                " ",
                "carga la textura → Se aplica al mesh 3D."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Visor 3D en tiempo real" })
            ] }),
            /* @__PURE__ */ jsx(
              TShirtViewerSSR,
              {
                texturaUrl: status === "success" ? imageUrl : null,
                className: "h-[520px]"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-border/50 mt-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground/60", children: /* @__PURE__ */ jsx("p", { children: "YISHAQ — Proyecto de Ingeniería de Software · Integración CBSE (Equipo 8) & SOA (Equipo 6)" }) }) })
  ] });
}

const $$DemoIntegraciones = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DemoIntegracionesIsland", DemoIntegraciones, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jorda/Dev/yishaq/src/components/DemoIntegraciones", "client:component-export": "DemoIntegraciones" })} ` })}`;
}, "C:/Users/jorda/Dev/yishaq/src/pages/demo-integraciones.astro", void 0);

const $$file = "C:/Users/jorda/Dev/yishaq/src/pages/demo-integraciones.astro";
const $$url = "/demo-integraciones";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DemoIntegraciones,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
