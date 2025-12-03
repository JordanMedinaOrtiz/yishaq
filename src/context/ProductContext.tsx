import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  stock: number;
  featured: boolean;
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  refetch: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos desde la API
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/products");
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        console.log(
          `[ProductContext] Cargados ${data.products.length} productos desde la DB`
        );
      } else {
        setError(data.error || "Error al cargar productos");
        console.error("[ProductContext] Error:", data.error);
      }
    } catch (err) {
      console.error("[ProductContext] Error de conexión:", err);
      setError("Error de conexión al cargar productos");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = (product: Omit<Product, "id">) => {
    // TODO: Implementar POST a /api/products
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    // TODO: Implementar PUT a /api/products/:id
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    // TODO: Implementar DELETE a /api/products/:id
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        refetch: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
