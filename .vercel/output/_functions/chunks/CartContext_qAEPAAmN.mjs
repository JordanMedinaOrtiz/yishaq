import { jsx } from 'react/jsx-runtime';
import { createContext, useState, useEffect, useContext } from 'react';

const CART_STORAGE_KEY = "yishaq_cart";
const CartContext = createContext(void 0);
function getStoredCart() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
  }
  return [];
}
function saveCart(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    const storedItems = getStoredCart();
    setItems(storedItems);
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (isHydrated) {
      saveCart(items);
    }
  }, [items, isHydrated]);
  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size
      );
      if (existing) {
        return prev.map(
          (i) => i.id === item.id && i.size === item.size ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  };
  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  };
  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return /* @__PURE__ */ jsx(
    CartContext.Provider,
    {
      value: {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        total,
        isHydrated
      },
      children
    }
  );
}
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export { CartProvider as C, useCart as u };
