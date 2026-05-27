import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_CJOMfcep.mjs';
import 'piccolore';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { u as useProducts, P as ProductProvider } from '../chunks/ProductContext_COki0o68.mjs';
import { ArrowLeft, LayoutDashboard, DollarSign, ShoppingCart, Package, AlertTriangle, Loader2, Pencil, Trash2, X, ChevronDown, ChevronUp, Check, Edit3, MapPin, Phone, Mail, Calendar, CreditCard, Truck, CheckCircle2, XCircle, Clock, ShoppingBag } from 'lucide-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { C as Card, a as CardContent } from '../chunks/card_Dc3WLXaj.mjs';
import { c as cn, b as buttonVariants } from '../chunks/button_EkdW3CYr.mjs';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { L as Label, I as Input } from '../chunks/label_IJB1Fc6j.mjs';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { $ as $$Layout } from '../chunks/Layout_DejvdVPx.mjs';
import { g as getTokenFromCookie, v as validateSession } from '../chunks/auth_B9u7kCyc.mjs';
export { renderers } from '../renderers.mjs';

function AdminHeader() {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 bg-card border-b border-border", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs(
      "a",
      {
        href: "/",
        className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Volver a la Tienda"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-5 h-5 text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "font-serif text-lg font-semibold text-card-foreground", children: "YISHAQ Admin" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-[100px]" })
  ] }) }) });
}

function DashboardStats({
  totalSales,
  totalOrders,
  totalProducts,
  lowStockItems,
  isLoading = false
}) {
  const stats = [
    {
      label: "Ventas Totales",
      value: `$${totalSales.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: "Pedidos Totales",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10"
    },
    {
      label: "Productos",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10"
    },
    {
      label: "Stock Bajo",
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((stat) => /* @__PURE__ */ jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: `p-3 rounded-lg ${stat.bgColor}`, children: /* @__PURE__ */ jsx(stat.icon, { className: `w-5 h-5 ${stat.color}` }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: stat.label }),
      isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-card-foreground", children: stat.value })
    ] })
  ] }) }) }, stat.label)) });
}

const Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

function ProductTable({
  products,
  onEdit,
  onDelete
}) {
  return /* @__PURE__ */ jsx("div", { className: "border border-border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxs(Table, { children: [
    /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "bg-muted/50 hover:bg-muted/50", children: [
      /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "Producto" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "Categoría" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "Precio" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "Stock" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground", children: "Tallas" }),
      /* @__PURE__ */ jsx(TableHead, { className: "text-muted-foreground text-right", children: "Acciones" })
    ] }) }),
    /* @__PURE__ */ jsx(TableBody, { children: products.map((product) => /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-muted/30", children: [
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "relative w-12 h-12 bg-muted rounded overflow-hidden shrink-0", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: product.image || "/placeholder.svg",
            alt: product.name,
            className: "absolute inset-0 w-full h-full object-cover"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: product.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground truncate max-w-[200px]", children: product.description })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: product.category }),
      /* @__PURE__ */ jsxs(TableCell, { className: "text-foreground font-medium", children: [
        "$",
        product.price
      ] }),
      /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(
        "span",
        {
          className: `inline-flex px-2 py-1 text-xs font-medium rounded ${product.stock < 10 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`,
          children: [
            product.stock,
            " unidades"
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(TableCell, { className: "text-muted-foreground", children: product.sizes.join(", ") }),
      /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onEdit(product),
            className: "p-2 text-muted-foreground hover:text-foreground transition-colors",
            children: /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "p-2 text-muted-foreground hover:text-destructive transition-colors", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) }) }),
          /* @__PURE__ */ jsxs(AlertDialogContent, { className: "bg-card border-border", children: [
            /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsx(AlertDialogTitle, { className: "text-card-foreground", children: "Eliminar Producto" }),
              /* @__PURE__ */ jsxs(AlertDialogDescription, { className: "text-muted-foreground", children: [
                '¿Estás seguro de que quieres eliminar "',
                product.name,
                '"? Esta acción no se puede deshacer.'
              ] })
            ] }),
            /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsx(AlertDialogCancel, { className: "border-border text-foreground hover:bg-muted", children: "Cancelar" }),
              /* @__PURE__ */ jsx(
                AlertDialogAction,
                {
                  onClick: () => onDelete(product.id),
                  className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  children: "Eliminar"
                }
              )
            ] })
          ] })
        ] })
      ] }) })
    ] }, product.id)) })
  ] }) });
}

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const categories = ["Artistas", "Calaveras", "Carros", "Urbanos ", "Motos"];
const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
function ProductModal({
  isOpen,
  onClose,
  onSave,
  product
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image: "/diverse-fashion-display.png",
    category: "Tops",
    sizes: ["S", "M", "L"],
    stock: 10,
    featured: false
  });
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        sizes: product.sizes,
        stock: product.stock,
        featured: product.featured
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        image: "/diverse-fashion-display.png",
        category: "Tops",
        sizes: ["S", "M", "L"],
        stock: 10,
        featured: false
      });
    }
  }, [product, isOpen]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]
    }));
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "font-serif text-xl text-card-foreground", children: product ? "Editar Producto" : "Añadir Nuevo Producto" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-foreground", children: "Nombre del Producto" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "name",
            value: formData.name,
            onChange: (e) => setFormData({ ...formData, name: e.target.value }),
            className: "bg-input border-border text-foreground",
            placeholder: "Ingresa el nombre del producto",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "description", className: "text-foreground", children: "Descripción" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "description",
            value: formData.description,
            onChange: (e) => setFormData({ ...formData, description: e.target.value }),
            className: "bg-input border-border text-foreground resize-none",
            placeholder: "Ingresa la descripción del producto",
            rows: 3,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "price", className: "text-foreground", children: "Precio ($)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "price",
              type: "number",
              min: "0",
              value: formData.price,
              onChange: (e) => setFormData({ ...formData, price: Number(e.target.value) }),
              className: "bg-input border-border text-foreground",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "stock", className: "text-foreground", children: "Stock" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "stock",
              type: "number",
              min: "0",
              value: formData.stock,
              onChange: (e) => setFormData({ ...formData, stock: Number(e.target.value) }),
              className: "bg-input border-border text-foreground",
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "category", className: "text-foreground", children: "Categoría" }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: formData.category,
            onValueChange: (value) => setFormData({ ...formData, category: value }),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "bg-input border-border text-foreground", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Seleccionar categoría" }) }),
              /* @__PURE__ */ jsx(SelectContent, { className: "bg-popover border-border", children: categories.map((cat) => /* @__PURE__ */ jsx(
                SelectItem,
                {
                  value: cat,
                  className: "text-popover-foreground",
                  children: cat
                },
                cat
              )) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-foreground", children: "Tallas Disponibles" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: allSizes.map((size) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => toggleSize(size),
            className: `px-3 py-1.5 text-sm font-medium border transition-colors ${formData.sizes.includes(size) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`,
            children: size
          },
          size
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "image", className: "text-foreground", children: "URL de Imagen" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "image",
            value: formData.image,
            onChange: (e) => setFormData({ ...formData, image: e.target.value }),
            className: "bg-input border-border text-foreground",
            placeholder: "Ingresa la URL de la imagen"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          Checkbox,
          {
            id: "featured",
            checked: formData.featured,
            onCheckedChange: (checked) => setFormData({ ...formData, featured: checked })
          }
        ),
        /* @__PURE__ */ jsx(
          Label,
          {
            htmlFor: "featured",
            className: "text-foreground cursor-pointer",
            children: "Producto Destacado"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 py-3 border border-border text-foreground font-medium hover:bg-muted transition-colors",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "flex-1 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors",
            children: product ? "Guardar Cambios" : "Añadir Producto"
          }
        )
      ] })
    ] })
  ] }) });
}

const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: Clock
  },
  confirmed: {
    label: "Confirmado",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: CheckCircle2
  },
  processing: {
    label: "Procesando",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: Package
  },
  shipped: {
    label: "Enviado",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    icon: Truck
  },
  delivered: {
    label: "Entregado",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle2
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle
  },
  refunded: {
    label: "Reembolsado",
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    icon: DollarSign
  }
};
const PAYMENT_STATUS_CONFIG = {
  pending: { label: "Pendiente", color: "bg-yellow-500/10 text-yellow-600" },
  paid: { label: "Pagado", color: "bg-green-500/10 text-green-600" },
  failed: { label: "Fallido", color: "bg-red-500/10 text-red-600" },
  refunded: { label: "Reembolsado", color: "bg-gray-500/10 text-gray-600" }
};
function StatusBadge({
  status,
  type
}) {
  const config = type === "order" ? ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending : PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;
  const Icon = type === "order" ? config.icon : CreditCard;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`,
      children: [
        /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3" }),
        config.label
      ]
    }
  );
}
function OrderRow({
  order,
  onUpdate
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const handleQuickAction = async (action) => {
    setIsUpdating(true);
    try {
      let updateData = {};
      switch (action) {
        case "confirm":
          updateData = { status: "confirmed" };
          break;
        case "ship":
          updateData = { status: "shipped" };
          break;
        case "deliver":
          updateData = { status: "delivered" };
          break;
        case "markPaid":
          updateData = { paymentStatus: "paid" };
          break;
      }
      await onUpdate(updateData);
    } finally {
      setIsUpdating(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("tr", { className: "border-b border-border hover:bg-muted/30 transition-colors", children: [
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsExpanded(!isExpanded),
          className: "p-1 hover:bg-muted rounded transition-colors",
          children: isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
        }
      ) }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "font-mono text-sm font-medium", children: order.orderNumber }) }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "font-medium text-sm", children: [
          order.shippingFirstName,
          " ",
          order.shippingLastName
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: order.shippingEmail })
      ] }) }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(StatusBadge, { status: order.status, type: "order" }) }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(StatusBadge, { status: order.paymentStatus, type: "payment" }) }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
        "$",
        order.total.toFixed(2)
      ] }) }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground", children: formatDate(order.createdAt) }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: isUpdating ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        order.status === "pending" && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleQuickAction("confirm"),
            className: "px-2 py-1 text-xs bg-blue-500/10 text-blue-600 rounded hover:bg-blue-500/20 transition-colors",
            title: "Confirmar pedido",
            children: "Confirmar"
          }
        ),
        order.status === "confirmed" && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleQuickAction("ship"),
            className: "px-2 py-1 text-xs bg-indigo-500/10 text-indigo-600 rounded hover:bg-indigo-500/20 transition-colors",
            title: "Marcar como enviado",
            children: "Enviar"
          }
        ),
        order.status === "shipped" && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleQuickAction("deliver"),
            className: "px-2 py-1 text-xs bg-green-500/10 text-green-600 rounded hover:bg-green-500/20 transition-colors",
            title: "Marcar como entregado",
            children: "Entregar"
          }
        ),
        order.paymentStatus === "pending" && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleQuickAction("markPaid"),
            className: "px-2 py-1 text-xs bg-emerald-500/10 text-emerald-600 rounded hover:bg-emerald-500/20 transition-colors",
            title: "Marcar como pagado",
            children: "Pagado"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowEditModal(true),
            className: "p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors",
            title: "Editar pedido",
            children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" })
          }
        )
      ] }) }) })
    ] }),
    isExpanded && /* @__PURE__ */ jsx("tr", { className: "bg-muted/20", children: /* @__PURE__ */ jsxs("td", { colSpan: 8, className: "px-4 py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-primary" }),
            "Dirección de Envío"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm space-y-1 text-muted-foreground", children: [
            /* @__PURE__ */ jsx("p", { children: order.shippingAddress }),
            /* @__PURE__ */ jsxs("p", { children: [
              order.shippingCity,
              ", CP ",
              order.shippingPostalCode
            ] }),
            order.shippingPhone && /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Phone, { className: "w-3 h-3" }),
              order.shippingPhone
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-3 h-3" }),
              order.shippingEmail
            ] })
          ] }),
          order.trackingNumber && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Número de rastreo:" }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-sm", children: order.trackingNumber })
          ] }),
          order.customerNotes && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-card rounded-lg border border-border", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Notas del cliente:" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: order.customerNotes })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-sm flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsx(Package, { className: "w-4 h-4 text-primary" }),
            "Productos (",
            order.items.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto", children: order.items.map((item) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-3 p-2 bg-card rounded-lg border border-border",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-14 rounded overflow-hidden bg-muted shrink-0", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: item.productImage,
                    alt: item.productName,
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: item.productName }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                    item.size && /* @__PURE__ */ jsxs("span", { children: [
                      "Talla ",
                      item.size
                    ] }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "×",
                      item.quantity
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold", children: [
                  "$",
                  item.totalPrice.toFixed(2)
                ] })
              ]
            },
            item.id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-border space-y-1 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "$",
                order.subtotal.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
              /* @__PURE__ */ jsx("span", { children: "Envío" }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: order.shippingCost === 0 ? "text-green-600" : "",
                  children: order.shippingCost === 0 ? "GRATIS" : `$${order.shippingCost.toFixed(2)}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-semibold pt-1 border-t border-border", children: [
              /* @__PURE__ */ jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "$",
                order.total.toFixed(2)
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
          "Creado: ",
          formatDate(order.createdAt)
        ] }),
        order.paidAt && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-green-600", children: [
          /* @__PURE__ */ jsx(CreditCard, { className: "w-3 h-3" }),
          "Pagado: ",
          formatDate(order.paidAt)
        ] }),
        order.shippedAt && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-indigo-600", children: [
          /* @__PURE__ */ jsx(Truck, { className: "w-3 h-3" }),
          "Enviado: ",
          formatDate(order.shippedAt)
        ] }),
        order.deliveredAt && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-green-600", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }),
          "Entregado: ",
          formatDate(order.deliveredAt)
        ] })
      ] }) })
    ] }) }),
    showEditModal && /* @__PURE__ */ jsx(
      EditOrderModal,
      {
        order,
        onClose: () => setShowEditModal(false),
        onSave: async (data) => {
          await onUpdate(data);
          setShowEditModal(false);
        }
      }
    )
  ] });
}
function EditOrderModal({
  order,
  onClose,
  onSave
}) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || ""
  );
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        status,
        paymentStatus,
        trackingNumber: trackingNumber || null,
        adminNotes: adminNotes || null
      });
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, children: /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold mb-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Edit3, { className: "w-5 h-5 text-primary" }),
        "Editar Pedido ",
        order.orderNumber
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Estado del pedido" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: status,
                onChange: (e) => setStatus(e.target.value),
                className: "w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "pending", children: "Pendiente" }),
                  /* @__PURE__ */ jsx("option", { value: "confirmed", children: "Confirmado" }),
                  /* @__PURE__ */ jsx("option", { value: "processing", children: "Procesando" }),
                  /* @__PURE__ */ jsx("option", { value: "shipped", children: "Enviado" }),
                  /* @__PURE__ */ jsx("option", { value: "delivered", children: "Entregado" }),
                  /* @__PURE__ */ jsx("option", { value: "cancelled", children: "Cancelado" }),
                  /* @__PURE__ */ jsx("option", { value: "refunded", children: "Reembolsado" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Estado del pago" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: paymentStatus,
                onChange: (e) => setPaymentStatus(e.target.value),
                className: "w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "pending", children: "Pendiente" }),
                  /* @__PURE__ */ jsx("option", { value: "paid", children: "Pagado" }),
                  /* @__PURE__ */ jsx("option", { value: "failed", children: "Fallido" }),
                  /* @__PURE__ */ jsx("option", { value: "refunded", children: "Reembolsado" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Número de rastreo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: trackingNumber,
              onChange: (e) => setTrackingNumber(e.target.value),
              placeholder: "Ej: 1234567890",
              className: "w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Notas del administrador" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: adminNotes,
              onChange: (e) => setAdminNotes(e.target.value),
              placeholder: "Notas internas...",
              rows: 3,
              className: "w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "flex-1 px-4 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors",
              disabled: isSaving,
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: isSaving,
              className: "flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50",
              children: isSaving ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                "Guardando..."
              ] }) : "Guardar cambios"
            }
          )
        ] })
      ] })
    ] })
  ] }) }) });
}
function OrdersTable({
  orders,
  isLoading,
  onUpdateOrder
}) {
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) });
  }
  if (orders.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx(Package, { className: "w-12 h-12 mx-auto text-muted-foreground/50 mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-2", children: "No hay pedidos" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Los pedidos aparecerán aquí cuando los clientes realicen compras." })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-xl border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
    /* @__PURE__ */ jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-sm font-medium text-muted-foreground", children: [
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3 w-10" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Pedido" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Cliente" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Estado" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Pago" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Total" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Fecha" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Acciones" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: orders.map((order) => /* @__PURE__ */ jsx(
      OrderRow,
      {
        order,
        onUpdate: (data) => onUpdateOrder(order.id, data)
      },
      order.id
    )) })
  ] }) });
}

function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    monthlySales: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch("/api/admin/orders", {
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);
  useEffect(() => {
    if (activeTab === "orders" && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab]);
  const handleUpdateOrder = async (orderId, data) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, ...data })
      });
      const result = await response.json();
      if (result.success) {
        await fetchOrders();
        await fetchStats();
      }
    } catch (error) {
      console.error("Error actualizando pedido:", error);
    }
  };
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  const handleSave = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };
  const handleDelete = (id) => {
    deleteProduct(id);
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-serif text-3xl font-bold text-foreground", children: "Panel de Control" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: "Gestiona tu tienda e inventario" })
    ] }),
    /* @__PURE__ */ jsx(
      DashboardStats,
      {
        totalSales: stats.totalSales,
        totalOrders: stats.totalOrders,
        totalProducts: stats.totalProducts,
        lowStockItems: stats.lowStockItems,
        isLoading: isLoadingStats
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-10 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 p-1 bg-muted/50 rounded-xl w-fit", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("products"),
          className: `flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === "products" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
          children: [
            /* @__PURE__ */ jsx(ShoppingBag, { className: "w-4 h-4" }),
            "Productos"
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
            "Pedidos",
            stats.pendingOrders > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-600 rounded-full", children: stats.pendingOrders })
          ]
        }
      )
    ] }) }),
    activeTab === "products" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl font-semibold text-foreground", children: "Productos" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleAddNew,
            className: "px-4 py-2 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors rounded-lg",
            children: "Añadir Producto"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        ProductTable,
        {
          products,
          onEdit: handleEdit,
          onDelete: handleDelete
        }
      )
    ] }),
    activeTab === "orders" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl font-semibold text-foreground", children: "Gestión de Pedidos" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: fetchOrders,
            className: "px-4 py-2 bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors rounded-lg",
            children: "Actualizar"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        OrdersTable,
        {
          orders,
          isLoading: isLoadingOrders,
          onUpdateOrder: handleUpdateOrder
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      ProductModal,
      {
        isOpen: isModalOpen,
        onClose: () => {
          setIsModalOpen(false);
          setEditingProduct(null);
        },
        onSave: handleSave,
        product: editingProduct
      }
    )
  ] });
}

function AdminApp() {
  return /* @__PURE__ */ jsx(ProductProvider, { children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(AdminHeader, {}),
    /* @__PURE__ */ jsx(AdminDashboard, {})
  ] }) });
}

const $$Astro = createAstro();
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  const cookieHeader = Astro2.request.headers.get("cookie");
  const token = getTokenFromCookie(cookieHeader);
  let user = null;
  let isAdmin = false;
  if (token) {
    user = await validateSession(token);
    isAdmin = user?.role === "admin";
  }
  if (!isAdmin) {
    return Astro2.redirect("/login?redirect=/admin&error=unauthorized");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminApp", AdminApp, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jorda/Dev/yishaq/src/components/admin/AdminApp", "client:component-export": "AdminApp" })} ` })}`;
}, "C:/Users/jorda/Dev/yishaq/src/pages/admin.astro", void 0);

const $$file = "C:/Users/jorda/Dev/yishaq/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
