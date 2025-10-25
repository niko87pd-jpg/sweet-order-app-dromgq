
import { Product } from '@/types/order';

/**
 * PRODOTTI AGGIUNTIVI DELLA PASTICCERIA
 * 
 * Prodotti aggiornati secondo le specifiche del cliente
 */

export const ADDITIONAL_PRODUCTS: Product[] = [
  {
    id: 'candles_simple',
    name: 'Candeline Semplici',
    description: 'Azzurre, rosa o rosse - 2 pezzi comprese nel dolce',
    price: 1.00,
    includedQuantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400',
  },
  {
    id: 'candles_number',
    name: 'Candelina con Numero',
    description: 'Base bianca e numero in plastica - €1,50 a numero (compresa candelina)',
    price: 1.5,
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400',
  },
  {
    id: 'candles_happy_birthday_small',
    name: 'Candeline "HAPPY BIRTHDAY" Piccola',
    description: 'Scritta decorativa piccola',
    price: 3,
    imageUrl: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400',
  },
  {
    id: 'candles_happy_birthday_large',
    name: 'Candeline "HAPPY BIRTHDAY" Grande',
    description: 'Scritta decorativa grande',
    price: 5,
    imageUrl: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400',
  },
  {
    id: 'thermal_container',
    name: 'Contenitore Termico',
    description: 'Con ghiacci per mantenimento dolce 8 ore senza frigorifero - €5 noleggio + €50 cauzione in contanti',
    price: 5,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  },
];
