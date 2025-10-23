
export type CakeBase = 'pasta_sfoglia' | 'pasta_frolla' | 'meringa' | 'pan_di_spagna';
export type CakeCream = 'chantilly' | 'cioccolato' | 'pistacchio' | 'nocciola';

export interface CakeConfiguration {
  base: CakeBase | null;
  cream: CakeCream | null;
  numberOfPeople: number;
  dedication: string;
  photoUri: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  cakeConfig: CakeConfiguration;
  additionalItems: OrderItem[];
  totalPrice: number;
  depositAmount: number;
}

// Importa le configurazioni dal file di config
import { CAKE_BASES_CONFIG, CAKE_CREAMS_CONFIG, CAKE_PRICING } from '@/config/appConfig';

export const CAKE_BASES: { value: CakeBase; label: string }[] = CAKE_BASES_CONFIG.map(base => ({
  value: base.value as CakeBase,
  label: base.label,
}));

export const CAKE_CREAMS: { value: CakeCream; label: string }[] = CAKE_CREAMS_CONFIG.map(cream => ({
  value: cream.value as CakeCream,
  label: cream.label,
}));

export const GRAMS_PER_PERSON = CAKE_PRICING.gramsPerPerson;
export const BASE_CAKE_PRICE = CAKE_PRICING.basePrice;
export const PRICE_PER_100G = CAKE_PRICING.pricePerHundredGrams;
