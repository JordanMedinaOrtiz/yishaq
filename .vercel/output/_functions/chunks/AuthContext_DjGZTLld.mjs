import { jsx } from 'react/jsx-runtime';
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    refreshUser();
  }, []);
  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include"
      });
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error verificando sesión:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Error al iniciar sesión" };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  };
  const register = async (email, password, firstName, lastName) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, firstName, lastName })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Error al registrar" };
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  };
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setUser(null);
    }
  };
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        refreshUser
      },
      children
    }
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider as A, useAuth as u };
