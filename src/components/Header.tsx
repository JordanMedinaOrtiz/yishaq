import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export function Header() {
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

  const headerStyles = scrolled
    ? "bg-background/80 backdrop-blur-lg border-b border-border"
    : "bg-transparent";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerStyles}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="/"
            className="font-serif text-xl md:text-2xl font-bold tracking-tighter text-foreground"
          >
            YISHAQ
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/#products"
              className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Colección
            </a>
            {/* Mostrar Admin solo si el usuario es admin */}
            {isAdmin && (
              <a
                href="/admin"
                className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Shield className="w-4 h-4" />
                Admin
              </a>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* User Menu */}
            {!isLoading && (
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-2 text-foreground hover:text-primary transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden sm:inline text-sm">
                        {user?.firstName}
                      </span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        <a
                          href="/perfil"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Mi Perfil
                        </a>
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href="/login"
                    className="flex items-center gap-2 p-2 text-foreground hover:text-primary transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm">Ingresar</span>
                  </a>
                )}
              </div>
            )}

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a
                href="/#products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Colección
              </a>
              {/* Mostrar Admin solo si el usuario es admin */}
              {isAdmin && (
                <a
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </a>
              )}
              {!isAuthenticated && (
                <>
                  <a
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Iniciar Sesión
                  </a>
                  <a
                    href="/registro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
                  >
                    Registrarse
                  </a>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
