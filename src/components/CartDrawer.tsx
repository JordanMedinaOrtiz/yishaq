import { useEffect, useRef } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { MagneticButton } from "./MagneticButton";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } =
    useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateDrawer = async () => {
      const gsap = (await import("gsap")).default;

      if (isOpen) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
        gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: "power3.out" });
        document.body.style.overflow = "hidden";
      } else {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
        gsap.to(drawerRef.current, {
          x: "100%",
          duration: 0.4,
          ease: "power3.in",
        });
        document.body.style.overflow = "";
      }
    };

    animateDrawer();
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 opacity-0",
          !isOpen && "pointer-events-none"
        )}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 translate-x-full"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-serif text-xl font-semibold text-card-foreground">
              Tu Carrito
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ShoppingBag className="w-12 h-12 mb-4" />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-muted rounded overflow-hidden shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground truncate">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-sm text-muted-foreground">
                          Talla: {item.size}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-card-foreground mt-1">
                        ${item.price}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-card-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-xl font-semibold text-card-foreground">
                  ${total.toFixed(2)}
                </span>
              </div>
              <a
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full"
              >
                <MagneticButton className="w-full justify-center">
                  Finalizar Compra
                </MagneticButton>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
