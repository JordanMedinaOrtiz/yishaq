import { jsx, jsxs } from 'react/jsx-runtime';
import { u as useAuth, A as AuthProvider } from './AuthContext_DjGZTLld.mjs';
import { useState, useEffect } from 'react';
import { B as Button } from './button_EkdW3CYr.mjs';
import { L as Label, I as Input } from './label_IJB1Fc6j.mjs';

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("/");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    const urlError = params.get("error");
    if (redirect) setRedirectUrl(redirect);
    if (urlError === "unauthorized") {
      setError(
        "Necesitas iniciar sesión como administrador para acceder a esa página"
      );
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await login(email, password);
    if (result.success) {
      window.location.href = redirectUrl;
    } else {
      setError(result.error || "Error al iniciar sesión");
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "font-serif text-3xl font-bold tracking-tighter text-foreground",
          children: "YISHAQ"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-semibold", children: "Iniciar Sesión" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Ingresa a tu cuenta para continuar" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      error && /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm", children: error }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            placeholder: "tu@email.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Contraseña" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            placeholder: "••••••••",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? "Ingresando..." : "Ingresar" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      "¿No tienes cuenta?",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/registro", className: "text-primary hover:underline", children: "Regístrate aquí" })
    ] })
  ] }) });
}

function RegisterForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setIsLoading(true);
    const result = await register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    );
    if (result.success) {
      window.location.href = "/";
    } else {
      setError(result.error || "Error al crear la cuenta");
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "font-serif text-3xl font-bold tracking-tighter text-foreground",
          children: "YISHAQ"
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-semibold", children: "Crear Cuenta" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Regístrate para comenzar a comprar" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      error && /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm", children: error }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "firstName", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "firstName",
              name: "firstName",
              placeholder: "Juan",
              value: formData.firstName,
              onChange: handleChange,
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "lastName", children: "Apellido" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "lastName",
              name: "lastName",
              placeholder: "Pérez",
              value: formData.lastName,
              onChange: handleChange,
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            name: "email",
            type: "email",
            placeholder: "tu@email.com",
            value: formData.email,
            onChange: handleChange,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Contraseña" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Mínimo 8 caracteres",
            value: formData.password,
            onChange: handleChange,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPassword", children: "Confirmar Contraseña" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "confirmPassword",
            name: "confirmPassword",
            type: "password",
            placeholder: "Repite tu contraseña",
            value: formData.confirmPassword,
            onChange: handleChange,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? "Creando cuenta..." : "Crear Cuenta" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
      "¿Ya tienes cuenta?",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/login", className: "text-primary hover:underline", children: "Inicia sesión" })
    ] })
  ] }) });
}

function LoginPage() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(LoginForm, {}) });
}
function RegisterPage() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(RegisterForm, {}) });
}

export { LoginPage as L, RegisterPage as R };
