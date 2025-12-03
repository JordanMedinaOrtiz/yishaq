import { useState, useEffect } from "react";
import { DashboardStats } from "./DashboardStats";
import { ProductTable } from "./ProductTable";
import { ProductModal } from "./ProductModal";
import { OrdersTable } from "./OrdersTable";
import { useProducts, type Product } from "../../context/ProductContext";
import { Package, ShoppingBag } from "lucide-react";

interface DashboardStatsData {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStockItems: number;
  pendingOrders: number;
  monthlySales: number;
}

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
  shippingPhone: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  trackingNumber: string | null;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
}

type AdminTab = "products" | "orders";

export function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [stats, setStats] = useState<DashboardStatsData>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    monthlySales: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Cargar estadísticas reales desde la API
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Cargar pedidos
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch("/api/admin/orders", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Cargar pedidos cuando se cambia a la pestaña de pedidos
  useEffect(() => {
    if (activeTab === "orders" && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab]);

  // Actualizar un pedido
  const handleUpdateOrder = async (orderId: string, data: any) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, ...data }),
      });

      const result = await response.json();

      if (result.success) {
        // Recargar pedidos y estadísticas
        await fetchOrders();
        await fetchStats();
      }
    } catch (error) {
      console.error("Error actualizando pedido:", error);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<Product, "id">) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Panel de Control
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona tu tienda e inventario
        </p>
      </div>

      <DashboardStats
        totalSales={stats.totalSales}
        totalOrders={stats.totalOrders}
        totalProducts={stats.totalProducts}
        lowStockItems={stats.lowStockItems}
        isLoading={isLoadingStats}
      />

      {/* Tabs de navegación */}
      <div className="mt-10 mb-6">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === "products"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === "orders"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="w-4 h-4" />
            Pedidos
            {stats.pendingOrders > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-600 rounded-full">
                {stats.pendingOrders}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Contenido según tab activo */}
      {activeTab === "products" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Productos
            </h2>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors rounded-lg"
            >
              Añadir Producto
            </button>
          </div>

          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Gestión de Pedidos
            </h2>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors rounded-lg"
            >
              Actualizar
            </button>
          </div>

          <OrdersTable
            orders={orders}
            isLoading={isLoadingOrders}
            onUpdateOrder={handleUpdateOrder}
          />
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
}
