/**
 * UserProfile - Página de perfil de usuario
 * Muestra información personal y historial de pedidos
 */

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  ShoppingBag,
  Edit3,
  LogOut,
  Loader2,
  Calendar,
  Hash,
  DollarSign,
  X,
  Save,
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
  shippingAddress: string;
  shippingCity: string;
  trackingNumber: string | null;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
}

type TabType = "profile" | "orders";

// Componente de estado de pedido
function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    { color: string; icon: any; label: string }
  > = {
    pending: {
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      icon: Clock,
      label: "Pendiente",
    },
    confirmed: {
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: CheckCircle2,
      label: "Confirmado",
    },
    processing: {
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      icon: Package,
      label: "Procesando",
    },
    shipped: {
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
      icon: Truck,
      label: "Enviado",
    },
    delivered: {
      color: "bg-green-500/10 text-green-500 border-green-500/20",
      icon: CheckCircle2,
      label: "Entregado",
    },
    cancelled: {
      color: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: XCircle,
      label: "Cancelado",
    },
    refunded: {
      color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      icon: DollarSign,
      label: "Reembolsado",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// Componente de estado de pago
function PaymentStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    pending: { color: "bg-yellow-500/10 text-yellow-500", label: "Pendiente" },
    paid: { color: "bg-green-500/10 text-green-500", label: "Pagado" },
    failed: { color: "bg-red-500/10 text-red-500", label: "Fallido" },
    refunded: { color: "bg-gray-500/10 text-gray-500", label: "Reembolsado" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.color}`}
    >
      <CreditCard className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// Componente de tarjeta de orden con acordeón
function OrderCard({ order, index }: { order: Order; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Animación de acordeón con GSAP
  const toggleExpand = async () => {
    const gsap = (await import("gsap")).default;
    const content = contentRef.current;

    if (!content) return;

    if (isExpanded) {
      // Cerrar
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => setIsExpanded(false),
      });
    } else {
      // Abrir
      setIsExpanded(true);
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  };

  // Animación de entrada inicial
  useEffect(() => {
    const animateEntry = async () => {
      const gsap = (await import("gsap")).default;
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power3.out",
          }
        );
      }
    };
    animateEntry();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 opacity-0"
    >
      {/* Header clickeable */}
      <button
        onClick={toggleExpand}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm font-semibold">
                {order.orderNumber}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(order.createdAt)}
              </span>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {order.items.length} producto(s)
            </p>
          </div>
          <div
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </button>

      {/* Contenido expandible */}
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="px-5 pb-5 border-t border-border">
          {/* Info de envío */}
          <div className="py-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {order.shippingAddress}, {order.shippingCity}
              </span>
            </div>
            {order.trackingNumber && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span>Tracking: {order.trackingNumber}</span>
              </div>
            )}
          </div>

          {/* Lista de productos */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Productos
            </h4>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl"
              >
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.productName}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    {item.size && (
                      <span className="px-2 py-0.5 bg-card rounded text-xs font-medium">
                        Talla {item.size}
                      </span>
                    )}
                    <span>Cant: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    ${item.unitPrice.toFixed(2)} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span
                className={order.shippingCost === 0 ? "text-green-500" : ""}
              >
                {order.shippingCost === 0
                  ? "GRATIS"
                  : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Modal de Edición de Perfil
// ============================================
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    phone?: string | null;
  };
  onSave: (data: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => Promise<void>;
}

function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone || "");
      setError(null);
      animateOpen();
    }
  }, [isOpen, user]);

  const animateOpen = async () => {
    const gsap = (await import("gsap")).default;
    if (backdropRef.current && modalRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
    }
  };

  const animateClose = async () => {
    const gsap = (await import("gsap")).default;
    if (backdropRef.current && modalRef.current) {
      await gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.2,
      });
      await gsap.to(backdropRef.current, { opacity: 0, duration: 0.15 });
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Nombre y apellido son requeridos");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });
      animateClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isSaving && animateClose()}
      />
      <div
        ref={modalRef}
        className="relative bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Editar Información
          </h2>
          <button
            onClick={() => !isSaving && animateClose()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nombre</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Tu nombre"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Tu apellido"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="+52 55 1234 5678"
              disabled={isSaving}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => !isSaving && animateClose()}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// Modal de Edición de Dirección
// ============================================
interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    address?: string | null;
    city?: string | null;
    postalCode?: string | null;
    country?: string | null;
  };
  onSave: (data: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }) => Promise<void>;
}

function EditAddressModal({
  isOpen,
  onClose,
  user,
  onSave,
}: EditAddressModalProps) {
  const [address, setAddress] = useState(user.address || "");
  const [city, setCity] = useState(user.city || "");
  const [postalCode, setPostalCode] = useState(user.postalCode || "");
  const [country, setCountry] = useState(user.country || "México");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAddress(user.address || "");
      setCity(user.city || "");
      setPostalCode(user.postalCode || "");
      setCountry(user.country || "México");
      setError(null);
      animateOpen();
    }
  }, [isOpen, user]);

  const animateOpen = async () => {
    const gsap = (await import("gsap")).default;
    if (backdropRef.current && modalRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
    }
  };

  const animateClose = async () => {
    const gsap = (await import("gsap")).default;
    if (backdropRef.current && modalRef.current) {
      await gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.2,
      });
      await gsap.to(backdropRef.current, { opacity: 0, duration: 0.15 });
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !city.trim() || !postalCode.trim()) {
      setError("Dirección, ciudad y código postal son requeridos");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await onSave({
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        country: country.trim() || "México",
      });
      animateClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isSaving && animateClose()}
      />
      <div
        ref={modalRef}
        className="relative bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Editar Dirección
          </h2>
          <button
            onClick={() => !isSaving && animateClose()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Dirección
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Calle, número, colonia"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Ciudad</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="Ciudad"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Código Postal
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="12345"
                disabled={isSaving}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">País</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="México"
              disabled={isSaving}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => !isSaving && animateClose()}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente principal
export function UserProfile() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
    refreshUser,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Cargar órdenes cuando se selecciona la pestaña
  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  // Animación de entrada del perfil
  useEffect(() => {
    const animateEntry = async () => {
      if (headerRef.current && profileRef.current) {
        const gsap = (await import("gsap")).default;

        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );

        gsap.fromTo(
          profileRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" }
        );
      }
    };

    if (!authLoading && isAuthenticated) {
      animateEntry();
    }
  }, [authLoading, isAuthenticated]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    setError(null);

    try {
      const response = await fetch("/api/users/orders", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Error al cargar los pedidos");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Guardar información personal
  const handleSaveProfile = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    const response = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type: "profile", data }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Error al guardar");
    }
    await refreshUser();
  };

  // Guardar dirección
  const handleSaveAddress = async (data: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    const response = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type: "address", data }),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Error al guardar");
    }
    await refreshUser();
  };

  // Estado de carga de autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // No autenticado - redirigir o mostrar mensaje
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-4">
            Inicia sesión para continuar
          </h1>
          <p className="text-muted-foreground mb-6">
            Necesitas una cuenta para ver tu perfil y historial de pedidos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/login"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              Iniciar Sesión
            </a>
            <a
              href="/register"
              className="px-6 py-3 bg-card border border-border rounded-xl font-semibold hover:bg-muted transition-all hover:scale-[1.02]"
            >
              Crear Cuenta
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="font-serif text-2xl font-bold tracking-tighter"
          >
            YISHAQ
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header del perfil */}
        <div ref={headerRef} className="mb-8 opacity-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold">
                ¡Hola, {user.firstName}!
              </h1>
              <p className="text-muted-foreground">
                Bienvenido a tu cuenta YISHAQ
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              Mis Datos
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === "orders"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="w-4 h-4" />
              Mis Pedidos
              {orders.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {orders.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div ref={profileRef} className="opacity-0">
          {/* Tab: Perfil */}
          {activeTab === "profile" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Información Personal */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Información Personal
                  </h2>
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Nombre
                      </label>
                      <p className="font-medium mt-1">{user.firstName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Apellido
                      </label>
                      <p className="font-medium mt-1">{user.lastName}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Email
                    </label>
                    <p className="font-medium mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {user.email}
                    </p>
                  </div>

                  {user.phone && (
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Teléfono
                      </label>
                      <p className="font-medium mt-1 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {user.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Dirección de Envío
                  </h2>
                  <button
                    onClick={() => setIsEditAddressOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                </div>

                {user.address ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Dirección
                      </label>
                      <p className="font-medium mt-1">{user.address}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wider">
                          Ciudad
                        </label>
                        <p className="font-medium mt-1">{user.city || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wider">
                          Código Postal
                        </label>
                        <p className="font-medium mt-1">
                          {user.postalCode || "-"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        País
                      </label>
                      <p className="font-medium mt-1">
                        {user.country || "México"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No tienes una dirección guardada
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Se guardará cuando hagas tu primer pedido
                    </p>
                  </div>
                )}
              </div>

              {/* Badge de cuenta */}
              <div className="lg:col-span-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    {user.role === "admin" ? (
                      <span className="text-primary font-bold text-lg">★</span>
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {user.role === "admin"
                        ? "Cuenta Administrador"
                        : "Cuenta Verificada"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.role === "admin"
                        ? "Tienes acceso completo al panel de administración"
                        : "Tu cuenta está activa y verificada"}
                    </p>
                  </div>
                  {user.role === "admin" && (
                    <a
                      href="/admin"
                      className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Ir al Admin
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Pedidos */}
          {activeTab === "orders" && (
            <div>
              {isLoadingOrders ? (
                <div className="text-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Cargando tus pedidos...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <XCircle className="w-12 h-12 text-red-500/50 mx-auto mb-4" />
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={fetchOrders}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    Aún no tienes pedidos
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Cuando realices tu primera compra, podrás ver aquí el
                    historial de todos tus pedidos.
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02]"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Ir a Comprar
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">
                      Historial de Pedidos
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {orders.length} pedido(s)
                    </span>
                  </div>

                  {orders.map((order, index) => (
                    <OrderCard key={order.id} order={order} index={index} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modales de edición */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
      <EditAddressModal
        isOpen={isEditAddressOpen}
        onClose={() => setIsEditAddressOpen(false)}
        user={user}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
