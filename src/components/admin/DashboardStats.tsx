import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface DashboardStatsProps {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  lowStockItems: number;
  isLoading?: boolean;
}

export function DashboardStats({
  totalSales,
  totalOrders,
  totalProducts,
  lowStockItems,
  isLoading = false,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Ventas Totales",
      value: `$${totalSales.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Pedidos Totales",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Productos",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      label: "Stock Bajo",
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                {isLoading ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-card-foreground">
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
