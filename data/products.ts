
import { Product } from '@/types/order';

/**
 * PRODOTTI AGGIUNTIVI DELLA PASTICCERIA
 * 
 * Personalizza questa lista con i tuoi prodotti.
 * Per ogni prodotto puoi specificare:
 * - id: identificativo unico (non modificare dopo la creazione)
 * - name: nome del prodotto
 * - description: breve descrizione
 * - price: prezzo in euro
 * - imageUrl: URL dell'immagine (puoi usare le tue foto caricate su un servizio come Unsplash, Imgur, o il tuo server)
 * 
 * COME AGGIUNGERE LE TUE FOTO:
 * 1. Carica le foto su un servizio di hosting immagini (es: Imgur, Cloudinary, o il tuo server)
 * 2. Copia l'URL diretto dell'immagine
 * 3. Sostituisci l'URL nel campo imageUrl
 * 
 * ESEMPIO:
 * imageUrl: 'https://tuosito.com/immagini/cannoli.jpg'
 */

export const ADDITIONAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cannoli Siciliani',
    description: 'Cannoli croccanti con ricotta fresca',
    price: 3.5,
    // Sostituisci con la tua foto
    imageUrl: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400',
  },
  {
    id: '2',
    name: 'Tiramisù',
    description: 'Classico tiramisù fatto in casa',
    price: 5.0,
    // Sostituisci con la tua foto
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
  },
  {
    id: '3',
    name: 'Croissant',
    description: 'Croissant sfogliato al burro',
    price: 2.5,
    // Sostituisci con la tua foto
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
  },
  {
    id: '4',
    name: 'Biscotti Assortiti',
    description: 'Selezione di biscotti artigianali (500g)',
    price: 12.0,
    // Sostituisci con la tua foto
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
  },
  {
    id: '5',
    name: 'Macarons',
    description: 'Macarons francesi assortiti (6 pezzi)',
    price: 8.0,
    // Sostituisci con la tua foto
    imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400',
  },
  {
    id: '6',
    name: 'Sfogliatelle',
    description: 'Sfogliatelle napoletane (2 pezzi)',
    price: 4.5,
    // Sostituisci con la tua foto
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  },
];

/**
 * COME AGGIUNGERE NUOVI PRODOTTI:
 * 
 * Copia e incolla questo template alla fine dell'array ADDITIONAL_PRODUCTS:
 * 
 * {
 *   id: '7', // Incrementa il numero
 *   name: 'Nome del Prodotto',
 *   description: 'Descrizione del prodotto',
 *   price: 10.0, // Prezzo in euro
 *   imageUrl: 'https://tuosito.com/immagini/prodotto.jpg',
 * },
 * 
 * COME RIMUOVERE PRODOTTI:
 * Semplicemente elimina l'oggetto corrispondente dall'array.
 */
