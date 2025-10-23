
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CakeConfiguration, OrderItem, Product } from '@/types/order';
import { CAKE_PRICING } from '@/config/appConfig';

interface OrderContextType {
  // Cake configuration
  cakeConfig: CakeConfiguration;
  updateCakeConfig: (updates: Partial<CakeConfiguration>) => void;
  resetCakeConfig: () => void;
  
  // Additional products
  orderItems: OrderItem[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  getProductQuantity: (productId: string) => number;
  clearProducts: () => void;
  
  // Calculations
  getCakePrice: () => number;
  getProductsTotal: () => number;
  getOrderTotal: () => number;
  getDepositAmount: () => number;
  
  // Order management
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const initialCakeConfig: CakeConfiguration = {
  base: null,
  cream: null,
  numberOfPeople: CAKE_PRICING.defaultPeople,
  dedication: '',
  photoUri: null,
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [cakeConfig, setCakeConfig] = useState<CakeConfiguration>(initialCakeConfig);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const updateCakeConfig = (updates: Partial<CakeConfiguration>) => {
    setCakeConfig(prev => ({ ...prev, ...updates }));
  };

  const resetCakeConfig = () => {
    setCakeConfig(initialCakeConfig);
  };

  const addProduct = (product: Product) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeProduct = (productId: string) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (!existing) return prev;

      if (existing.quantity === 1) {
        return prev.filter(item => item.product.id !== productId);
      }

      return prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const getProductQuantity = (productId: string) => {
    return orderItems.find(item => item.product.id === productId)?.quantity || 0;
  };

  const clearProducts = () => {
    setOrderItems([]);
  };

  const getCakePrice = () => {
    if (!cakeConfig.base || !cakeConfig.cream) return 0;
    
    const totalWeight = cakeConfig.numberOfPeople * CAKE_PRICING.gramsPerPerson;
    const weightPrice = (totalWeight / 100) * CAKE_PRICING.pricePerHundredGrams;
    return CAKE_PRICING.basePrice + weightPrice;
  };

  const getProductsTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getOrderTotal = () => {
    return getCakePrice() + getProductsTotal();
  };

  const getDepositAmount = () => {
    return getOrderTotal() * 0.5; // 50% deposit
  };

  const clearOrder = () => {
    resetCakeConfig();
    clearProducts();
  };

  const value: OrderContextType = {
    cakeConfig,
    updateCakeConfig,
    resetCakeConfig,
    orderItems,
    addProduct,
    removeProduct,
    getProductQuantity,
    clearProducts,
    getCakePrice,
    getProductsTotal,
    getOrderTotal,
    getDepositAmount,
    clearOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
