import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_CJOMfcep.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_DejvdVPx.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { u as useAuth, A as AuthProvider } from '../chunks/AuthContext_DjGZTLld.mjs';
import { useState, useRef, useEffect } from 'react';
import { Loader2, User, LogOut, Package, Edit3, Mail, Phone, MapPin, CheckCircle2, XCircle, ShoppingBag, Calendar, ChevronDown, Truck, X, Save, DollarSign, Clock, CreditCard } from 'lucide-react';
export { renderers } from '../renderers.mjs';

function OrderStatusBadge({ status }) {
  const statusConfig = {
    pending: {
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      icon: Clock,
      label: "Pendiente"
    },
    confirmed: {
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: CheckCircle2,
      label: "Confirmado"
    },
    processing: {
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      icon: Package,
      label: "Procesando"
    },
    shipped: {
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
      icon: Truck,
      label: "Enviado"
    },
    delivered: {
      color: "bg-green-500/10 text-green-500 border-green-500/20",
      icon: CheckCircle2,
      label: "Entregado"
    },
    cancelled: {
      color: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: XCircle,
      label: "Cancelado"
    },
    refunded: {
      color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      icon: DollarSign,
      label: "Reembolsado"
    }
  };
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`,
      children: [
        /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3" }),
        config.label
      ]
    }
  );
}
function PaymentStatusBadge({ status }) {
  const statusConfig = {
    pending: { color: "bg-yellow-500/10 text-yellow-500", label: "Pendiente" },
    paid: { color: "bg-green-500/10 text-green-500", label: "Pagado" },
    failed: { color: "bg-red-500/10 text-red-500", label: "Fallido" },
    refunded: { color: "bg-gray-500/10 text-gray-500", label: "Reembolsado" }
  };
  const config = statusConfig[status] || statusConfig.pending;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.color}`,
      children: [
        /* @__PURE__ */ jsx(CreditCard, { className: "w-3 h-3" }),
        config.label
      ]
    }
  );
}
function OrderCard({ order, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const toggleExpand = async () => {
    const gsap = (await import('gsap')).default;
    const content = contentRef.current;
    if (!content) return;
    if (isExpanded) {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => setIsExpanded(false)
      });
    } else {
      setIsExpanded(true);
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        }
      );
    }
  };
  useEffect(() => {
    const animateEntry = async () => {
      const gsap = (await import('gsap')).default;
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
            ease: "power3.out"
          }
        );
      }
    };
    animateEntry();
  }, [index]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: cardRef,
      className: "bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 opacity-0",
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: toggleExpand,
            className: "w-full p-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "w-6 h-6 text-primary" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-semibold", children: order.orderNumber }),
                    /* @__PURE__ */ jsx(OrderStatusBadge, { status: order.status })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }),
                      formatDate(order.createdAt)
                    ] }),
                    /* @__PURE__ */ jsx(PaymentStatusBadge, { status: order.paymentStatus })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold", children: [
                    "$",
                    order.total.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    order.items.length,
                    " producto(s)"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`,
                    children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5 text-muted-foreground" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: contentRef,
            className: "overflow-hidden",
            style: { height: 0, opacity: 0 },
            children: /* @__PURE__ */ jsxs("div", { className: "px-5 pb-5 border-t border-border", children: [
              /* @__PURE__ */ jsxs("div", { className: "py-4 flex flex-wrap gap-4 text-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    order.shippingAddress,
                    ", ",
                    order.shippingCity
                  ] })
                ] }),
                order.trackingNumber && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(Truck, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Tracking: ",
                    order.trackingNumber
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Productos" }),
                order.items.map((item) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex items-center gap-4 p-3 bg-muted/30 rounded-xl",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: "w-16 h-20 rounded-lg overflow-hidden bg-muted shrink-0", children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: item.productImage,
                          alt: item.productName,
                          className: "w-full h-full object-cover"
                        }
                      ) }),
                      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: item.productName }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-1 text-sm text-muted-foreground", children: [
                          item.size && /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 bg-card rounded text-xs font-medium", children: [
                            "Talla ",
                            item.size
                          ] }),
                          /* @__PURE__ */ jsxs("span", { children: [
                            "Cant: ",
                            item.quantity
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                        /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
                          "$",
                          item.totalPrice.toFixed(2)
                        ] }),
                        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                          "$",
                          item.unitPrice.toFixed(2),
                          " c/u"
                        ] })
                      ] })
                    ]
                  },
                  item.id
                ))
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-border space-y-2 text-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "$",
                    order.subtotal.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Envío" }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: order.shippingCost === 0 ? "text-green-500" : "",
                      children: order.shippingCost === 0 ? "GRATIS" : `$${order.shippingCost.toFixed(2)}`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-base font-bold pt-2 border-t border-border", children: [
                  /* @__PURE__ */ jsx("span", { children: "Total" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "$",
                    order.total.toFixed(2)
                  ] })
                ] })
              ] })
            ] })
          }
        )
      ]
    }
  );
}
function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave
}) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
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
    const gsap = (await import('gsap')).default;
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
    const gsap = (await import('gsap')).default;
    if (backdropRef.current && modalRef.current) {
      await gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.2
      });
      await gsap.to(backdropRef.current, { opacity: 0, duration: 0.15 });
      onClose();
    }
  };
  const handleSubmit = async (e) => {
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
        phone: phone.trim()
      });
      animateClose();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: backdropRef,
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
        onClick: () => !isSaving && animateClose()
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: modalRef,
        className: "relative bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-primary" }),
              "Editar Información"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => !isSaving && animateClose(),
                className: "p-2 hover:bg-muted rounded-lg transition-colors",
                disabled: isSaving,
                children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Nombre" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: firstName,
                  onChange: (e) => setFirstName(e.target.value),
                  className: "w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
                  placeholder: "Tu nombre",
                  disabled: isSaving
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Apellido" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: lastName,
                  onChange: (e) => setLastName(e.target.value),
                  className: "w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
                  placeholder: "Tu apellido",
                  disabled: isSaving
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Teléfono (opcional)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  value: phone,
                  onChange: (e) => setPhone(e.target.value),
                  className: "w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
                  placeholder: "+52 55 1234 5678",
                  disabled: isSaving
                }
              )
            ] }),
            error && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-500 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4" }),
              error
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => !isSaving && animateClose(),
                  className: "flex-1 px-4 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors",
                  disabled: isSaving,
                  children: "Cancelar"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: isSaving,
                  className: "flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50",
                  children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                    "Guardando..."
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                    "Guardar"
                  ] })
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
function EditAddressModal({
  isOpen,
  onClose,
  user,
  onSave
}) {
  const [address, setAddress] = useState(user.address || "");
  const [city, setCity] = useState(user.city || "");
  const [postalCode, setPostalCode] = useState(user.postalCode || "");
  const [country, setCountry] = useState(user.country || "México");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
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
    const gsap = (await import('gsap')).default;
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
    const gsap = (await import('gsap')).default;
    if (backdropRef.current && modalRef.current) {
      await gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.2
      });
      await gsap.to(backdropRef.current, { opacity: 0, duration: 0.15 });
      onClose();
    }
  };
  const handleSubmit = async (e) => {
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
        country: country.trim() || "México"
      });
      animateClose();
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: backdropRef,
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
        onClick: () => !isSaving && animateClose()
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: modalRef,
        className: "relative bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-primary" }),
              "Editar Dirección"
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => !isSaving && animateClose(),
                className: "p-2 hover:bg-muted rounded-lg transition-colors",
                disabled: isSaving,
                children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Dirección" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: address,
                  onChange: (e) => setAddress(e.target.value),
                  className: "w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
                  placeholder: "Calle, número, colonia",
                  disabled: isSaving
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Ciudad" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: city,
                    onChange: (e) => setCity(e.target.value),
                    className: "w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
                    placeholder: "Ciudad",
                    disabled: isSaving
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Código Postal" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: postalCode,
                    onChange: (e) => setPostalCode(e.target.value),
                    className: "w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
                    placeholder: "12345",
                    disabled: isSaving
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "País" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: country,
                  onChange: (e) => setCountry(e.target.value),
                  className: "w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
                  placeholder: "México",
                  disabled: isSaving
                }
              )
            ] }),
            error && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-500 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4" }),
              error
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => !isSaving && animateClose(),
                  className: "flex-1 px-4 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors",
                  disabled: isSaving,
                  children: "Cancelar"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: isSaving,
                  className: "flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50",
                  children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                    "Guardando..."
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                    "Guardar"
                  ] })
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
function UserProfile() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
    refreshUser
  } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const profileRef = useRef(null);
  const headerRef = useRef(null);
  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab, isAuthenticated]);
  useEffect(() => {
    const animateEntry = async () => {
      if (headerRef.current && profileRef.current) {
        const gsap = (await import('gsap')).default;
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
        credentials: "include"
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
  const handleSaveProfile = async (data) => {
    const response = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type: "profile", data })
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Error al guardar");
    }
    await refreshUser();
  };
  const handleSaveAddress = async (data) => {
    const response = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type: "address", data })
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Error al guardar");
    }
    await refreshUser();
  };
  if (authLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-10 h-10 animate-spin text-primary mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Cargando..." })
    ] }) });
  }
  if (!isAuthenticated || !user) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-10 h-10 text-primary" }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-serif font-bold mb-4", children: "Inicia sesión para continuar" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: "Necesitas una cuenta para ver tu perfil y historial de pedidos." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/login",
            className: "px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02]",
            children: "Iniciar Sesión"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/register",
            className: "px-6 py-3 bg-card border border-border rounded-xl font-semibold hover:bg-muted transition-all hover:scale-[1.02]",
            children: "Crear Cuenta"
          }
        )
      ] })
    ] }) });
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
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground hidden sm:block", children: user.email }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: logout,
            className: "flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors",
            children: [
              /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Salir" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-6xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxs("div", { ref: headerRef, className: "mb-8 opacity-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-bold", children: [
            user.firstName[0],
            user.lastName[0]
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl font-serif font-bold", children: [
              "¡Hola, ",
              user.firstName,
              "!"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Bienvenido a tu cuenta YISHAQ" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 p-1 bg-muted/50 rounded-xl w-fit", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("profile"),
              className: `flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === "profile" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
                "Mis Datos"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab("orders"),
              className: `flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === "orders" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ jsx(Package, { className: "w-4 h-4" }),
                "Mis Pedidos",
                orders.length > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full", children: orders.length })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { ref: profileRef, className: "opacity-0", children: [
        activeTab === "profile" && /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-primary" }),
                "Información Personal"
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setIsEditProfileOpen(true),
                  className: "flex items-center gap-2 px-3 py-1.5 text-sm text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }),
                    "Editar"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Nombre" }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: user.firstName })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Apellido" }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: user.lastName })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Email" }),
                /* @__PURE__ */ jsxs("p", { className: "font-medium mt-1 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-muted-foreground" }),
                  user.email
                ] })
              ] }),
              user.phone && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Teléfono" }),
                /* @__PURE__ */ jsxs("p", { className: "font-medium mt-1 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-muted-foreground" }),
                  user.phone
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-2xl p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-primary" }),
                "Dirección de Envío"
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setIsEditAddressOpen(true),
                  className: "flex items-center gap-2 px-3 py-1.5 text-sm text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" }),
                    "Editar"
                  ]
                }
              )
            ] }),
            user.address ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Dirección" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: user.address })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Ciudad" }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: user.city || "-" })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Código Postal" }),
                  /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: user.postalCode || "-" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "País" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium mt-1", children: user.country || "México" })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-3" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No tienes una dirección guardada" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Se guardará cuando hagas tu primer pedido" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center", children: user.role === "admin" ? /* @__PURE__ */ jsx("span", { className: "text-primary font-bold text-lg", children: "★" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6 text-primary" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: user.role === "admin" ? "Cuenta Administrador" : "Cuenta Verificada" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: user.role === "admin" ? "Tienes acceso completo al panel de administración" : "Tu cuenta está activa y verificada" })
            ] }),
            user.role === "admin" && /* @__PURE__ */ jsx(
              "a",
              {
                href: "/admin",
                className: "ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors",
                children: "Ir al Admin"
              }
            )
          ] }) })
        ] }),
        activeTab === "orders" && /* @__PURE__ */ jsx("div", { children: isLoadingOrders ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-10 h-10 animate-spin text-primary mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Cargando tus pedidos..." })
        ] }) : error ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
          /* @__PURE__ */ jsx(XCircle, { className: "w-12 h-12 text-red-500/50 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-red-500 mb-4", children: error }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: fetchOrders,
              className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors",
              children: "Reintentar"
            }
          )
        ] }) : orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
          /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsx(ShoppingBag, { className: "w-12 h-12 text-muted-foreground/50" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Aún no tienes pedidos" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6 max-w-md mx-auto", children: "Cuando realices tu primera compra, podrás ver aquí el historial de todos tus pedidos." }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/",
              className: "inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02]",
              children: [
                /* @__PURE__ */ jsx(ShoppingBag, { className: "w-5 h-5" }),
                "Ir a Comprar"
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Historial de Pedidos" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
              orders.length,
              " pedido(s)"
            ] })
          ] }),
          orders.map((order, index) => /* @__PURE__ */ jsx(OrderCard, { order, index }, order.id))
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      EditProfileModal,
      {
        isOpen: isEditProfileOpen,
        onClose: () => setIsEditProfileOpen(false),
        user,
        onSave: handleSaveProfile
      }
    ),
    /* @__PURE__ */ jsx(
      EditAddressModal,
      {
        isOpen: isEditAddressOpen,
        onClose: () => setIsEditAddressOpen(false),
        user,
        onSave: handleSaveAddress
      }
    )
  ] });
}

function ProfileApp() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(UserProfile, {}) });
}

const $$Perfil = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Mi Cuenta | YISHAQ" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProfileApp", ProfileApp, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jorda/Dev/yishaq/src/components/ProfileApp", "client:component-export": "ProfileApp" })} ` })}`;
}, "C:/Users/jorda/Dev/yishaq/src/pages/perfil.astro", void 0);

const $$file = "C:/Users/jorda/Dev/yishaq/src/pages/perfil.astro";
const $$url = "/perfil";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Perfil,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
