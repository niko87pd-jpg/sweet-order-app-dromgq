
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

export const CAKE_BASES: { value: CakeBase; label: string }[] = [
  { value: 'pasta_sfoglia', label: 'Pasta Sfoglia' },
  { value: 'pasta_frolla', label: 'Pasta Frolla' },
  { value: 'meringa', label: 'Meringa' },
  { value: 'pan_di_spagna', label: 'Pan di Spagna' },
];

export const CAKE_CREAMS: { value: CakeCream; label: string }[] = [
  { value: 'chantilly', label: 'Chantilly' },
  { value: 'cioccolato', label: 'Cioccolato' },
  { value: 'pistacchio', label: 'Pistacchio' },
  { value: 'nocciola', label: 'Nocciola' },
];

export const GRAMS_PER_PERSON = 140;

export const BASE_CAKE_PRICE = 25; // Base price for cake
export const PRICE_PER_100G = 3.5; // Price per 100g
