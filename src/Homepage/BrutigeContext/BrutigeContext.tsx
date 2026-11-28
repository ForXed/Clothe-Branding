import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import styles from "./BrutigeContext.module.css";

// --- CORE TYPESCRIPT INTERFACES (Exported for the whole app) ---

// ✅ NEW: Color variant image structure
export interface ColorVariantImage {
  id: number;
  preview: string;
  url: string;
  file?: File;
}

// ✅ NEW: Color variant structure
export interface ColorVariant {
  id: number;
  name: string;
  hex: string;
  images: ColorVariantImage[];
}

export interface Product {
  id: number | string;
  title: string;
  price: string;
  img: string;
  images?: string[]; // ✅ Multiple images for carousel
  variants?: ColorVariant[]; // ✅ Color variants with images

  // 👇 MADE THESE OPTIONAL so components with "small" products don't throw errors
  category?: string;
  description?: string;
  stock?: number;
  totalCapacity?: number;
  brandsBuilt?: number;
  dateCreated?: string;
  makerName?: string;
  tags?: string[];
  sizes?: string[];
  sku?: string;

  // ✅ NEW: Dynamic product specifications
  composition?: string; // "100% Organic Cotton"
  weight?: string; // "Heavyweight (300 GSM)"
  origin?: string; // "Made in Lagos, Nigeria"
}

// export interface CartItem extends Product {
//   quantity: number;
//   size: string;
//   color: string;
// }

export interface SavedItem extends Product {
  collection?: string; // Kept this since SavedView uses it
}

export interface Notification {
  id: number;
  message: string;
}

type ViewMode = "customer" | "maker";

// The shape of the context value
interface BrutigeContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;

  // products: Product[];
  // addProduct: (
  //   newProduct: Omit<
  //     Product,
  //     "id" | "brandsBuilt" | "totalCapacity" | "dateCreated"
  //   > & { stock?: number },
  // ) => void;
  // deleteProduct: (id: number | string) => void;

  // cartItems: CartItem[];
  // setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  // addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;

  savedItems: SavedItem[];
  toggleSaved: (product: Product) => void;

  notifications: Notification[];
}

interface BrutigeProviderProps {
  children: ReactNode;
}

// Create context with undefined as default
const BrutigeContext = createContext<BrutigeContextType | undefined>(undefined);

export const BrutigeProvider: React.FC<BrutigeProviderProps> = ({
  children,
}) => {
  // --- 1. CORE STATE MANAGEMENT ---
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (localStorage.getItem("brut_viewMode") as ViewMode) || "customer",
  );

  // const [cartItems, setCartItems] = useState<CartItem[]>(() =>
  //   JSON.parse(localStorage.getItem('brut_cart') || '[]')
  // );

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() =>
    JSON.parse(localStorage.getItem("brut_saved") || "[]"),
  );

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // --- 2. PRODUCT DATABASE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("brut_products");
    return savedProducts
      ? JSON.parse(savedProducts)
      : [
          {
            id: 1,
            title: "Oversized 'Brut' Tee",
            price: "₦35,000",
            category: "Tops",
            description:
              "Heavyweight 300GSM organic cotton with a boxy architectural silhouette.",
            stock: 12,
            totalCapacity: 50,
            brandsBuilt: 124,
            img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500",
            images: [
              "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500",
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            ],
            variants: [
              {
                id: 1,
                name: "Black",
                hex: "#000000",
                images: [
                  {
                    id: 1,
                    preview:
                      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500",
                    url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500",
                  },
                  {
                    id: 2,
                    preview:
                      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
                    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
                  },
                ],
              },
              {
                id: 2,
                name: "White",
                hex: "#ffffff",
                images: [
                  {
                    id: 3,
                    preview:
                      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
                    url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
                  },
                ],
              },
            ],
            // ✅ NEW: Dynamic specifications
            composition: "100% Organic Cotton",
            weight: "Heavyweight (300 GSM)",
            origin: "Made in Lagos, Nigeria",
          },
          {
            id: 2,
            title: "Infrastructure Hoodie",
            price: "₦75,000",
            category: "Tops",
            description:
              "450GSM French Terry. Double-stitched seams for maximum structural integrity.",
            stock: 5,
            totalCapacity: 20,
            brandsBuilt: 89,
            img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
            images: [
              "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
              "https://images.unsplash.com/photo-1578768079470-0a4536e2b2c3?w=500",
            ],
            variants: [
              {
                id: 1,
                name: "Grey",
                hex: "#2A2A2A",
                images: [
                  {
                    id: 4,
                    preview:
                      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
                    url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
                  },
                  {
                    id: 5,
                    preview:
                      "https://images.unsplash.com/photo-1578768079470-0a4536e2b2c3?w=500",
                    url: "https://images.unsplash.com/photo-1578768079470-0a4536e2b2c3?w=500",
                  },
                ],
              },
            ],
            // ✅ NEW: Dynamic specifications
            composition: "80% Cotton, 20% Polyester",
            weight: "Heavyweight (450 GSM)",
            origin: "Made in Abuja, Nigeria",
          },
          {
            id: 3,
            title: "Architectural Coat",
            price: "₦210,000",
            category: "Outerwear",
            description:
              "Wool-blend minimalist overcoat featuring hidden hardware and sharp lines.",
            stock: 2,
            totalCapacity: 10,
            brandsBuilt: 12,
            img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
            images: [
              "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
              "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500",
            ],
            variants: [
              {
                id: 1,
                name: "Black",
                hex: "#000000",
                images: [
                  {
                    id: 6,
                    preview:
                      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
                    url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500",
                  },
                  {
                    id: 7,
                    preview:
                      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500",
                    url: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500",
                  },
                ],
              },
            ],
            // ✅ NEW: Dynamic specifications
            composition: "70% Wool, 30% Cashmere",
            weight: "Medium-Heavy (380 GSM)",
            origin: "Made in Lagos, Nigeria",
          },
        ];
  });

  // --- 3. PERSISTENCE LAYER before P2_8---
  // useEffect(() => {
  //   localStorage.setItem('brut_viewMode', viewMode);
  //   localStorage.setItem('brut_cart', JSON.stringify(cartItems));
  //   localStorage.setItem('brut_saved', JSON.stringify(savedItems));
  //   localStorage.setItem('brut_products', JSON.stringify(products));
  // }, [viewMode, cartItems, savedItems, products]);

  // --- 3. PERSISTENCE LAYER ---
  useEffect(() => {
    localStorage.setItem("brut_viewMode", viewMode);
    localStorage.setItem("brut_saved", JSON.stringify(savedItems));
    localStorage.setItem("brut_products", JSON.stringify(products));
  }, [viewMode, savedItems, products]);

  // --- 6. UTILITY: NOTIFICATIONS ---
  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // --- 4. MAKER ACTIONS ---
  const addProduct = (
    newProduct: Omit<
      Product,
      "id" | "brandsBuilt" | "totalCapacity" | "dateCreated"
    > & { stock?: number },
  ) => {
    const productWithMeta: Product = {
      ...newProduct,
      id: Date.now(),
      brandsBuilt: 0,
      totalCapacity: newProduct.stock || 100,
      dateCreated: new Date().toISOString(),
    };
    setProducts((prev) => [productWithMeta, ...prev]);
    addNotification("New infrastructure template published.");
  };

  const deleteProduct = (id: number | string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addNotification("Template removed from catalog.");
  };

  // --- 5. CUSTOMER ACTIONS ---
  const toggleViewMode = () => {
    const newMode: ViewMode = viewMode === "customer" ? "maker" : "customer";
    setViewMode(newMode);
    addNotification(`Switched to ${newMode} mode.`);
  };

  const toggleSaved = (product: Product) => {
    setSavedItems((prev) => {
      const isSaved = prev.some((item) => item.id === product.id);
      if (isSaved) {
        addNotification("Removed from archive.");
        return prev.filter((item) => item.id !== product.id);
      }
      addNotification("Template archived.");
      return [...prev, product];
    });
  };

  return (
    <BrutigeContext.Provider
      value={{
        viewMode,
        toggleViewMode,
        savedItems,
        toggleSaved,
        notifications,
      }}
    >
      {children}

      {/* GLOBAL TOAST CONTAINER */}
      <div className={styles.toastContainer}>
        {notifications.map((n) => (
          <div key={n.id} className={styles.toast}>
            <div className={styles.dot} />
            {n.message}
          </div>
        ))}
      </div>
    </BrutigeContext.Provider>
  );
};

// Custom hook with safety check
export const useBrutige = (): BrutigeContextType => {
  const context = useContext(BrutigeContext);
  if (context === undefined) {
    throw new Error("useBrutige must be used within a BrutigeProvider");
  }
  return context;
};
