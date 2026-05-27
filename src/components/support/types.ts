/**
 * @fileoverview Tipos e interfaces para el sistema de tickets de soporte.
 *
 * Este módulo define el contrato de datos del componente TicketCard,
 * siguiendo el principio de CBSE (Component-Based Software Engineering)
 * de separar las interfaces del componente que las implementa.
 *
 * @module support/types
 * @author Equipo 8 — Integración CBSE
 */

// ─────────────────────────────────────────────────────────────
// Enumeraciones
// ─────────────────────────────────────────────────────────────

/**
 * Estados posibles de un ticket de soporte.
 *
 * - `Nuevo`: El ticket acaba de ser creado y requiere atención inmediata.
 * - `En Proceso`: Un agente de soporte está trabajando en el ticket.
 * - `Resuelto`: El ticket ha sido solucionado satisfactoriamente.
 */
export type TicketEstado = "Nuevo" | "En Proceso" | "Resuelto";

// ─────────────────────────────────────────────────────────────
// Interfaces del componente
// ─────────────────────────────────────────────────────────────

/**
 * Props del componente `TicketCard`.
 *
 * Define el contrato explícito que cualquier consumidor del componente
 * debe cumplir, garantizando la interoperabilidad y el reuso (CBSE).
 *
 * @example
 * ```tsx
 * <TicketCard
 *   titulo="Problema con talla XL"
 *   detalles="La playera llegó en talla M en lugar de XL."
 *   nombreCliente="Carlos Méndez"
 *   estado="Nuevo"
 * />
 * ```
 */
export interface TicketCardProps {
  /** Título descriptivo del ticket */
  titulo: string;

  /** Descripción detallada del problema o solicitud */
  detalles: string;

  /** Nombre completo del cliente que generó el ticket */
  nombreCliente: string;

  /** Estado actual del ticket, determina el estilo visual del badge */
  estado: TicketEstado;
}

// ─────────────────────────────────────────────────────────────
// Configuración visual por estado
// ─────────────────────────────────────────────────────────────

/**
 * Configuración de estilos asociada a un estado de ticket.
 * Se usa internamente en `TicketCard` para mapear estado → apariencia.
 */
export interface EstadoConfig {
  /** Clases de Tailwind para el badge de estado */
  badgeClasses: string;

  /** Clases de Tailwind para la barra lateral acentuada */
  accentBarClasses: string;

  /** Clases de Tailwind para el glow de hover */
  glowClasses: string;

  /** Texto legible del estado */
  label: string;
}
