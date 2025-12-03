/**
 * CheckoutFlow - Flujo de Pago Animado con GSAP
 * Pasarela de pago premium simulada para YISHAQ
 *
 * CORREGIDO: Lógica de transición entre pasos sin pantalla negra
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { CreditCardVisual } from "./CreditCardVisual";
import {
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingBag,
  Truck,
  Shield,
  Copy,
  CheckCircle2,
  MapPin,
  Plus,
} from "lucide-react";

// Tipos
interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CardInfo {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

type PaymentMethod = "card" | "oxxo" | null;
type CheckoutStep = "cart" | "shipping" | "payment" | "processing" | "success";
type AddressOption = "saved" | "new";

const STEPS: CheckoutStep[] = ["cart", "shipping", "payment"];

export function CheckoutFlow() {
  const { items, total, clearCart, isHydrated } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Estados
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [isAnimating, setIsAnimating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [addressOption, setAddressOption] = useState<AddressOption>("saved");
  const [oxxoCode] = useState(() => {
    const prefix = "7501";
    const random = Math.random().toString().slice(2, 14);
    return prefix + random;
  });

  // Verificar si el usuario tiene dirección guardada
  const hasSavedAddress = !!(user?.address && user?.city && user?.postalCode);

  // Refs para animaciones
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Calcular envío
  const shippingCost = total >= 1000 ? 0 : 99;
  const grandTotal = total + shippingCost;

  // Actualizar info de usuario si está autenticado
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        // Si tiene dirección guardada y está seleccionada la opción "saved", usar la dirección guardada
        address:
          hasSavedAddress && addressOption === "saved"
            ? user.address || ""
            : prev.address,
        city:
          hasSavedAddress && addressOption === "saved"
            ? user.city || ""
            : prev.city,
        postalCode:
          hasSavedAddress && addressOption === "saved"
            ? user.postalCode || ""
            : prev.postalCode,
      }));
    }
  }, [user, addressOption, hasSavedAddress]);

  // Función para cambiar de paso con animación GSAP
  const changeStep = useCallback(
    async (newStep: CheckoutStep) => {
      if (isAnimating || newStep === step) return;

      setIsAnimating(true);

      try {
        const gsap = (await import("gsap")).default;
        const container = stepsContainerRef.current;

        if (container) {
          // Determinar dirección de la animación
          const currentIndex = STEPS.indexOf(step as any);
          const newIndex = STEPS.indexOf(newStep as any);
          const direction = newIndex > currentIndex ? 1 : -1;

          // Animar salida del paso actual
          await gsap.to(container, {
            opacity: 0,
            x: -50 * direction,
            duration: 0.25,
            ease: "power2.in",
          });

          // Cambiar paso
          setStep(newStep);

          // Pequeño delay para que React actualice el DOM
          await new Promise((resolve) => setTimeout(resolve, 50));

          // Animar entrada del nuevo paso
          gsap.fromTo(
            container,
            { opacity: 0, x: 50 * direction },
            { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
          );
        } else {
          setStep(newStep);
        }
      } catch (err) {
        // Fallback sin animación
        setStep(newStep);
      }

      setIsAnimating(false);
    },
    [step, isAnimating]
  );

  // Animación de éxito
  useEffect(() => {
    const animateSuccess = async () => {
      if (step === "success" && successRef.current) {
        const gsap = (await import("gsap")).default;

        // Confetti effect
        const particles = successRef.current.querySelectorAll(".confetti");
        gsap.fromTo(
          particles,
          { y: -100, opacity: 0, scale: 0, rotation: 0 },
          {
            y: 300,
            opacity: 1,
            scale: 1,
            rotation: "random(-180, 180)",
            duration: 2,
            stagger: 0.05,
            ease: "power1.out",
          }
        );

        // Check icon animation
        const checkIcon = successRef.current.querySelector(".success-check");
        if (checkIcon) {
          gsap.fromTo(
            checkIcon,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: "elastic.out(1, 0.5)",
              delay: 0.3,
            }
          );
        }
      }
    };
    animateSuccess();
  }, [step]);

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  // Formatear fecha de expiración
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Procesar pago
  const processPayment = async () => {
    setStep("processing");
    setError("");

    try {
      // Simular delay de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // DEBUG: Ver qué items tenemos
      console.log("[Checkout] Items en carrito:", items);

      // Preparar items para enviar - con fallback para items antiguos
      const checkoutItems = items.map((item) => {
        // Si el item no tiene productId (carrito viejo), extraerlo del id
        const realProductId =
          item.productId ||
          item.id.split("-").slice(0, -1).join("-") ||
          item.id;

        console.log(
          `[Checkout] Item: ${item.name}, productId: ${realProductId}`
        );

        return {
          productId: realProductId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
        };
      });

      // Llamar a la API de checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: checkoutItems,
          shippingInfo,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderResult(data.order);
        clearCart();
        setStep("success");
      } else {
        setError(data.error || "Error al procesar el pago");
        setStep("payment");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
      setStep("payment");
    }
  };

  // Generar código OXXO simulado (ya generado en estado inicial)

  // Copiar al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Validar paso de envío
  const isShippingValid = () => {
    return (
      shippingInfo.firstName &&
      shippingInfo.lastName &&
      shippingInfo.email &&
      shippingInfo.address &&
      shippingInfo.city &&
      shippingInfo.postalCode
    );
  };

  // Validar paso de pago
  const isPaymentValid = () => {
    if (paymentMethod === "oxxo") return true;
    if (paymentMethod === "card") {
      return (
        cardInfo.number.replace(/\s/g, "").length >= 16 &&
        cardInfo.name &&
        cardInfo.expiry.length === 5 &&
        cardInfo.cvv.length >= 3
      );
    }
    return false;
  };

  // Mostrar loader mientras se hidrata el carrito desde localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  // Si el carrito está vacío (después de hidratación), mostrar mensaje
  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-serif font-semibold mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-muted-foreground mb-6">
            Agrega algunos productos para continuar
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Ver Colección
          </a>
        </div>
      </div>
    );
  }

  // Processing step - pantalla de carga separada
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative mx-auto w-20 h-20 mb-8">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
          <h2 className="text-2xl font-serif font-semibold mb-2">
            Procesando tu pago...
          </h2>
          <p className="text-muted-foreground">
            Por favor no cierres esta ventana
          </p>
        </div>
      </div>
    );
  }

  // Success step - pantalla de éxito separada
  if (step === "success") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <a
              href="/"
              className="font-serif text-2xl font-bold tracking-tighter"
            >
              YISHAQ
            </a>
          </div>
        </header>

        <div
          ref={successRef}
          className="max-w-2xl mx-auto px-4 py-16 text-center relative overflow-hidden"
        >
          {/* Confetti */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="confetti absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor:
                    i % 3 === 0
                      ? "hsl(var(--primary))"
                      : i % 3 === 1
                      ? "hsl(var(--accent))"
                      : "#ffd700",
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>

          <div className="success-check w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-primary" />
          </div>

          <h1 className="text-4xl font-serif font-bold mb-4">
            ¡Gracias por tu compra!
          </h1>

          {orderResult && (
            <>
              <p className="text-muted-foreground mb-6">
                Tu número de orden es:
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-xl mb-8">
                <span className="font-mono text-xl font-semibold">
                  {orderResult.orderNumber}
                </span>
                <button
                  onClick={() => copyToClipboard(orderResult.orderNumber)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {paymentMethod === "oxxo" && (
                <div className="max-w-md mx-auto p-6 bg-card border border-border rounded-xl mb-8 text-left">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Código de pago OXXO
                  </h3>

                  <div className="bg-white p-4 rounded-lg mb-4">
                    <div className="flex justify-center gap-0.5 mb-2">
                      {[...Array(40)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-black"
                          style={{
                            width: Math.random() > 0.5 ? "2px" : "1px",
                            height: "50px",
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-mono text-center text-black text-sm">
                      {oxxoCode}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monto a pagar:
                      </span>
                      <span className="font-semibold">
                        ${orderResult.total.toFixed(2)} MXN
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vigencia:</span>
                      <span>72 horas</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <p className="text-muted-foreground mb-8">
                  Recibirás un email de confirmación con los detalles de tu
                  pedido.
                </p>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              Seguir comprando
            </a>
            {isAuthenticated && (
              <a
                href="/perfil"
                className="px-8 py-3 bg-card border border-border rounded-xl font-semibold hover:bg-muted transition-all hover:scale-[1.02]"
              >
                Ver mis pedidos
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main checkout flow (cart, shipping, payment)
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

          {/* Progress Steps */}
          <div className="hidden sm:flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step === s
                      ? "bg-primary text-primary-foreground scale-110"
                      : STEPS.indexOf(step as any) > i
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {STEPS.indexOf(step as any) > i ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-1 transition-colors duration-300 ${
                      STEPS.indexOf(step as any) > i ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Pago Seguro</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content - Contenedor animado */}
          <div className="lg:col-span-3">
            <div ref={stepsContainerRef}>
              {/* Step: Cart Review */}
              {step === "cart" && (
                <div>
                  <h1 className="text-3xl font-serif font-semibold mb-6">
                    Revisa tu pedido
                  </h1>

                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="w-20 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          {item.size && (
                            <p className="text-sm text-muted-foreground">
                              Talla: {item.size}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="font-semibold mt-1">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => changeStep("shipping")}
                    disabled={isAnimating}
                    className="mt-6 w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                  >
                    Continuar al envío
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Step: Shipping */}
              {step === "shipping" && (
                <div>
                  <button
                    onClick={() => changeStep("cart")}
                    disabled={isAnimating}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Volver al carrito
                  </button>

                  <h1 className="text-3xl font-serif font-semibold mb-6">
                    Datos de envío
                  </h1>

                  {/* Selector de dirección - Solo si tiene dirección guardada */}
                  {hasSavedAddress && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-3">
                        Dirección de envío
                      </label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Opción: Dirección guardada */}
                        <button
                          type="button"
                          onClick={() => setAddressOption("saved")}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            addressOption === "saved"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                addressOption === "saved"
                                  ? "bg-primary/10"
                                  : "bg-muted"
                              }`}
                            >
                              <MapPin
                                className={`w-5 h-5 ${
                                  addressOption === "saved"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm mb-1">
                                Mi dirección
                              </h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {user?.address}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user?.city}, CP {user?.postalCode}
                              </p>
                            </div>
                            {addressOption === "saved" && (
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            )}
                          </div>
                        </button>

                        {/* Opción: Nueva dirección */}
                        <button
                          type="button"
                          onClick={() => {
                            setAddressOption("new");
                            // Limpiar campos de dirección para nueva dirección
                            setShippingInfo((prev) => ({
                              ...prev,
                              address: "",
                              city: "",
                              postalCode: "",
                            }));
                          }}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            addressOption === "new"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                addressOption === "new"
                                  ? "bg-primary/10"
                                  : "bg-muted"
                              }`}
                            >
                              <Plus
                                className={`w-5 h-5 ${
                                  addressOption === "new"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm mb-1">
                                Nueva dirección
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Enviar a otra dirección
                              </p>
                            </div>
                            {addressOption === "new" && (
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          placeholder="Juan"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          placeholder="Pérez"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="55 1234 5678"
                      />
                    </div>

                    {/* Campos de dirección - Se muestran si no hay dirección guardada O si seleccionó "nueva" */}
                    {(!hasSavedAddress || addressOption === "new") && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Dirección *
                          </label>
                          <input
                            type="text"
                            value={shippingInfo.address}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                address: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="Calle, número, colonia"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Ciudad *
                            </label>
                            <input
                              type="text"
                              value={shippingInfo.city}
                              onChange={(e) =>
                                setShippingInfo({
                                  ...shippingInfo,
                                  city: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                              placeholder="Ciudad de México"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Código Postal *
                            </label>
                            <input
                              type="text"
                              value={shippingInfo.postalCode}
                              onChange={(e) =>
                                setShippingInfo({
                                  ...shippingInfo,
                                  postalCode: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                              placeholder="06600"
                              maxLength={5}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Vista de la dirección guardada seleccionada */}
                    {hasSavedAddress && addressOption === "saved" && (
                      <div className="p-4 bg-card border border-border rounded-xl">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">{user?.address}</p>
                            <p className="text-sm text-muted-foreground">
                              {user?.city}, {user?.country || "México"} - CP{" "}
                              {user?.postalCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shipping info */}
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">
                          {shippingCost === 0
                            ? "¡Envío GRATIS!"
                            : `Envío: $${shippingCost}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {shippingCost === 0
                            ? "Tu pedido supera $1,000"
                            : "Gratis en compras mayores a $1,000"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => changeStep("payment")}
                    disabled={!isShippingValid() || isAnimating}
                    className="mt-6 w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Continuar al pago
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Step: Payment */}
              {step === "payment" && (
                <div>
                  <button
                    onClick={() => changeStep("shipping")}
                    disabled={isAnimating}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Volver a envío
                  </button>

                  <h1 className="text-3xl font-serif font-semibold mb-6">
                    Método de pago
                  </h1>

                  {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
                      {error}
                    </div>
                  )}

                  {/* Payment Method Selection */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => {
                        setPaymentMethod("card");
                        setIsCardFlipped(false);
                      }}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 scale-[1.02]"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <CreditCard
                        className={`w-8 h-8 mb-3 transition-colors ${
                          paymentMethod === "card"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <h3 className="font-semibold mb-1">
                        Tarjeta de Crédito/Débito
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard, AMEX
                      </p>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("oxxo")}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        paymentMethod === "oxxo"
                          ? "border-primary bg-primary/5 scale-[1.02]"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Building2
                        className={`w-8 h-8 mb-3 transition-colors ${
                          paymentMethod === "oxxo"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <h3 className="font-semibold mb-1">Pago en OXXO</h3>
                      <p className="text-sm text-muted-foreground">
                        Paga en efectivo
                      </p>
                    </button>
                  </div>

                  {/* Card Form con CreditCardVisual */}
                  {paymentMethod === "card" && (
                    <div className="space-y-6">
                      {/* Tarjeta 3D Visual */}
                      <CreditCardVisual
                        cardNumber={cardInfo.number}
                        cardName={cardInfo.name}
                        cardExpiry={cardInfo.expiry}
                        cardCvv={cardInfo.cvv}
                        isFlipped={isCardFlipped}
                      />

                      {/* Card Inputs */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Número de tarjeta
                          </label>
                          <input
                            type="text"
                            value={cardInfo.number}
                            onChange={(e) =>
                              setCardInfo({
                                ...cardInfo,
                                number: formatCardNumber(e.target.value),
                              })
                            }
                            onFocus={() => setIsCardFlipped(false)}
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Nombre en la tarjeta
                          </label>
                          <input
                            type="text"
                            value={cardInfo.name}
                            onChange={(e) =>
                              setCardInfo({
                                ...cardInfo,
                                name: e.target.value.toUpperCase(),
                              })
                            }
                            onFocus={() => setIsCardFlipped(false)}
                            className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all uppercase"
                            placeholder="JUAN PÉREZ"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Fecha de expiración
                            </label>
                            <input
                              type="text"
                              value={cardInfo.expiry}
                              onChange={(e) =>
                                setCardInfo({
                                  ...cardInfo,
                                  expiry: formatExpiry(e.target.value),
                                })
                              }
                              onFocus={() => setIsCardFlipped(false)}
                              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={cardInfo.cvv}
                              onChange={(e) =>
                                setCardInfo({
                                  ...cardInfo,
                                  cvv: e.target.value.replace(/\D/g, ""),
                                })
                              }
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OXXO Info */}
                  {paymentMethod === "oxxo" && (
                    <div className="p-6 bg-card border border-border rounded-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#CD1717] rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-white font-bold text-sm">
                            OXXO
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Instrucciones de pago
                          </h3>
                          <ol className="text-sm text-muted-foreground space-y-2">
                            <li>1. Haz clic en "Generar código de pago"</li>
                            <li>2. Acude a cualquier tienda OXXO</li>
                            <li>
                              3. Indica que realizarás un pago de servicio
                            </li>
                            <li>
                              4. Proporciona el código de barras o número de
                              referencia
                            </li>
                            <li>5. Realiza el pago en efectivo</li>
                          </ol>
                          <p className="text-xs text-muted-foreground mt-4">
                            * Tu pedido será procesado una vez confirmado el
                            pago (hasta 24 hrs)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={processPayment}
                    disabled={!isPaymentValid() || isAnimating}
                    className="mt-6 w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {paymentMethod === "card"
                      ? `Pagar $${grandTotal.toFixed(2)}`
                      : "Generar código de pago"}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 p-6 bg-card border border-border rounded-2xl">
              <h2 className="font-serif text-xl font-semibold mb-4">
                Resumen del pedido
              </h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-14 bg-muted rounded overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.size && `Talla ${item.size} • `}Cant.{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className={shippingCost === 0 ? "text-primary" : ""}>
                    {shippingCost === 0 ? "GRATIS" : `$${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Envío en 3-5 días hábiles</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Garantía de calidad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
