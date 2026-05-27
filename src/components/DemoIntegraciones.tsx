/**
 * @fileoverview Página de demostración con visor 3D + IA REAL.
 *
 * Isla React que integra:
 * 1. TicketCard (CBSE) — Componente reutilizable con estados dinámicos.
 * 2. Generador de Diseños con IA (SOA) — Endpoint real a Pollinations.ai
 *    + visor 3D con React Three Fiber donde la textura se aplica en
 *    tiempo real sobre el modelo de la playera.
 *
 * @module components/DemoIntegraciones
 */

import { useState } from "react";
import {
  Boxes,
  Cpu,
  Loader2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Component,
  Server,
  Image as ImageIcon,
} from "lucide-react";
import { TicketCard } from "@/components/support/TicketCard";
import { useAiDesign } from "@/lib/hooks/useAiDesign";
import { TShirtViewerSSR } from "@/components/TShirtViewer3D";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// Datos de demostración para los tickets
// ─────────────────────────────────────────────────────────────

const TICKETS_DEMO = [
  {
    titulo: "Error en pedido #1042 — Talla incorrecta",
    detalles:
      "El cliente reporta que recibió una playera en talla M cuando su pedido especificaba talla XL. Solicita cambio inmediato o reembolso completo del pedido.",
    nombreCliente: "Carlos Méndez García",
    estado: "Nuevo" as const,
  },
  {
    titulo: "Solicitud de diseño personalizado — Logo corporativo",
    detalles:
      "El cliente requiere la impresión de su logo empresarial en 50 playeras tipo polo. Ya se envió la cotización y estamos esperando la aprobación del arte final.",
    nombreCliente: "Ana Lucía Fernández",
    estado: "En Proceso" as const,
  },
  {
    titulo: "Reembolso procesado — Pedido #987",
    detalles:
      "Se realizó el reembolso de $450.00 MXN al método de pago original (tarjeta terminación *4521). El cliente confirmó la recepción del monto.",
    nombreCliente: "Roberto Jiménez Solís",
    estado: "Resuelto" as const,
  },
];

const PROMPTS_SUGERIDOS = [
  "Dragón japonés estilo minimalista en tinta negra",
  "Paisaje de montañas geométricas con atardecer en degradado",
  "Calavera mexicana con flores de cempasúchil estilo acuarela",
  "Logo abstracto de lobo aullando a la luna estilo tribal",
];

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────

export function DemoIntegraciones() {
  const [prompt, setPrompt] = useState("");
  const { imageUrl, isLoading, error, status, generateDesign, reset } =
    useAiDesign();

  // ── Estado para saber si la textura ya cargó en el viewer ──
  const [texturaLista, setTexturaLista] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setTexturaLista(false);
      await generateDesign(prompt);
    }
  };

  const handleSuggestionClick = (sugerido: string) => {
    setPrompt(sugerido);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ══════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════ */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm mb-6 text-sm text-muted-foreground">
            <Boxes className="w-4 h-4 text-primary" />
            Ingeniería de Software — CBSE & SOA
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Demo de{" "}
            <span className="text-primary">Integraciones</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Demostración funcional de los componentes integrados al e-commerce
            YISHAQ: un componente reutilizable de tickets (Equipo 8) y un
            servicio de generación de diseños con IA (Equipo 6).
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-20">
        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 1 — TicketCard (CBSE)
            ══════════════════════════════════════════════════════════ */}
        <section id="ticket-card-demo" aria-labelledby="tickets-heading">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
              <Component className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-primary tracking-widest uppercase">
                Objetivo 1 — Equipo 8
              </p>
              <h2 id="tickets-heading" className="text-2xl font-bold tracking-tight">
                Componente TicketCard
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Componente React reutilizable que replica el Web Component{" "}
            <code className="text-sm bg-card px-1.5 py-0.5 rounded border border-border">
              &lt;ticket-card&gt;
            </code>{" "}
            del equipo original. Cambia su estilo dinámicamente según el estado
            del ticket, siguiendo principios de{" "}
            <strong className="text-foreground">CBSE</strong> (Component-Based
            Software Engineering).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TICKETS_DEMO.map((ticket, index) => (
              <div
                key={index}
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <TicketCard {...ticket} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 text-sm text-muted-foreground">
            <Cpu className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Nota técnica:</strong> Los tipos
              están separados en{" "}
              <code className="bg-card px-1 py-0.5 rounded border border-border text-xs">
                support/types.ts
              </code>{" "}
              y el componente en{" "}
              <code className="bg-card px-1 py-0.5 rounded border border-border text-xs">
                support/TicketCard.tsx
              </code>
              , cumpliendo el principio de cohesión de CBSE.
            </div>
          </div>
        </section>

        {/* Separador */}
        <div className="flex items-center gap-4" aria-hidden="true">
          <div className="flex-1 h-px bg-border/50" />
          <Sparkles className="w-5 h-5 text-muted-foreground/40" />
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* ══════════════════════════════════════════════════════════
            SECCIÓN 2 — Generador IA + Visor 3D (SOA)
            ══════════════════════════════════════════════════════════ */}
        <section id="ai-design-demo" aria-labelledby="ai-heading">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
              <Server className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs font-medium text-accent tracking-widest uppercase">
                Objetivo 2 — Equipo 6
              </p>
              <h2 id="ai-heading" className="text-2xl font-bold tracking-tight">
                Generador de Diseños con IA + Visor 3D
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Servicio REST real que consume Pollinations.ai para generar imágenes
            por IA. La textura generada se aplica dinámicamente sobre un modelo
            3D de playera usando{" "}
            <strong className="text-foreground">React Three Fiber</strong> y{" "}
            <code className="text-sm bg-card px-1.5 py-0.5 rounded border border-border">
              useLoader(TextureLoader)
            </code>
            .
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── Panel izquierdo: Formulario + Preview 2D ── */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="ai-prompt-input"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Describe tu diseño de playera
                  </label>
                  <textarea
                    id="ai-prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Dragón japonés estilo minimalista con tinta negra sobre fondo blanco..."
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg text-sm",
                      "bg-card border border-border/60",
                      "text-foreground placeholder:text-muted-foreground/50",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                      "resize-none transition-all duration-200"
                    )}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="flex-1 gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generar Diseño con IA
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  {status !== "idle" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        reset();
                        setPrompt("");
                        setTexturaLista(false);
                      }}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </form>

              {/* Sugerencias */}
              <div>
                <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-3">
                  Prompts sugeridos
                </p>
                <div className="flex flex-wrap gap-2">
                  {PROMPTS_SUGERIDOS.map((sugerido, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(sugerido)}
                      disabled={isLoading}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs",
                        "bg-secondary/50 text-muted-foreground",
                        "border border-border/40",
                        "hover:bg-secondary hover:text-foreground hover:border-border",
                        "transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      {sugerido}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Preview 2D de la imagen generada ── */}
              <div
                className={cn(
                  "relative rounded-xl overflow-hidden",
                  "border border-border/50",
                  "bg-card/30 backdrop-blur-sm",
                  "min-h-[250px]",
                  "flex items-center justify-center"
                )}
              >
                {status === "idle" && (
                  <div className="text-center p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/50 mb-3">
                      <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground/60 text-sm">
                      El preview 2D aparecerá aquí
                    </p>
                  </div>
                )}

                {status === "loading" && (
                  <div className="text-center p-6">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
                      <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generando diseño con IA...
                    </p>
                    <p className="text-xs text-muted-foreground/50 mt-1">
                      Pollinations.ai está creando tu imagen (10-30s)
                    </p>
                  </div>
                )}

                {status === "error" && error && (
                  <div className="text-center p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-destructive/10 mb-3">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <p className="text-sm text-destructive font-medium mb-1">
                      Error al generar
                    </p>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                      {error}
                    </p>
                  </div>
                )}

                {status === "success" && imageUrl && (
                  <div className="w-full">
                    <img
                      src={imageUrl}
                      alt={`Diseño IA: ${prompt}`}
                      className="w-full h-auto object-contain rounded-xl"
                      onLoad={() => setTexturaLista(true)}
                      crossOrigin="anonymous"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/70">
                          Prompt:
                        </span>{" "}
                        {prompt}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Nota técnica SOA */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 text-sm text-muted-foreground">
                <Cpu className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Flujo SOA real:</strong>{" "}
                  Frontend{" "}
                  <code className="bg-card px-1 py-0.5 rounded border border-border text-xs">
                    POST /api/design/generate
                  </code>{" "}
                  → Endpoint construye URL de Pollinations.ai → Frontend recibe
                  URL → 
                  <code className="bg-card px-1 py-0.5 rounded border border-border text-xs">
                    useLoader(TextureLoader)
                  </code>{" "}
                  carga la textura → Se aplica al mesh 3D.
                </div>
              </div>
            </div>

            {/* ── Panel derecho: Visor 3D de la playera ── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Visor 3D en tiempo real
                </p>
              </div>
              <TShirtViewerSSR
                texturaUrl={status === "success" ? imageUrl : null}
                className="h-[520px]"
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/50 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground/60">
          <p>
            YISHAQ — Proyecto de Ingeniería de Software · Integración CBSE
            (Equipo 8) & SOA (Equipo 6)
          </p>
        </div>
      </footer>
    </div>
  );
}
