/**
 * @fileoverview Componente reutilizable `TicketCard` para el panel de soporte.
 *
 * Replica la funcionalidad del Web Component `<ticket-card>` del Equipo 8,
 * adaptado al ecosistema React + Tailwind CSS del proyecto YISHAQ.
 *
 * Principios aplicados:
 * - **CBSE**: Componente aislado, reutilizable, con contrato de props explícito.
 * - **Clean Code**: Nombres descriptivos, responsabilidad única, tipado estricto.
 * - **Separation of Concerns**: Los tipos están en `./types.ts`.
 *
 * @module support/TicketCard
 * @author Equipo 8 — Integración CBSE
 */

import { AlertCircle, CheckCircle2, Clock, FileText, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TicketCardProps, TicketEstado, EstadoConfig } from "./types";

// ─────────────────────────────────────────────────────────────
// Configuración de estilos por estado
// ─────────────────────────────────────────────────────────────

/**
 * Mapeo de cada estado del ticket a su configuración visual.
 *
 * Los colores usan opacidades bajas para lograr un efecto glassmorphism
 * sutil que se integra con el tema dark premium de YISHAQ.
 */
const ESTADO_CONFIG: Record<TicketEstado, EstadoConfig> = {
  Nuevo: {
    badgeClasses:
      "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    accentBarClasses: "bg-rose-500",
    glowClasses: "group-hover:shadow-rose-500/10",
    label: "Nuevo",
  },
  "En Proceso": {
    badgeClasses:
      "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    accentBarClasses: "bg-amber-500",
    glowClasses: "group-hover:shadow-amber-500/10",
    label: "En Proceso",
  },
  Resuelto: {
    badgeClasses:
      "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    accentBarClasses: "bg-emerald-500",
    glowClasses: "group-hover:shadow-emerald-500/10",
    label: "Resuelto",
  },
};

/**
 * Mapeo de cada estado a su icono correspondiente de `lucide-react`.
 * Los iconos aportan contexto visual inmediato sobre la urgencia del ticket.
 */
const ESTADO_ICONOS: Record<TicketEstado, React.ReactNode> = {
  Nuevo: <AlertCircle className="w-3.5 h-3.5" />,
  "En Proceso": <Clock className="w-3.5 h-3.5" />,
  Resuelto: <CheckCircle2 className="w-3.5 h-3.5" />,
};

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────

/**
 * `TicketCard` — Tarjeta de ticket de soporte técnico / pedidos.
 *
 * Componente React reutilizable que muestra la información de un ticket
 * con estilos dinámicos según su estado. Diseñado para integrarse
 * directamente en cualquier vista del proyecto YISHAQ.
 *
 * @param props - {@link TicketCardProps} con los datos del ticket
 * @returns JSX del componente renderizado
 *
 * @example
 * ```tsx
 * // Ticket nuevo — badge rojo con icono de alerta
 * <TicketCard
 *   titulo="Error en el pedido #1042"
 *   detalles="El cliente recibió una talla incorrecta."
 *   nombreCliente="María López"
 *   estado="Nuevo"
 * />
 *
 * // Ticket resuelto — badge verde con icono de check
 * <TicketCard
 *   titulo="Reembolso procesado"
 *   detalles="Se realizó el reembolso al método de pago original."
 *   nombreCliente="Juan Pérez"
 *   estado="Resuelto"
 * />
 * ```
 */
export function TicketCard({
  titulo,
  detalles,
  nombreCliente,
  estado,
}: TicketCardProps) {
  // Obtener la configuración visual correspondiente al estado actual
  const config = ESTADO_CONFIG[estado];
  const icono = ESTADO_ICONOS[estado];

  return (
    <Card
      className={cn(
        // ── Base ──
        "group relative overflow-hidden",
        "bg-card/80 backdrop-blur-sm",
        "border-border/50",
        // ── Transiciones y hover ──
        "transition-all duration-300 ease-out",
        "hover:border-border",
        "hover:shadow-lg",
        config.glowClasses
      )}
    >
      {/* ── Barra lateral acentuada por estado ── */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
          "transition-all duration-300",
          "group-hover:w-1.5",
          config.accentBarClasses
        )}
        aria-hidden="true"
      />

      <CardHeader className="pl-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* ── Título del ticket ── */}
          <CardTitle className="text-base font-semibold leading-snug text-foreground">
            {titulo}
          </CardTitle>

          {/* ── Badge de estado dinámico ── */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5",
              "px-2.5 py-1 rounded-full",
              "text-xs font-medium tracking-wide",
              "shrink-0",
              "transition-colors duration-200",
              config.badgeClasses
            )}
          >
            {icono}
            {config.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pl-5 pb-4">
        {/* ── Detalles del ticket ── */}
        <div className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
          <FileText className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/60" />
          <p className="line-clamp-3">{detalles}</p>
        </div>
      </CardContent>

      <CardFooter className="pl-5 pt-0 pb-4">
        {/* ── Información del cliente ── */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground/80">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="font-medium text-foreground/80">{nombreCliente}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
