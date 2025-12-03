/**
 * Wrapper para páginas de autenticación
 * Envuelve los componentes con AuthProvider para que tengan acceso al contexto
 */

import { AuthProvider } from "../../context/AuthContext";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}

export function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}
