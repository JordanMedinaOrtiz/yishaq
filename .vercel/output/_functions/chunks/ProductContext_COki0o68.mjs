import { jsx } from 'react/jsx-runtime';
import { createContext, useState, useEffect, useContext } from 'react';

const ProductContext = createContext(void 0);
function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
  useEffect(() => {
    fetchProducts();
  }, []);
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: crypto.randomUUID()
    };
    setProducts((prev) => [...prev, newProduct]);
  };
  const updateProduct = (id, updates) => {
    setProducts(
      (prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p)
    );
  };
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  return /* @__PURE__ */ jsx(
    ProductContext.Provider,
    {
      value: {
        products,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        refetch: fetchProducts
      },
      children
    }
  );
}
function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}

export { ProductProvider as P, useProducts as u };
