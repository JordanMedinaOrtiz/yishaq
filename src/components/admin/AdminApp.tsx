import { ProductProvider } from "../../context/ProductContext";
import { AdminHeader } from "./AdminHeader";
import { AdminDashboard } from "./AdminDashboard";

export function AdminApp() {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <AdminDashboard />
      </div>
    </ProductProvider>
  );
}
