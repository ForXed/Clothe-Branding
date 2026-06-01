import { useState, useEffect } from 'react';

export const useStudioData = () => {
  const [data, setData] = useState({
    overview: null,
    products: [],
    orders: [],
    messages: [],
    transactions: [],
    loading: true,
    error: null
  });

  // Simulate API calls to Java backend
  const fetchOverview = async () => {
    // GET /api/studio/overview
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          revenue: 24500,
          salesVelocity: 4.2,
          conversionRate: 3.8,
          rsi: 68
        });
      }, 500);
    });
  };

  const fetchProducts = async () => {
    // GET /api/studio/products
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '450GSM Heavyweight Tee', price: 89, stock: 12, status: 'active' },
          { id: 2, name: 'Techwear Cargo V2', price: 145, stock: 8, status: 'active' },
        ]);
      }, 500);
    });
  };

  const updateProduct = async (productId, updates) => {
    // PUT /api/studio/products/{id}
    console.log(`Updating product ${productId}:`, updates);
    return { success: true };
  };

  const fetchOrders = async (status = 'all') => {
    // GET /api/studio/orders?status={status}
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'BR-001', customer: 'Alex M.', total: 245, status: 'pending' },
        ]);
      }, 500);
    });
  };

  const updateOrderStatus = async (orderId, status) => {
    // PATCH /api/studio/orders/{id}/status
    console.log(`Updating order ${orderId} to ${status}`);
    return { success: true };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [overview, products] = await Promise.all([
          fetchOverview(),
          fetchProducts()
        ]);
        
        setData(prev => ({
          ...prev,
          overview,
          products,
          loading: false
        }));
      } catch (err) {
        setData(prev => ({ ...prev, error: err.message, loading: false }));
      }
    };

    loadData();
  }, []);

  return {
    ...data,
    refreshOverview: fetchOverview,
    refreshProducts: fetchProducts,
    updateProduct,
    fetchOrders,
    updateOrderStatus
  };
};

export default useStudioData;