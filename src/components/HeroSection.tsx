import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGsap = async () => {
      const gsap = (await import("gsap")).default;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Initial states
        gsap.set(
          [
            logoRef.current,
            taglineRef.current,
            ctaRef.current,
            scrollIndicatorRef.current,
          ],
          {
            opacity: 0,
          }
        );
        gsap.set(logoRef.current, { y: 100, scale: 0.8 });
        gsap.set(taglineRef.current, { y: 50 });
        gsap.set(ctaRef.current, { y: 30 });
        gsap.set(scrollIndicatorRef.current, { y: 20 });

        // Animation sequence
        tl.to(logoRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          delay: 0.3,
        })
          .to(
            taglineRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
            },
            "-=0.6"
          )
          .to(
            ctaRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
            },
            "-=0.4"
          )
          .to(
            scrollIndicatorRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
            },
            "-=0.2"
          );

        // Floating animation for scroll indicator
        gsap.to(scrollIndicatorRef.current, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }, containerRef);

      return () => ctx.revert();
    };

    initGsap();
  }, []);

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] animate-glow" />
        <div
          className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[120px] animate-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px]" />

      <div className="relative z-10 text-center px-4">
        <h1
          ref={logoRef}
          className="font-serif text-[clamp(4rem,15vw,12rem)] font-bold tracking-tighter leading-none text-foreground"
        >
          YISHAQ
        </h1>
        <p
          ref={taglineRef}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-md mx-auto tracking-wide"
        >
          Audaz. Moderno. Sin limites.
        </p>

        <div ref={ctaRef} className="mt-12">
          <MagneticButton onClick={scrollToProducts}>
            Explorar Colección
          </MagneticButton>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={scrollToProducts}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs tracking-widest uppercase">Desliza</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
