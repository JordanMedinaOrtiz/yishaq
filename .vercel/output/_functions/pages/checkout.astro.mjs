import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_CJOMfcep.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DejvdVPx.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { u as useAuth, A as AuthProvider } from '../chunks/AuthContext_DjGZTLld.mjs';
import { u as useCart, C as CartProvider } from '../chunks/CartContext_qAEPAAmN.mjs';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ShoppingBag, CheckCircle2, Check, Copy, Building2, Shield, ChevronRight, ChevronLeft, MapPin, Plus, Truck, CreditCard } from 'lucide-react';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

function detectCardType(number) {
  const cleanNumber = number.replace(/\s/g, "");
  if (cleanNumber.startsWith("4")) return "visa";
  if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2"))
    return "mastercard";
  if (cleanNumber.startsWith("3")) return "amex";
  return "generic";
}
const VisaLogo = () => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 750 471", className: "w-16 h-10", children: /* @__PURE__ */ jsx(
  "path",
  {
    d: "M278.198 334.228l33.36-195.763h53.358l-33.384 195.763H278.198zm246.11-191.54c-10.57-3.966-27.135-8.222-47.822-8.222-52.725 0-89.863 26.551-90.18 64.604-.297 28.129 26.515 43.822 46.754 53.185 20.77 9.597 27.752 15.716 27.654 24.283-.133 13.123-16.586 19.116-31.924 19.116-21.355 0-32.701-2.967-50.225-10.274l-6.877-3.112-7.488 43.823c12.463 5.466 35.508 10.199 59.438 10.445 56.09 0 92.502-26.248 92.916-66.884.199-22.27-14.016-39.216-44.801-53.188-18.65-9.056-30.072-15.099-29.951-24.269 0-8.137 9.668-16.838 30.559-16.838 17.447-.271 30.088 3.534 39.936 7.5l4.781 2.259 7.23-42.428zm137.31-4.223h-41.232c-12.773 0-22.332 3.486-27.941 16.234l-79.244 179.402h56.031s9.16-24.121 11.232-29.418c6.125 0 60.555.084 68.336.084 1.596 6.854 6.492 29.334 6.492 29.334h49.512l-43.186-195.636zm-65.418 126.408c4.414-11.279 21.26-54.724 21.26-54.724-.314.521 4.381-11.334 7.074-18.684l3.607 16.878s10.217 46.729 12.352 56.53h-44.293zM209.877 138.465l-52.24 133.496-5.567-27.129c-9.726-31.274-40.025-65.157-73.898-82.12l47.767 171.203 56.455-.063 84.004-195.386h-56.521",
    fill: "#fff"
  }
) });
const MastercardLogo = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 152.407 108", className: "w-16 h-10", children: [
  /* @__PURE__ */ jsx("circle", { cx: "36.4", cy: "54", r: "36.4", fill: "#eb001b" }),
  /* @__PURE__ */ jsx("circle", { cx: "115.6", cy: "54", r: "36.4", fill: "#f79e1b" }),
  /* @__PURE__ */ jsx(
    "path",
    {
      d: "M76.2 17.6a36.3 36.3 0 0 0-13.4 28.4 36.3 36.3 0 0 0 13.4 28.4 36.3 36.3 0 0 0 13.4-28.4 36.3 36.3 0 0 0-13.4-28.4z",
      fill: "#ff5f00"
    }
  )
] });
const AmexLogo = () => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 750 471", className: "w-16 h-10", children: [
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: "#fff",
      d: "M0 41C0 18 18 0 41 0h668c23 0 41 18 41 41v389c0 23-18 41-41 41H41c-23 0-41-18-41-41V41z"
    }
  ),
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: "#016fd0",
      d: "M0 221v209c0 23 18 41 41 41h668c23 0 41-18 41-41V221H0z"
    }
  ),
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: "#016fd0",
      d: "M124 163l-62 144h66l9-22h21l9 22h73v-17l6 17h37l7-17v17h148l17-18 16 18h76l-62-72 62-72h-75l-17 17-15-17H271l-14 32-14-32h-66v16l-8-16h-45zm15 19h32l37 84v-84h35l28 60 26-60h35v107h-22l-1-84-31 84h-19l-32-84v84h-44l-10-23h-50l-9 23h-24l44-107zm8 65l-15-37-15 37h30zm177-65h87l26 28 27-28h27l-40 54 40 53h-28l-26-29-28 29h-85V182zm22 18v23h53l24-24-23-23-54 1v23z"
    }
  )
] });
const ChipIcon = () => /* @__PURE__ */ jsxs("div", { className: "w-12 h-9 rounded-md overflow-hidden relative", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-500" }),
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid grid-cols-3 gap-px p-1", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "bg-yellow-600/30 rounded-sm" }, i)) })
] });
function CreditCardVisual({
  cardNumber,
  cardName,
  cardExpiry,
  cardCvv,
  isFlipped
}) {
  const cardRef = useRef(null);
  const [cardType, setCardType] = useState("generic");
  useEffect(() => {
    setCardType(detectCardType(cardNumber));
  }, [cardNumber]);
  useEffect(() => {
    const animateFlip = async () => {
      if (cardRef.current) {
        const gsap = (await import('gsap')).default;
        gsap.to(cardRef.current, {
          rotateY: isFlipped ? 180 : 0,
          duration: 0.6,
          ease: "power2.inOut"
        });
      }
    };
    animateFlip();
  }, [isFlipped]);
  useEffect(() => {
    const animateTypeChange = async () => {
      if (cardRef.current) {
        const gsap = (await import('gsap')).default;
        gsap.fromTo(
          cardRef.current,
          { scale: 0.95 },
          { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
      }
    };
    if (cardType !== "generic") {
      animateTypeChange();
    }
  }, [cardType]);
  const getCardGradient = () => {
    switch (cardType) {
      case "visa":
        return "linear-gradient(135deg, #1a1f71 0%, #1434cb 40%, #0d47a1 100%)";
      case "mastercard":
        return "linear-gradient(135deg, #1a1a2e 0%, #eb001b 50%, #ff5f00 100%)";
      case "amex":
        return "linear-gradient(135deg, #016fd0 0%, #00aeef 50%, #016fd0 100%)";
      default:
        return "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";
    }
  };
  const getBackGradient = () => {
    switch (cardType) {
      case "visa":
        return "linear-gradient(135deg, #0d47a1 0%, #1434cb 50%, #1a1f71 100%)";
      case "mastercard":
        return "linear-gradient(135deg, #ff5f00 0%, #eb001b 50%, #1a1a2e 100%)";
      case "amex":
        return "linear-gradient(135deg, #016fd0 0%, #00aeef 50%, #016fd0 100%)";
      default:
        return "linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)";
    }
  };
  const renderLogo = () => {
    switch (cardType) {
      case "visa":
        return /* @__PURE__ */ jsx(VisaLogo, {});
      case "mastercard":
        return /* @__PURE__ */ jsx(MastercardLogo, {});
      case "amex":
        return /* @__PURE__ */ jsx(AmexLogo, {});
      default:
        return /* @__PURE__ */ jsx("div", { className: "w-16 h-10 rounded bg-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white/60 text-xs font-medium", children: "CARD" }) });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "perspective-1000 w-full max-w-sm mx-auto", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: cardRef,
        className: "relative w-full aspect-[1.586/1] cursor-pointer",
        style: { transformStyle: "preserve-3d" },
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "absolute inset-0 rounded-2xl p-6 text-white overflow-hidden",
              style: {
                backfaceVisibility: "hidden",
                background: getCardGradient(),
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                transition: "background 0.5s ease"
              },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10",
                      style: {
                        background: "radial-gradient(circle, white 0%, transparent 70%)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-5",
                      style: {
                        background: "radial-gradient(circle, white 0%, transparent 70%)"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative z-10 h-full flex flex-col", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
                    /* @__PURE__ */ jsx(ChipIcon, {}),
                    /* @__PURE__ */ jsx("div", { className: "transition-all duration-300", children: renderLogo() })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center", children: /* @__PURE__ */ jsx("p", { className: "font-mono text-xl sm:text-2xl tracking-[0.2em] text-white drop-shadow-lg", children: cardNumber || "•••• •••• •••• ••••" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 mr-4", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/60 uppercase tracking-wider mb-1", children: "Titular de la tarjeta" }),
                      /* @__PURE__ */ jsx("p", { className: "font-medium uppercase tracking-wide text-sm truncate", children: cardName || "TU NOMBRE" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/60 uppercase tracking-wider mb-1", children: "Expira" }),
                      /* @__PURE__ */ jsx("p", { className: "font-mono text-sm", children: cardExpiry || "MM/YY" })
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "absolute inset-0 rounded-2xl text-white overflow-hidden",
              style: {
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: getBackGradient(),
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                transition: "background 0.5s ease"
              },
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-full h-12 bg-black/70 mt-6" }),
                /* @__PURE__ */ jsx("div", { className: "px-6 mt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "h-10 bg-white/90 rounded flex items-center px-3", children: /* @__PURE__ */ jsx("div", { className: "flex-1 border-b border-dashed border-gray-400" }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/60 mt-1 uppercase", children: "Firma autorizada" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "bg-white px-4 py-2 rounded", children: /* @__PURE__ */ jsx("p", { className: "font-mono text-lg text-black font-bold tracking-widest", children: cardCvv || "•••" }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/60 mt-1 uppercase", children: "CVV" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 right-6", children: /* @__PURE__ */ jsx("div", { className: "opacity-50 scale-75", children: renderLogo() }) }),
                /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-6", children: /* @__PURE__ */ jsx("p", { className: "text-[8px] text-white/40 max-w-[180px]", children: "Esta tarjeta es propiedad del banco emisor. El uso no autorizado está prohibido." }) })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
      cardType === "visa" && "💳 Visa detectada",
      cardType === "mastercard" && "💳 Mastercard detectada",
      cardType === "amex" && "💳 American Express detectada",
      cardType === "generic" && "Ingresa el número de tu tarjeta"
    ] }) })
  ] });
}

const STEPS = ["cart", "shipping", "payment"];
function CheckoutFlow() {
  const { items, total, clearCart, isHydrated } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState("cart");
  const [isAnimating, setIsAnimating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  });
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [addressOption, setAddressOption] = useState("saved");
  const [oxxoCode] = useState(() => {
    const prefix = "7501";
    const random = Math.random().toString().slice(2, 14);
    return prefix + random;
  });
  const hasSavedAddress = !!(user?.address && user?.city && user?.postalCode);
  const stepsContainerRef = useRef(null);
  const successRef = useRef(null);
  const shippingCost = total >= 1e3 ? 0 : 99;
  const grandTotal = total + shippingCost;
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        // Si tiene dirección guardada y está seleccionada la opción "saved", usar la dirección guardada
        address: hasSavedAddress && addressOption === "saved" ? user.address || "" : prev.address,
        city: hasSavedAddress && addressOption === "saved" ? user.city || "" : prev.city,
        postalCode: hasSavedAddress && addressOption === "saved" ? user.postalCode || "" : prev.postalCode
      }));
    }
  }, [user, addressOption, hasSavedAddress]);
  const changeStep = useCallback(
    async (newStep) => {
      if (isAnimating || newStep === step) return;
      setIsAnimating(true);
      try {
        const gsap = (await import('gsap')).default;
        const container = stepsContainerRef.current;
        if (container) {
          const currentIndex = STEPS.indexOf(step);
          const newIndex = STEPS.indexOf(newStep);
          const direction = newIndex > currentIndex ? 1 : -1;
          await gsap.to(container, {
            opacity: 0,
            x: -50 * direction,
            duration: 0.25,
            ease: "power2.in"
          });
          setStep(newStep);
          await new Promise((resolve) => setTimeout(resolve, 50));
          gsap.fromTo(
            container,
            { opacity: 0, x: 50 * direction },
            { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
          );
        } else {
          setStep(newStep);
        }
      } catch (err) {
        setStep(newStep);
      }
      setIsAnimating(false);
    },
    [step, isAnimating]
  );
  useEffect(() => {
    const animateSuccess = async () => {
      if (step === "success" && successRef.current) {
        const gsap = (await import('gsap')).default;
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
            ease: "power1.out"
          }
        );
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
              delay: 0.3
            }
          );
        }
      }
    };
    animateSuccess();
  }, [step]);
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };
  const processPayment = async () => {
    setStep("processing");
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      console.log("[Checkout] Items en carrito:", items);
      const checkoutItems = items.map((item) => {
        const realProductId = item.productId || item.id.split("-").slice(0, -1).join("-") || item.id;
        console.log(
          `[Checkout] Item: ${item.name}, productId: ${realProductId}`
        );
        return {
          productId: realProductId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image
        };
      });
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: checkoutItems,
          shippingInfo,
          paymentMethod
        })
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
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const isShippingValid = () => {
    return shippingInfo.firstName && shippingInfo.lastName && shippingInfo.email && shippingInfo.address && shippingInfo.city && shippingInfo.postalCode;
  };
  const isPaymentValid = () => {
    if (paymentMethod === "oxxo") return true;
    if (paymentMethod === "card") {
      return cardInfo.number.replace(/\s/g, "").length >= 16 && cardInfo.name && cardInfo.expiry.length === 5 && cardInfo.cvv.length >= 3;
    }
    return false;
  };
  if (!isHydrated) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative mx-auto w-16 h-16 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-4 border-primary/20 rounded-full" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Cargando tu carrito..." })
    ] }) });
  }
  if (items.length === 0 && step !== "success") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(ShoppingBag, { className: "w-16 h-16 mx-auto text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-semibold mb-2", children: "Tu carrito está vacío" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: "Agrega algunos productos para continuar" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors",
          children: "Ver Colección"
        }
      )
    ] }) });
  }
  if (step === "processing") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative mx-auto w-20 h-20 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 border-4 border-primary/20 rounded-full" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif font-semibold mb-2", children: "Procesando tu pago..." }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Por favor no cierres esta ventana" })
    ] }) });
  }
  if (step === "success") {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4 py-4", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "font-serif text-2xl font-bold tracking-tighter",
          children: "YISHAQ"
        }
      ) }) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          ref: successRef,
          className: "max-w-2xl mx-auto px-4 py-16 text-center relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none", children: [...Array(30)].map((_, i) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "confetti absolute w-3 h-3 rounded-sm",
                style: {
                  left: `${Math.random() * 100}%`,
                  backgroundColor: i % 3 === 0 ? "hsl(var(--primary))" : i % 3 === 1 ? "hsl(var(--accent))" : "#ffd700",
                  transform: `rotate(${Math.random() * 360}deg)`
                }
              },
              i
            )) }),
            /* @__PURE__ */ jsx("div", { className: "success-check w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-14 h-14 text-primary" }) }),
            /* @__PURE__ */ jsx("h1", { className: "text-4xl font-serif font-bold mb-4", children: "¡Gracias por tu compra!" }),
            orderResult && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: "Tu número de orden es:" }),
              /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-xl mb-8", children: [
                /* @__PURE__ */ jsx("span", { className: "font-mono text-xl font-semibold", children: orderResult.orderNumber }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => copyToClipboard(orderResult.orderNumber),
                    className: "p-2 hover:bg-muted rounded-lg transition-colors",
                    children: copied ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" })
                  }
                )
              ] }),
              paymentMethod === "oxxo" && /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto p-6 bg-card border border-border rounded-xl mb-8 text-left", children: [
                /* @__PURE__ */ jsxs("h3", { className: "font-semibold mb-4 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Building2, { className: "w-5 h-5 text-primary" }),
                  "Código de pago OXXO"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg mb-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-0.5 mb-2", children: [...Array(40)].map((_, i) => /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "bg-black",
                      style: {
                        width: Math.random() > 0.5 ? "2px" : "1px",
                        height: "50px"
                      }
                    },
                    i
                  )) }),
                  /* @__PURE__ */ jsx("p", { className: "font-mono text-center text-black text-sm", children: oxxoCode })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Monto a pagar:" }),
                    /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                      "$",
                      orderResult.total.toFixed(2),
                      " MXN"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Vigencia:" }),
                    /* @__PURE__ */ jsx("span", { children: "72 horas" })
                  ] })
                ] })
              ] }),
              paymentMethod === "card" && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-8", children: "Recibirás un email de confirmación con los detalles de tu pedido." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/",
                  className: "px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02]",
                  children: "Seguir comprando"
                }
              ),
              isAuthenticated && /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/perfil",
                  className: "px-8 py-3 bg-card border border-border rounded-xl font-semibold hover:bg-muted transition-all hover:scale-[1.02]",
                  children: "Ver mis pedidos"
                }
              )
            ] })
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "font-serif text-2xl font-bold tracking-tighter",
          children: "YISHAQ"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "hidden sm:flex items-center gap-2", children: STEPS.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${step === s ? "bg-primary text-primary-foreground scale-110" : STEPS.indexOf(step) > i ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`,
            children: STEPS.indexOf(step) > i ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }) : i + 1
          }
        ),
        i < STEPS.length - 1 && /* @__PURE__ */ jsx(
          "div",
          {
            className: `w-12 h-0.5 mx-1 transition-colors duration-300 ${STEPS.indexOf(step) > i ? "bg-primary" : "bg-muted"}`
          }
        )
      ] }, s)) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Pago Seguro" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "max-w-6xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsxs("div", { ref: stepsContainerRef, children: [
        step === "cart" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-serif font-semibold mb-6", children: "Revisa tu pedido" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: items.map((item, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors",
              style: { animationDelay: `${index * 100}ms` },
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-20 h-24 bg-muted rounded-lg overflow-hidden shrink-0", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: item.image,
                    alt: item.name,
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-medium", children: item.name }),
                  item.size && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                    "Talla: ",
                    item.size
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                    "Cantidad: ",
                    item.quantity
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "font-semibold mt-1", children: [
                    "$",
                    (item.price * item.quantity).toFixed(2)
                  ] })
                ] })
              ]
            },
            `${item.id}-${item.size}`
          )) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => changeStep("shipping"),
              disabled: isAnimating,
              className: "mt-6 w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70",
              children: [
                "Continuar al envío",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
              ]
            }
          )
        ] }),
        step === "shipping" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => changeStep("cart"),
              disabled: isAnimating,
              className: "flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 transition-colors",
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
                "Volver al carrito"
              ]
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-serif font-semibold mb-6", children: "Datos de envío" }),
          hasSavedAddress && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-3", children: "Dirección de envío" }),
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setAddressOption("saved"),
                  className: `p-4 rounded-xl border-2 transition-all duration-300 text-left ${addressOption === "saved" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`,
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${addressOption === "saved" ? "bg-primary/10" : "bg-muted"}`,
                        children: /* @__PURE__ */ jsx(
                          MapPin,
                          {
                            className: `w-5 h-5 ${addressOption === "saved" ? "text-primary" : "text-muted-foreground"}`
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm mb-1", children: "Mi dirección" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: user?.address }),
                      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        user?.city,
                        ", CP ",
                        user?.postalCode
                      ] })
                    ] }),
                    addressOption === "saved" && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-primary shrink-0" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setAddressOption("new");
                    setShippingInfo((prev) => ({
                      ...prev,
                      address: "",
                      city: "",
                      postalCode: ""
                    }));
                  },
                  className: `p-4 rounded-xl border-2 transition-all duration-300 text-left ${addressOption === "new" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`,
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${addressOption === "new" ? "bg-primary/10" : "bg-muted"}`,
                        children: /* @__PURE__ */ jsx(
                          Plus,
                          {
                            className: `w-5 h-5 ${addressOption === "new" ? "text-primary" : "text-muted-foreground"}`
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm mb-1", children: "Nueva dirección" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Enviar a otra dirección" })
                    ] }),
                    addressOption === "new" && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-primary shrink-0" })
                  ] })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Nombre *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: shippingInfo.firstName,
                    onChange: (e) => setShippingInfo({
                      ...shippingInfo,
                      firstName: e.target.value
                    }),
                    className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all",
                    placeholder: "Juan"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Apellido *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: shippingInfo.lastName,
                    onChange: (e) => setShippingInfo({
                      ...shippingInfo,
                      lastName: e.target.value
                    }),
                    className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all",
                    placeholder: "Pérez"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Email *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: shippingInfo.email,
                  onChange: (e) => setShippingInfo({
                    ...shippingInfo,
                    email: e.target.value
                  }),
                  className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all",
                  placeholder: "tu@email.com"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Teléfono" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  value: shippingInfo.phone,
                  onChange: (e) => setShippingInfo({
                    ...shippingInfo,
                    phone: e.target.value
                  }),
                  className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all",
                  placeholder: "55 1234 5678"
                }
              )
            ] }),
            (!hasSavedAddress || addressOption === "new") && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Dirección *" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: shippingInfo.address,
                    onChange: (e) => setShippingInfo({
                      ...shippingInfo,
                      address: e.target.value
                    }),
                    className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all",
                    placeholder: "Calle, número, colonia"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Ciudad *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: shippingInfo.city,
                      onChange: (e) => setShippingInfo({
                        ...shippingInfo,
                        city: e.target.value
                      }),
                      className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all",
                      placeholder: "Ciudad de México"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Código Postal *" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: shippingInfo.postalCode,
                      onChange: (e) => setShippingInfo({
                        ...shippingInfo,
                        postalCode: e.target.value
                      }),
                      className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all",
                      placeholder: "06600",
                      maxLength: 5
                    }
                  )
                ] })
              ] })
            ] }),
            hasSavedAddress && addressOption === "saved" && /* @__PURE__ */ jsx("div", { className: "p-4 bg-card border border-border rounded-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-primary mt-0.5" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: user?.address }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  user?.city,
                  ", ",
                  user?.country || "México",
                  " - CP",
                  " ",
                  user?.postalCode
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Truck, { className: "w-5 h-5 text-primary" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium", children: shippingCost === 0 ? "¡Envío GRATIS!" : `Envío: $${shippingCost}` }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: shippingCost === 0 ? "Tu pedido supera $1,000" : "Gratis en compras mayores a $1,000" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => changeStep("payment"),
              disabled: !isShippingValid() || isAnimating,
              className: "mt-6 w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              children: [
                "Continuar al pago",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
              ]
            }
          )
        ] }),
        step === "payment" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => changeStep("shipping"),
              disabled: isAnimating,
              className: "flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 transition-colors",
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
                "Volver a envío"
              ]
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-serif font-semibold mb-6", children: "Método de pago" }),
          error && /* @__PURE__ */ jsx("div", { className: "mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive", children: error }),
          /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4 mb-6", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  setPaymentMethod("card");
                  setIsCardFlipped(false);
                },
                className: `p-6 rounded-xl border-2 transition-all duration-300 text-left ${paymentMethod === "card" ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    CreditCard,
                    {
                      className: `w-8 h-8 mb-3 transition-colors ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`
                    }
                  ),
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-1", children: "Tarjeta de Crédito/Débito" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Visa, Mastercard, AMEX" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setPaymentMethod("oxxo"),
                className: `p-6 rounded-xl border-2 transition-all duration-300 text-left ${paymentMethod === "oxxo" ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    Building2,
                    {
                      className: `w-8 h-8 mb-3 transition-colors ${paymentMethod === "oxxo" ? "text-primary" : "text-muted-foreground"}`
                    }
                  ),
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-1", children: "Pago en OXXO" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Paga en efectivo" })
                ]
              }
            )
          ] }),
          paymentMethod === "card" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx(
              CreditCardVisual,
              {
                cardNumber: cardInfo.number,
                cardName: cardInfo.name,
                cardExpiry: cardInfo.expiry,
                cardCvv: cardInfo.cvv,
                isFlipped: isCardFlipped
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Número de tarjeta" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: cardInfo.number,
                    onChange: (e) => setCardInfo({
                      ...cardInfo,
                      number: formatCardNumber(e.target.value)
                    }),
                    onFocus: () => setIsCardFlipped(false),
                    className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono",
                    placeholder: "1234 5678 9012 3456",
                    maxLength: 19
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Nombre en la tarjeta" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: cardInfo.name,
                    onChange: (e) => setCardInfo({
                      ...cardInfo,
                      name: e.target.value.toUpperCase()
                    }),
                    onFocus: () => setIsCardFlipped(false),
                    className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all uppercase",
                    placeholder: "JUAN PÉREZ"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Fecha de expiración" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: cardInfo.expiry,
                      onChange: (e) => setCardInfo({
                        ...cardInfo,
                        expiry: formatExpiry(e.target.value)
                      }),
                      onFocus: () => setIsCardFlipped(false),
                      className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono",
                      placeholder: "MM/YY",
                      maxLength: 5
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "CVV" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: cardInfo.cvv,
                      onChange: (e) => setCardInfo({
                        ...cardInfo,
                        cvv: e.target.value.replace(/\D/g, "")
                      }),
                      onFocus: () => setIsCardFlipped(true),
                      onBlur: () => setIsCardFlipped(false),
                      className: "w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono",
                      placeholder: "123",
                      maxLength: 4
                    }
                  )
                ] })
              ] })
            ] })
          ] }),
          paymentMethod === "oxxo" && /* @__PURE__ */ jsx("div", { className: "p-6 bg-card border border-border rounded-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[#CD1717] rounded-lg flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-sm", children: "OXXO" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Instrucciones de pago" }),
              /* @__PURE__ */ jsxs("ol", { className: "text-sm text-muted-foreground space-y-2", children: [
                /* @__PURE__ */ jsx("li", { children: '1. Haz clic en "Generar código de pago"' }),
                /* @__PURE__ */ jsx("li", { children: "2. Acude a cualquier tienda OXXO" }),
                /* @__PURE__ */ jsx("li", { children: "3. Indica que realizarás un pago de servicio" }),
                /* @__PURE__ */ jsx("li", { children: "4. Proporciona el código de barras o número de referencia" }),
                /* @__PURE__ */ jsx("li", { children: "5. Realiza el pago en efectivo" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-4", children: "* Tu pedido será procesado una vez confirmado el pago (hasta 24 hrs)" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: processPayment,
              disabled: !isPaymentValid() || isAnimating,
              className: "mt-6 w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              children: [
                paymentMethod === "card" ? `Pagar $${grandTotal.toFixed(2)}` : "Generar código de pago",
                /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-24 p-6 bg-card border border-border rounded-2xl", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl font-semibold mb-4", children: "Resumen del pedido" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 mb-6 max-h-64 overflow-y-auto", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-14 bg-muted rounded overflow-hidden shrink-0", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: item.image,
              alt: item.name,
              className: "w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: item.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              item.size && `Talla ${item.size} • `,
              "Cant.",
              " ",
              item.quantity
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold", children: [
            "$",
            (item.price * item.quantity).toFixed(2)
          ] })
        ] }, item.id)) }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-4 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "$",
              total.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Envío" }),
            /* @__PURE__ */ jsx("span", { className: shippingCost === 0 ? "text-primary" : "", children: shippingCost === 0 ? "GRATIS" : `$${shippingCost}` })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-lg font-semibold pt-2 border-t border-border", children: [
            /* @__PURE__ */ jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "$",
              grandTotal.toFixed(2)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-6 border-t border-border space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Pago 100% seguro" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Truck, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Envío en 3-5 días hábiles" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsx("span", { children: "Garantía de calidad" })
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}

function CheckoutPage() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsx(CheckoutFlow, {}) }) });
}

const $$Checkout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Checkout | YISHAQ" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CheckoutPage", CheckoutPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jorda/Dev/yishaq/src/components/checkout/CheckoutPage", "client:component-export": "CheckoutPage" })} ` })} `;
}, "C:/Users/jorda/Dev/yishaq/src/pages/checkout.astro", void 0);

const $$file = "C:/Users/jorda/Dev/yishaq/src/pages/checkout.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Checkout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
