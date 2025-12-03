import { ArrowLeft, LayoutDashboard } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la Tienda
            </a>
          </div>

          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-serif text-lg font-semibold text-card-foreground">
              YISHAQ Admin
            </span>
          </div>

          <div className="w-[100px]" />
        </div>
      </div>
    </header>
  );
}
