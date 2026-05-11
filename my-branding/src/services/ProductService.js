// src/services/ProductService.js

// 1. SHARED MEMORY (Temporary Database)
let productsDB = [
  { 
    id: 1, title: "Oversized 'Brut' Tee", price: "$45.00", category: "Essentials",
    description: "Heavyweight 300GSM organic cotton with a boxy architectural silhouette.",
    stock: 12, totalCapacity: 50, brandsBuilt: 124, status: 'active',
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500" 
  },
  { 
    id: 2, title: "Infrastructure Hoodie", price: "$85.00", category: "Layering",
    description: "450GSM French Terry. Double-stitched seams for maximum structural integrity.",
    stock: 5, totalCapacity: 20, brandsBuilt: 89, status: 'active',
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500" 
  },
  { 
    id: 3, title: "Architectural Coat", price: "$210.00", category: "Outerwear",
    description: "Wool-blend minimalist overcoat featuring hidden hardware and sharp lines.",
    stock: 2, totalCapacity: 10, brandsBuilt: 12, status: 'active',
    img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500" 
  },
  { 
    id: 4, title: "Minimalist Shell", price: "$120.00", category: "Layering",
    description: "Water-resistant technical membrane designed for modular urban environments.",
    stock: 18, totalCapacity: 40, brandsBuilt: 45, status: 'active',
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500" 
  },
  { 
    id: 5, title: "Essential Cargo", price: "$95.00", category: "Bottoms",
    description: "Twill utility pants with articulated knees and discreet branding nodes.",
    stock: 30, totalCapacity: 100, brandsBuilt: 210, status: 'active',
    img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500" 
  },
  { 
    id: 6, title: "Technical Vest", price: "$135.00", category: "Layering",
    description: "Multi-pocket tactical layer with breathable mesh lining and raw edges.",
    stock: 8, totalCapacity: 15, brandsBuilt: 34, status: 'draft',
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500" 
  },
  { 
    id: 7, title: "Structured Button-Up", price: "$75.00", category: "Essentials",
    description: "Crisp poplin cotton with a reinforced collar and minimalist hidden buttons.",
    stock: 15, totalCapacity: 60, brandsBuilt: 156, status: 'active',
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500" 
  },
  { 
    id: 8, title: "Heavy Sweatpants", price: "$65.00", category: "Bottoms",
    description: "Elastic-free hem and high-density fleece for a drape-heavy finish.",
    stock: 40, totalCapacity: 200, brandsBuilt: 432, status: 'active',
    img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500" 
  },
  { 
    id: 9, title: "Raw Denim Blueprint", price: "$150.00", category: "Bottoms",
    description: "14oz selvedge denim. Unwashed, deep indigo, engineered for longevity.",
    stock: 10, totalCapacity: 30, brandsBuilt: 18, status: 'active',
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500" 
  },
  { 
    id: 10, title: "Modular Tech Jacket", price: "$280.00", category: "Outerwear",
    description: "Removable sleeves and GORE-TEX lining. The peak of infrastructure design.",
    stock: 3, totalCapacity: 5, brandsBuilt: 7, status: 'active',
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" 
  },
  { 
    id: 11, title: "Artisan Linen Shirt", price: "$90.00", category: "Essentials",
    description: "Lightweight breathable linen, garment-dyed for a soft, worn-in prestige feel.",
    stock: 14, totalCapacity: 25, brandsBuilt: 55, status: 'active',
    img: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=500" 
  },
  { 
    id: 12, title: "Urban Utility Bag", price: "$55.00", category: "Accessories",
    description: "Ballistic nylon construction with weather-proof zippers and logo branding.",
    stock: 50, totalCapacity: 500, brandsBuilt: 1024, status: 'active',
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" 
  },
];

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productAPI = {
  /**
   * GET ALL PRODUCTS
   */
  getAllProducts: async () => {
    await delay(600);
    console.log('[API] Fetching all products...', productsDB.length);
    return [...productsDB]; 
  },

  /**
   * ADD NEW PRODUCT
   */
  addProduct: async (newProduct) => {
    await delay(800); 
    
    const id = productsDB.length > 0 ? Math.max(...productsDB.map(p => p.id)) + 1 : 1;
    
    const formattedProduct = {
      id,
      title: newProduct.title || "Untitled Product",
      price: newProduct.price || "$0.00",
      category: newProduct.category || "General",
      description: newProduct.description || "No description provided.",
      stock: newProduct.stock || 0,
      totalCapacity: newProduct.stock ? newProduct.stock * 5 : 50,
      brandsBuilt: 0,
      status: newProduct.status || 'draft',
      img: newProduct.images && newProduct.images.length > 0 
        ? newProduct.images[0] 
        : "https://via.placeholder.com/500x625?text=No+Image",
      makerName: newProduct.makerName || "Unknown Maker",
      tags: newProduct.tags || []
    };

    productsDB.unshift(formattedProduct); 
    console.log('[API] Product Added:', formattedProduct);
    return formattedProduct;
  },

  /**
   * UPDATE PRODUCT
   */
  updateProduct: async (id, updatedData) => {
    await delay(500);
    
    const index = productsDB.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");

    productsDB[index] = { ...productsDB[index], ...updatedData };
    
    console.log(`[API] Product ${id} updated:`, productsDB[index]);
    return productsDB[index];
  },

  /**
   * DELETE PRODUCT
   */
  deleteProduct: async (id) => {
    await delay(500);
    const initialLength = productsDB.length;
    productsDB = productsDB.filter(p => p.id !== id);
    
    if (productsDB.length === initialLength) {
      throw new Error("Product not found");
    }
    
    console.log(`[API] Product ${id} deleted`);
    return true;
  },

  /**
   * GET CATEGORIES
   */
  getCategories: async () => {
    await delay(400);
    const categories = [...new Set(productsDB.map(p => p.category))];
    return ['All', ...categories];
  },

  /**
   * FILTER BY CATEGORY
   */
  getProductsByCategory: async (category) => {
    await delay(600);
    if (category === 'All') return [...productsDB];
    
    const filtered = productsDB.filter(p => p.category === category);
    return filtered;
  }
};

// THIS LINE FIXES YOUR ERROR:
export default productAPI;