import { Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl font-bold mb-4 text-card-foreground">
              YISHAQ
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Audaz. Moderno. Sin límites. Definiendo el futuro de la moda con
              piezas que hacen declaraciones.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-4 text-card-foreground">
              Tienda
            </h4>
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Novedades
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Abrigos
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Tops
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pantalones
              </a>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest uppercase mb-4 text-card-foreground">
              Info
            </h4>
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sobre Nosotros
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contacto
              </a>
              <a
                href="/admin"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} YISHAQ. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
