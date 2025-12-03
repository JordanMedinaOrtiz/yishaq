"use client";

import { useEffect, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../context/ProductContext";

export function ProductGrid() {
  const { products } = useProducts();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Importar GSAP dinámicamente solo en el cliente
    const initGsap = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Heading animation
        gsap.from(headingRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });

        // Grid items animation
        const gridItems = gridRef.current?.children;
        if (gridItems) {
          gsap.from(gridItems, {
            opacity: 0,
            y: 80,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              end: "top 30%",
              toggleActions: "play none none reverse",
            },
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    };

    initGsap();
  }, [products]);

  return (
    <section
      ref={sectionRef}
      id="products"
      className="py-24 md:py-32 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2
          ref={headingRef}
          className="font-serif text-4xl md:text-6xl font-bold text-center mb-16 text-foreground"
        >
          La Colección
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
