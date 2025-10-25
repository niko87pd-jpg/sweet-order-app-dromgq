
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CakeConfiguration, ClassicCakeConfiguration, OrderItem, Product } from '@/types/order';
import { CAKE_PRICING, CAKE_FINITURA_CONFIG, CAKE_VARIEGATURA_CONFIG, CAKE_LACTOSE_FREE_CONFIG } from '@/config/appConfig';

interface OrderContextType {
  cakeConfig: CakeConfiguration;
  updateCakeConfig: (updates: Partial<CakeConfiguration>) => void;
  resetCakeConfig: () => void;
  classicCakeConfig: ClassicCakeConfiguration;
  updateClassicCakeConfig: (updates: Partial<ClassicCakeConfiguration>) => void;
  resetClassicCakeConfig: () => void;
  orderItems: OrderItem[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  getProductQuantity: (productId: string) => number;
  clearProducts: () => void;
  getCakePrice: () => number;
  getClassicCakePrice: () => number;
  getProductsTotal: () => number;
  getOrderTotal: () => number;
  getDepositAmount: () => number;
  clearOrder: () => void;
  pickupDate: Date | null;
  pickupTime: string | null;
  setPickupDate: (date: Date | null) => void;
  setPickupTime: (time: string | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const initialCakeConfig: CakeConfiguration = {
  base: null,
  cream: null,
  creamFirstLayer: null,
  creamSecondLayer: null,
  meringaFilling: null,
  condimento: 'nessuno',
  variegatura: 'nessuna',
  finitura: 'panna_normale',
  lactoseFree: 'con_lattosio',
  numberOfPeople: CAKE_PRICING.defaultPeople,
  dedication: '',
  photoUri: null,
};

const initialClassicCakeConfig: ClassicCakeConfiguration = {
  cakeType: null,
  numberOfPeople: CAKE_PRICING.defaultPeople,
  dedication: '',
  photoUri: null,
};

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [cakeConfig, setCakeConfig] = useState<CakeConfiguration>(initialCakeConfig);
  const [classicCakeConfig, setClassicCakeConfig] = useState<ClassicCakeConfiguration>(initialClassicCakeConfig);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState<string | null>(null);

  const updateCakeConfig = (updates: Partial<CakeConfiguration>) => {
    setCakeConfig(prev => ({ ...prev, ...updates }));
  };

  const resetCakeConfig = () => {
    setCakeConfig(initialCakeConfig);
  };

  const updateClassicCakeConfig = (updates: Partial<ClassicCakeConfiguration>) => {
    setClassicCakeConfig(prev => ({ ...prev, ...updates }));
  };

  const resetClassicCakeConfig = () => {
    setClassicCakeConfig(initialClassicCakeConfig);
  };

  const addProduct = (product: Product) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
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
      const existingItem = prev.find(item => item.product.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const getProductQuantity = (productId: string): number => {
    const item = orderItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const clearProducts = () => {
    setOrderItems([]);
  };

  const getCakePrice = (): number => {
    // Calcolo base: peso totale * prezzo al kg
    const totalWeightKg = (cakeConfig.numberOfPeople * CAKE_PRICING.gramsPerPerson) / 1000;
    let totalPrice = totalWeightKg * CAKE_PRICING.pricePerKg;
    
    // Aggiungi costo variegatura se presente (solo per non-meringa)
    if (cakeConfig.base !== 'meringa') {
      const variegaturaOption = CAKE_VARIEGATURA_CONFIG.find(v => v.value === cakeConfig.variegatura);
      if (variegaturaOption && variegaturaOption.price > 0) {
        totalPrice += variegaturaOption.price;
      }
    }
    
    // Aggiungi costo finitura se presente
    const finituraOption = CAKE_FINITURA_CONFIG.find(f => f.value === cakeConfig.finitura);
    if (finituraOption && finituraOption.price > 0) {
      totalPrice += finituraOption.price;
    }
    
    // Aggiungi costo senza lattosio se presente
    const lactoseFreeOption = CAKE_LACTOSE_FREE_CONFIG.find(l => l.value === cakeConfig.lactoseFree);
    if (lactoseFreeOption && lactoseFreeOption.price > 0) {
      totalPrice += lactoseFreeOption.price;
    }
    
    // Aggiungi sovraprezzo per due creme diverse
    if (cakeConfig.creamFirstLayer && cakeConfig.creamSecondLayer && 
        cakeConfig.creamFirstLayer !== cakeConfig.creamSecondLayer) {
      totalPrice += CAKE_PRICING.differentCreamsSurcharge;
    }
    
    // Aggiungi sovraprezzo foto se presente
    if (cakeConfig.photoUri) {
      totalPrice += CAKE_PRICING.photoSurcharge;
    }
    
    return totalPrice;
  };

  const getClassicCakePrice = (): number => {
    // Calcolo base: peso totale * prezzo al kg
    const totalWeightKg = (classicCakeConfig.numberOfPeople * CAKE_PRICING.gramsPerPerson) / 1000;
    let totalPrice = totalWeightKg * CAKE_PRICING.pricePerKg;
    
    // Aggiungi sovraprezzo foto se presente
    if (classicCakeConfig.photoUri) {
      totalPrice += CAKE_PRICING.photoSurcharge;
    }
    
    return totalPrice;
  };

  const getProductsTotal = (): number => {
    return orderItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getOrderTotal = (): number => {
    let total = getProductsTotal();
    
    // Aggiungi il prezzo del dolce personalizzato se configurato
    if (cakeConfig.base) {
      total += getCakePrice();
    }
    
    // Aggiungi il prezzo del dolce classico se configurato
    if (classicCakeConfig.cakeType) {
      total += getClassicCakePrice();
    }
    
    return total;
  };

  const getDepositAmount = (): number => {
    return getOrderTotal() * 0.5; // 50% deposit
  };

  const clearOrder = () => {
    resetCakeConfig();
    resetClassicCakeConfig();
    clearProducts();
    setPickupDate(null);
    setPickupTime(null);
  };

  return (
    <OrderContext.Provider
      value={{
        cakeConfig,
        updateCakeConfig,
        resetCakeConfig,
        classicCakeConfig,
        updateClassicCakeConfig,
        resetClassicCakeConfig,
        orderItems,
        addProduct,
        removeProduct,
        getProductQuantity,
        clearProducts,
        getCakePrice,
        getClassicCakePrice,
        getProductsTotal,
        getOrderTotal,
        getDepositAmount,
        clearOrder,
        pickupDate,
        pickupTime,
        setPickupDate,
        setPickupTime,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
