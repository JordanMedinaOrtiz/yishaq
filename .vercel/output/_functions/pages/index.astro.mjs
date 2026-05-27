import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_CJOMfcep.mjs';
import 'piccolore';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { u as useCart, C as CartProvider } from '../chunks/CartContext_qAEPAAmN.mjs';
import { u as useProducts, P as ProductProvider } from '../chunks/ProductContext_COki0o68.mjs';
import { u as useAuth, A as AuthProvider } from '../chunks/AuthContext_DjGZTLld.mjs';
import { useState, useEffect, useRef } from 'react';
import { Shield, User, LogOut, ShoppingBag, X, Menu, Minus, Plus, ArrowDown, Instagram, Twitter } from 'lucide-react';
import { $ as $$Layout } from '../chunks/Layout_DejvdVPx.mjs';
export { renderers } from '../renderers.mjs';

function Header() {
  const { items, setIsOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const headerStyles = scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent";
  return /* @__PURE__ */ jsx(
    "header",
    {
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerStyles}`,
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16 md:h-20", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/",
              className: "font-serif text-xl md:text-2xl font-bold tracking-tighter text-foreground",
              children: "YISHAQ"
            }
          ),
          /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-8", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/#products",
                className: "text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors",
                children: "Colección"
              }
            ),
            isAdmin && /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/admin",
                className: "text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
                  "Admin"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            !isLoading && /* @__PURE__ */ jsx("div", { className: "relative", children: isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setUserMenuOpen(!userMenuOpen),
                  className: "flex items-center gap-2 p-2 text-foreground hover:text-primary transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(User, { className: "w-5 h-5" }),
                    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline text-sm", children: user?.firstName })
                  ]
                }
              ),
              userMenuOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50", children: [
                /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 border-b border-border", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
                    user?.firstName,
                    " ",
                    user?.lastName
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: user?.email }),
                  isAdmin && /* @__PURE__ */ jsx("span", { className: "inline-block mt-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded", children: "Admin" })
                ] }),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/perfil",
                    className: "block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                    onClick: () => setUserMenuOpen(false),
                    children: "Mi Perfil"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => {
                      logout();
                      setUserMenuOpen(false);
                    },
                    className: "w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted transition-colors flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
                      "Cerrar Sesión"
                    ]
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/login",
                className: "flex items-center gap-2 p-2 text-foreground hover:text-primary transition-colors",
                children: [
                  /* @__PURE__ */ jsx(User, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsx("span", { className: "hidden sm:inline text-sm", children: "Ingresar" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setIsOpen(true),
                className: "relative p-2 text-foreground hover:text-primary transition-colors",
                children: [
                  /* @__PURE__ */ jsx(ShoppingBag, { className: "w-5 h-5" }),
                  itemCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full", children: itemCount })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                className: "md:hidden p-2 text-foreground",
                children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        mobileMenuOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden py-4 border-t border-border", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/#products",
              onClick: () => setMobileMenuOpen(false),
              className: "text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors",
              children: "Colección"
            }
          ),
          isAdmin && /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/admin",
              onClick: () => setMobileMenuOpen(false),
              className: "text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4" }),
                "Admin"
              ]
            }
          ),
          !isAuthenticated && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/login",
                onClick: () => setMobileMenuOpen(false),
                className: "text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors",
                children: "Iniciar Sesión"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/registro",
                onClick: () => setMobileMenuOpen(false),
                className: "text-sm tracking-widest uppercase text-primary hover:text-primary/80 transition-colors",
                children: "Registrarse"
              }
            )
          ] })
        ] }) })
      ] })
    }
  );
}

function MagneticButton({
  children,
  onClick,
  className = "",
  variant = "primary"
}) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  const baseStyles = "relative px-8 py-4 text-sm font-medium tracking-widest uppercase transition-all duration-300 ease-out";
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref: buttonRef,
      onClick,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      className: `${baseStyles} ${variantStyles[variant]} ${className}`,
      style: {
        transform: `translate(${position.x}px, ${position.y}px)`
      },
      children: [
        /* @__PURE__ */ jsx("span", { className: "relative z-10", children }),
        /* @__PURE__ */ jsx("span", { className: "absolute inset-0 bg-foreground scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" })
      ]
    }
  );
}

function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } = useCart();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  useEffect(() => {
    const animateDrawer = async () => {
      const gsap = (await import('gsap')).default;
      if (isOpen) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
        gsap.to(drawerRef.current, { x: 0, duration: 0.4, ease: "power3.out" });
        document.body.style.overflow = "hidden";
      } else {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
        gsap.to(drawerRef.current, {
          x: "100%",
          duration: 0.4,
          ease: "power3.in"
        });
        document.body.style.overflow = "";
      }
    };
    animateDrawer();
  }, [isOpen]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: overlayRef,
        onClick: () => setIsOpen(false),
        className: cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 opacity-0",
          !isOpen && "pointer-events-none"
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: drawerRef,
        className: "fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 translate-x-full",
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl font-semibold text-card-foreground", children: "Tu Carrito" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsOpen(false),
                className: "p-2 text-muted-foreground hover:text-foreground transition-colors",
                children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground", children: [
            /* @__PURE__ */ jsx(ShoppingBag, { className: "w-12 h-12 mb-4" }),
            /* @__PURE__ */ jsx("p", { children: "Tu carrito está vacío" })
          ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-6", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "relative w-20 h-24 bg-muted rounded overflow-hidden shrink-0", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: item.image || "/placeholder.svg",
                alt: item.name,
                className: "absolute inset-0 w-full h-full object-cover"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-card-foreground truncate", children: item.name }),
              item.size && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Talla: ",
                item.size
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-card-foreground mt-1", children: [
                "$",
                item.price
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => updateQuantity(item.id, item.quantity - 1),
                    className: "p-1 text-muted-foreground hover:text-foreground transition-colors",
                    children: /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-card-foreground", children: item.quantity }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => updateQuantity(item.id, item.quantity + 1),
                    className: "p-1 text-muted-foreground hover:text-foreground transition-colors",
                    children: /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => removeItem(item.id),
                    className: "ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors",
                    children: "Eliminar"
                  }
                )
              ] })
            ] })
          ] }, item.id)) }) }),
          items.length > 0 && /* @__PURE__ */ jsxs("div", { className: "p-6 border-t border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xl font-semibold text-card-foreground", children: [
                "$",
                total.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/checkout",
                onClick: () => setIsOpen(false),
                className: "block w-full",
                children: /* @__PURE__ */ jsx(MagneticButton, { className: "w-full justify-center", children: "Finalizar Compra" })
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function HeroSection() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  useEffect(() => {
    const initGsap = async () => {
      const gsap = (await import('gsap')).default;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        gsap.set(
          [
            logoRef.current,
            taglineRef.current,
            ctaRef.current,
            scrollIndicatorRef.current
          ],
          {
            opacity: 0
          }
        );
        gsap.set(logoRef.current, { y: 100, scale: 0.8 });
        gsap.set(taglineRef.current, { y: 50 });
        gsap.set(ctaRef.current, { y: 30 });
        gsap.set(scrollIndicatorRef.current, { y: 20 });
        tl.to(logoRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          delay: 0.3
        }).to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8
          },
          "-=0.6"
        ).to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6
          },
          "-=0.4"
        ).to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6
          },
          "-=0.2"
        );
        gsap.to(scrollIndicatorRef.current, {
          y: 10,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      }, containerRef);
      return () => ctx.revert();
    };
    initGsap();
  }, []);
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: "relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] animate-glow" }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[120px] animate-glow",
              style: { animationDelay: "1s" }
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center px-4", children: [
          /* @__PURE__ */ jsx(
            "h1",
            {
              ref: logoRef,
              className: "font-serif text-[clamp(4rem,15vw,12rem)] font-bold tracking-tighter leading-none text-foreground",
              children: "YISHAQ"
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              ref: taglineRef,
              className: "mt-6 text-lg md:text-xl text-muted-foreground max-w-md mx-auto tracking-wide",
              children: "Audaz. Moderno. Sin limites."
            }
          ),
          /* @__PURE__ */ jsx("div", { ref: ctaRef, className: "mt-12", children: /* @__PURE__ */ jsx(MagneticButton, { onClick: scrollToProducts, children: "Explorar Colección" }) })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: scrollIndicatorRef,
            className: "absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer",
            onClick: scrollToProducts,
            children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs tracking-widest uppercase", children: "Desliza" }),
              /* @__PURE__ */ jsx(ArrowDown, { className: "w-4 h-4" })
            ] })
          }
        )
      ]
    }
  );
}

function ProductCard({ product }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [gsapInstance, setGsapInstance] = useState(null);
  const { addItem } = useCart();
  useEffect(() => {
    import('gsap').then((mod) => setGsapInstance(mod.default));
  }, []);
  const handleMouseEnter = () => {
    if (gsapInstance) {
      gsapInstance.to(imageRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };
  const handleMouseLeave = () => {
    if (gsapInstance) {
      gsapInstance.to(imageRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };
  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      // ID real para la DB
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize
    });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: cardRef,
      className: "group relative",
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-3/4 overflow-hidden bg-muted rounded-sm mb-4", children: [
          /* @__PURE__ */ jsx("div", { ref: imageRef, className: "absolute inset-0", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: product.image || "/placeholder.svg",
              alt: product.name,
              className: "absolute inset-0 w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-2 mb-4", children: product.sizes.map((size) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedSize(size),
                className: `w-10 h-10 text-xs font-medium border transition-colors ${selectedSize === size ? "bg-foreground text-background border-foreground" : "border-foreground/50 text-foreground hover:border-foreground"}`,
                children: size
              },
              size
            )) }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleAddToCart,
                className: "flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                  "Añadir al Carrito"
                ]
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-medium text-foreground group-hover:text-primary transition-colors", children: product.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
            "$",
            product.price
          ] })
        ] })
      ]
    }
  );
}

function ProductGrid() {
  const { products } = useProducts();
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  useEffect(() => {
    const initGsap = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger.js');
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from(headingRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse"
          }
        });
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
              toggleActions: "play none none reverse"
            }
          });
        }
      }, sectionRef);
      return () => ctx.revert();
    };
    initGsap();
  }, [products]);
  return /* @__PURE__ */ jsx(
    "section",
    {
      ref: sectionRef,
      id: "products",
      className: "py-24 md:py-32 bg-background",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6", children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            ref: headingRef,
            className: "font-serif text-4xl md:text-6xl font-bold text-center mb-16 text-foreground",
            children: "La Colección"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: gridRef,
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8",
            children: products.map((product) => /* @__PURE__ */ jsx(ProductCard, { product }, product.id))
          }
        )
      ] })
    }
  );
}

function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "bg-card border-t border-border py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl font-bold mb-4 text-card-foreground", children: "YISHAQ" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground max-w-sm", children: "Audaz. Moderno. Sin límites. Definiendo el futuro de la moda con piezas que hacen declaraciones." }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-6", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "text-muted-foreground hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsx(Instagram, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "text-muted-foreground hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsx(Twitter, { className: "w-5 h-5" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold tracking-widest uppercase mb-4 text-card-foreground", children: "Tienda" }),
        /* @__PURE__ */ jsxs("nav", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
              children: "Novedades"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
              children: "Abrigos"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
              children: "Tops"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
              children: "Pantalones"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold tracking-widest uppercase mb-4 text-card-foreground", children: "Info" }),
        /* @__PURE__ */ jsxs("nav", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
              children: "Sobre Nosotros"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
              children: "Contacto"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/admin",
              className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
              children: "Admin"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxs("p", { children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " YISHAQ. Todos los derechos reservados."
    ] }) })
  ] }) });
}

function App() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(ProductProvider, { children: /* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsxs("main", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(CartDrawer, {}),
    /* @__PURE__ */ jsx(HeroSection, {}),
    /* @__PURE__ */ jsx(ProductGrid, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] }) }) }) });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "App", App, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jorda/Dev/yishaq/src/components/App", "client:component-export": "App" })} ` })}`;
}, "C:/Users/jorda/Dev/yishaq/src/pages/index.astro", void 0);

const $$file = "C:/Users/jorda/Dev/yishaq/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
