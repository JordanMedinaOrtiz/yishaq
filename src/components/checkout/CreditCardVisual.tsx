/**
 * CreditCardVisual - Tarjeta de Crédito 3D Interactiva
 * Detecta Visa/Mastercard y realiza flip animation con GSAP
 */

import { useEffect, useRef, useState } from "react";

interface CreditCardVisualProps {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  isFlipped: boolean;
}

// Detectar tipo de tarjeta basado en el número
function detectCardType(
  number: string
): "visa" | "mastercard" | "amex" | "generic" {
  const cleanNumber = number.replace(/\s/g, "");
  if (cleanNumber.startsWith("4")) return "visa";
  if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2"))
    return "mastercard";
  if (cleanNumber.startsWith("3")) return "amex";
  return "generic";
}

// Logos SVG inline para evitar dependencias externas
const VisaLogo = () => (
  <svg viewBox="0 0 750 471" className="w-16 h-10">
    <path
      d="M278.198 334.228l33.36-195.763h53.358l-33.384 195.763H278.198zm246.11-191.54c-10.57-3.966-27.135-8.222-47.822-8.222-52.725 0-89.863 26.551-90.18 64.604-.297 28.129 26.515 43.822 46.754 53.185 20.77 9.597 27.752 15.716 27.654 24.283-.133 13.123-16.586 19.116-31.924 19.116-21.355 0-32.701-2.967-50.225-10.274l-6.877-3.112-7.488 43.823c12.463 5.466 35.508 10.199 59.438 10.445 56.09 0 92.502-26.248 92.916-66.884.199-22.27-14.016-39.216-44.801-53.188-18.65-9.056-30.072-15.099-29.951-24.269 0-8.137 9.668-16.838 30.559-16.838 17.447-.271 30.088 3.534 39.936 7.5l4.781 2.259 7.23-42.428zm137.31-4.223h-41.232c-12.773 0-22.332 3.486-27.941 16.234l-79.244 179.402h56.031s9.16-24.121 11.232-29.418c6.125 0 60.555.084 68.336.084 1.596 6.854 6.492 29.334 6.492 29.334h49.512l-43.186-195.636zm-65.418 126.408c4.414-11.279 21.26-54.724 21.26-54.724-.314.521 4.381-11.334 7.074-18.684l3.607 16.878s10.217 46.729 12.352 56.53h-44.293zM209.877 138.465l-52.24 133.496-5.567-27.129c-9.726-31.274-40.025-65.157-73.898-82.12l47.767 171.203 56.455-.063 84.004-195.386h-56.521"
      fill="#fff"
    />
  </svg>
);

const MastercardLogo = () => (
  <svg viewBox="0 0 152.407 108" className="w-16 h-10">
    <circle cx="36.4" cy="54" r="36.4" fill="#eb001b" />
    <circle cx="115.6" cy="54" r="36.4" fill="#f79e1b" />
    <path
      d="M76.2 17.6a36.3 36.3 0 0 0-13.4 28.4 36.3 36.3 0 0 0 13.4 28.4 36.3 36.3 0 0 0 13.4-28.4 36.3 36.3 0 0 0-13.4-28.4z"
      fill="#ff5f00"
    />
  </svg>
);

const AmexLogo = () => (
  <svg viewBox="0 0 750 471" className="w-16 h-10">
    <path
      fill="#fff"
      d="M0 41C0 18 18 0 41 0h668c23 0 41 18 41 41v389c0 23-18 41-41 41H41c-23 0-41-18-41-41V41z"
    />
    <path
      fill="#016fd0"
      d="M0 221v209c0 23 18 41 41 41h668c23 0 41-18 41-41V221H0z"
    />
    <path
      fill="#016fd0"
      d="M124 163l-62 144h66l9-22h21l9 22h73v-17l6 17h37l7-17v17h148l17-18 16 18h76l-62-72 62-72h-75l-17 17-15-17H271l-14 32-14-32h-66v16l-8-16h-45zm15 19h32l37 84v-84h35l28 60 26-60h35v107h-22l-1-84-31 84h-19l-32-84v84h-44l-10-23h-50l-9 23h-24l44-107zm8 65l-15-37-15 37h30zm177-65h87l26 28 27-28h27l-40 54 40 53h-28l-26-29-28 29h-85V182zm22 18v23h53l24-24-23-23-54 1v23z"
    />
  </svg>
);

const ChipIcon = () => (
  <div className="w-12 h-9 rounded-md overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-500" />
    <div className="absolute inset-0 grid grid-cols-3 gap-px p-1">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-yellow-600/30 rounded-sm" />
      ))}
    </div>
  </div>
);

export function CreditCardVisual({
  cardNumber,
  cardName,
  cardExpiry,
  cardCvv,
  isFlipped,
}: CreditCardVisualProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardType, setCardType] = useState<
    "visa" | "mastercard" | "amex" | "generic"
  >("generic");

  // Detectar tipo de tarjeta cuando cambia el número
  useEffect(() => {
    setCardType(detectCardType(cardNumber));
  }, [cardNumber]);

  // Animación de flip con GSAP
  useEffect(() => {
    const animateFlip = async () => {
      if (cardRef.current) {
        const gsap = (await import("gsap")).default;
        gsap.to(cardRef.current, {
          rotateY: isFlipped ? 180 : 0,
          duration: 0.6,
          ease: "power2.inOut",
        });
      }
    };
    animateFlip();
  }, [isFlipped]);

  // Animación de cambio de tipo de tarjeta
  useEffect(() => {
    const animateTypeChange = async () => {
      if (cardRef.current) {
        const gsap = (await import("gsap")).default;
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

  // Estilos de gradiente según tipo de tarjeta
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
        return <VisaLogo />;
      case "mastercard":
        return <MastercardLogo />;
      case "amex":
        return <AmexLogo />;
      default:
        return (
          <div className="w-16 h-10 rounded bg-white/20 flex items-center justify-center">
            <span className="text-white/60 text-xs font-medium">CARD</span>
          </div>
        );
    }
  };

  return (
    <div className="perspective-1000 w-full max-w-sm mx-auto">
      <div
        ref={cardRef}
        className="relative w-full aspect-[1.586/1] cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 rounded-2xl p-6 text-white overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: getCardGradient(),
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            transition: "background 0.5s ease",
          }}
        >
          {/* Decorative patterns */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
              style={{
                background:
                  "radial-gradient(circle, white 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-5"
              style={{
                background:
                  "radial-gradient(circle, white 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Card content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Top row: Chip + Logo */}
            <div className="flex justify-between items-start mb-6">
              <ChipIcon />
              <div className="transition-all duration-300">{renderLogo()}</div>
            </div>

            {/* Card number */}
            <div className="flex-1 flex items-center">
              <p className="font-mono text-xl sm:text-2xl tracking-[0.2em] text-white drop-shadow-lg">
                {cardNumber || "•••• •••• •••• ••••"}
              </p>
            </div>

            {/* Bottom row: Name + Expiry */}
            <div className="flex justify-between items-end">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">
                  Titular de la tarjeta
                </p>
                <p className="font-medium uppercase tracking-wide text-sm truncate">
                  {cardName || "TU NOMBRE"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">
                  Expira
                </p>
                <p className="font-mono text-sm">{cardExpiry || "MM/YY"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className="absolute inset-0 rounded-2xl text-white overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: getBackGradient(),
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            transition: "background 0.5s ease",
          }}
        >
          {/* Magnetic strip */}
          <div className="w-full h-12 bg-black/70 mt-6" />

          {/* Signature strip and CVV */}
          <div className="px-6 mt-6">
            <div className="flex items-center gap-4">
              {/* Signature area */}
              <div className="flex-1">
                <div className="h-10 bg-white/90 rounded flex items-center px-3">
                  <div className="flex-1 border-b border-dashed border-gray-400" />
                </div>
                <p className="text-[10px] text-white/60 mt-1 uppercase">
                  Firma autorizada
                </p>
              </div>

              {/* CVV */}
              <div className="text-center">
                <div className="bg-white px-4 py-2 rounded">
                  <p className="font-mono text-lg text-black font-bold tracking-widest">
                    {cardCvv || "•••"}
                  </p>
                </div>
                <p className="text-[10px] text-white/60 mt-1 uppercase">CVV</p>
              </div>
            </div>
          </div>

          {/* Card network logo on back */}
          <div className="absolute bottom-4 right-6">
            <div className="opacity-50 scale-75">{renderLogo()}</div>
          </div>

          {/* Security text */}
          <div className="absolute bottom-4 left-6">
            <p className="text-[8px] text-white/40 max-w-[180px]">
              Esta tarjeta es propiedad del banco emisor. El uso no autorizado
              está prohibido.
            </p>
          </div>
        </div>
      </div>

      {/* Card type indicator */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          {cardType === "visa" && "💳 Visa detectada"}
          {cardType === "mastercard" && "💳 Mastercard detectada"}
          {cardType === "amex" && "💳 American Express detectada"}
          {cardType === "generic" && "Ingresa el número de tu tarjeta"}
        </p>
      </div>
    </div>
  );
}
