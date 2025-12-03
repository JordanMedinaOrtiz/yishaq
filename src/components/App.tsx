import { CartProvider } from "../context/CartContext";
import { ProductProvider } from "../context/ProductContext";
import { AuthProvider } from "../context/AuthContext";
import { Header } from "./Header";
import { CartDrawer } from "./CartDrawer";
import { HeroSection } from "./HeroSection";
import { ProductGrid } from "./ProductGrid";
import { Footer } from "./Footer";

export function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <main className="min-h-screen bg-background">
            <Header />
            <CartDrawer />
            <HeroSection />
            <ProductGrid />
            <Footer />
          </main>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
