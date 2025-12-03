import { useRef, useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import type { Product } from "../context/ProductContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [gsapInstance, setGsapInstance] = useState<
    typeof import("gsap").default | null
  >(null);
  const { addItem } = useCart();

  useEffect(() => {
    import("gsap").then((mod) => setGsapInstance(mod.default));
  }, []);

  const handleMouseEnter = () => {
    if (gsapInstance) {
      gsapInstance.to(imageRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (gsapInstance) {
      gsapInstance.to(imageRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id, // ID real para la DB
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
    });
  };

  return (
    <div
      ref={cardRef}
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted rounded-sm mb-4">
        <div ref={imageRef} className="absolute inset-0">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 text-xs font-medium border transition-colors ${
                    selectedSize === size
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground/50 text-foreground hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">${product.price}</p>
      </div>
    </div>
  );
}
