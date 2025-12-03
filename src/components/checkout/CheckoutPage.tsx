/**
 * CheckoutPage - Pasarela de Pago Premium con GSAP
 * Componente wrapper con todos los providers necesarios
 */

import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";
import { CheckoutFlow } from "./CheckoutFlow";

export function CheckoutPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutFlow />
      </CartProvider>
    </AuthProvider>
  );
}
