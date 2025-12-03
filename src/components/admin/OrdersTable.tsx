/**
 * OrdersTable - Tabla de gestión de pedidos para el admin
 */

import { useState } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
  Loader2,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
} from "lucide-react";

// Tipos
interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
  shippingPhone: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  trackingNumber: string | null;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
}

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onUpdateOrder: (orderId: string, data: any) => Promise<void>;
}

// Configuración de estados
const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmado",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: CheckCircle2,
  },
  processing: {
    label: "Procesando",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: Package,
  },
  shipped: {
    label: "Enviado",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    icon: Truck,
  },
  delivered: {
    label: "Entregado",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
  },
  refunded: {
    label: "Reembolsado",
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    icon: DollarSign,
  },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> =
  {
    pending: { label: "Pendiente", color: "bg-yellow-500/10 text-yellow-600" },
    paid: { label: "Pagado", color: "bg-green-500/10 text-green-600" },
    failed: { label: "Fallido", color: "bg-red-500/10 text-red-600" },
    refunded: { label: "Reembolsado", color: "bg-gray-500/10 text-gray-600" },
  };

// Componente de badge de estado
function StatusBadge({
  status,
  type,
}: {
  status: string;
  type: "order" | "payment";
}) {
  const config =
    type === "order"
      ? ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending
      : PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;

  const Icon = type === "order" ? (config as any).icon : CreditCard;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// Componente de fila de pedido expandible
function OrderRow({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (data: any) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleQuickAction = async (
    action: "confirm" | "ship" | "deliver" | "markPaid"
  ) => {
    setIsUpdating(true);
    try {
      let updateData: any = {};

      switch (action) {
        case "confirm":
          updateData = { status: "confirmed" };
          break;
        case "ship":
          updateData = { status: "shipped" };
          break;
        case "deliver":
          updateData = { status: "delivered" };
          break;
        case "markPaid":
          updateData = { paymentStatus: "paid" };
          break;
      }

      await onUpdate(updateData);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </td>
        <td className="px-4 py-3">
          <span className="font-mono text-sm font-medium">
            {order.orderNumber}
          </span>
        </td>
        <td className="px-4 py-3">
          <div>
            <p className="font-medium text-sm">
              {order.shippingFirstName} {order.shippingLastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.shippingEmail}
            </p>
          </div>
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={order.status} type="order" />
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={order.paymentStatus} type="payment" />
        </td>
        <td className="px-4 py-3">
          <span className="font-semibold">${order.total.toFixed(2)}</span>
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground">
          {formatDate(order.createdAt)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {/* Acciones rápidas según el estado */}
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {order.status === "pending" && (
                  <button
                    onClick={() => handleQuickAction("confirm")}
                    className="px-2 py-1 text-xs bg-blue-500/10 text-blue-600 rounded hover:bg-blue-500/20 transition-colors"
                    title="Confirmar pedido"
                  >
                    Confirmar
                  </button>
                )}
                {order.status === "confirmed" && (
                  <button
                    onClick={() => handleQuickAction("ship")}
                    className="px-2 py-1 text-xs bg-indigo-500/10 text-indigo-600 rounded hover:bg-indigo-500/20 transition-colors"
                    title="Marcar como enviado"
                  >
                    Enviar
                  </button>
                )}
                {order.status === "shipped" && (
                  <button
                    onClick={() => handleQuickAction("deliver")}
                    className="px-2 py-1 text-xs bg-green-500/10 text-green-600 rounded hover:bg-green-500/20 transition-colors"
                    title="Marcar como entregado"
                  >
                    Entregar
                  </button>
                )}
                {order.paymentStatus === "pending" && (
                  <button
                    onClick={() => handleQuickAction("markPaid")}
                    className="px-2 py-1 text-xs bg-emerald-500/10 text-emerald-600 rounded hover:bg-emerald-500/20 transition-colors"
                    title="Marcar como pagado"
                  >
                    Pagado
                  </button>
                )}
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                  title="Editar pedido"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>

      {/* Fila expandida con detalles */}
      {isExpanded && (
        <tr className="bg-muted/20">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Información de envío */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Dirección de Envío
                </h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>{order.shippingAddress}</p>
                  <p>
                    {order.shippingCity}, CP {order.shippingPostalCode}
                  </p>
                  {order.shippingPhone && (
                    <p className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {order.shippingPhone}
                    </p>
                  )}
                  <p className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {order.shippingEmail}
                  </p>
                </div>

                {order.trackingNumber && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground">
                      Número de rastreo:
                    </p>
                    <p className="font-mono text-sm">{order.trackingNumber}</p>
                  </div>
                )}

                {order.customerNotes && (
                  <div className="mt-4 p-3 bg-card rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Notas del cliente:
                    </p>
                    <p className="text-sm">{order.customerNotes}</p>
                  </div>
                )}
              </div>

              {/* Productos del pedido */}
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-primary" />
                  Productos ({order.items.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 bg-card rounded-lg border border-border"
                    >
                      <div className="w-12 h-14 rounded overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {item.size && <span>Talla {item.size}</span>}
                          <span>×{item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="mt-4 pt-3 border-t border-border space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span
                      className={
                        order.shippingCost === 0 ? "text-green-600" : ""
                      }
                    >
                      {order.shippingCost === 0
                        ? "GRATIS"
                        : `$${order.shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 border-t border-border">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline de fechas */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Creado: {formatDate(order.createdAt)}
                </span>
                {order.paidAt && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CreditCard className="w-3 h-3" />
                    Pagado: {formatDate(order.paidAt)}
                  </span>
                )}
                {order.shippedAt && (
                  <span className="flex items-center gap-1 text-indigo-600">
                    <Truck className="w-3 h-3" />
                    Enviado: {formatDate(order.shippedAt)}
                  </span>
                )}
                {order.deliveredAt && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Entregado: {formatDate(order.deliveredAt)}
                  </span>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Modal de edición */}
      {showEditModal && (
        <EditOrderModal
          order={order}
          onClose={() => setShowEditModal(false)}
          onSave={async (data) => {
            await onUpdate(data);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
}

// Modal de edición de pedido
function EditOrderModal({
  order,
  onClose,
  onSave,
}: {
  order: Order;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || ""
  );
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        status,
        paymentStatus,
        trackingNumber: trackingNumber || null,
        adminNotes: adminNotes || null,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <tr>
      <td colSpan={8}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Editar Pedido {order.orderNumber}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Estado del pedido
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="processing">Procesando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="refunded">Reembolsado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Estado del pago
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="failed">Fallido</option>
                    <option value="refunded">Reembolsado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Número de rastreo
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ej: 1234567890"
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Notas del administrador
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notas internas..."
                  rows={3}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </td>
    </tr>
  );
}

// Componente principal de la tabla
export function OrdersTable({
  orders,
  isLoading,
  onUpdateOrder,
}: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">No hay pedidos</h3>
        <p className="text-muted-foreground">
          Los pedidos aparecerán aquí cuando los clientes realicen compras.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="text-left text-sm font-medium text-muted-foreground">
            <th className="px-4 py-3 w-10"></th>
            <th className="px-4 py-3">Pedido</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Pago</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onUpdate={(data) => onUpdateOrder(order.id, data)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
