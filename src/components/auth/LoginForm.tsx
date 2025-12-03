/**
 * Componente de Login
 */

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("/");

  useEffect(() => {
    // Obtener parámetros de URL
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirigir
      window.location.href = redirectUrl;
    } else {
      setError(result.error || "Error al iniciar sesión");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a
            href="/"
            className="font-serif text-3xl font-bold tracking-tighter text-foreground"
          >
            YISHAQ
          </a>
          <h1 className="mt-6 text-2xl font-semibold">Iniciar Sesión</h1>
          <p className="mt-2 text-muted-foreground">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-primary hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
