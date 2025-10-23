
/**
 * CONFIGURAZIONE PERSONALIZZATA DELL'APP PASTICCERIA
 * 
 * Questo file contiene tutte le impostazioni personalizzabili dell'app.
 * Modifica i valori qui sotto per personalizzare l'app con i tuoi dati.
 */

// ============================================
// INFORMAZIONI PASTICCERIA
// ============================================
export const PASTRY_INFO = {
  // Nome della tua pasticceria (apparirà nell'header)
  name: 'Pasticceria Dolce Vita',
  
  // Emoji o icona principale (apparirà nella home)
  emoji: '🧁',
  
  // Logo della pasticceria (percorso al file immagine)
  logo: require('@/assets/images/b27037d7-641b-4c48-9b18-7bf63e20cb9f.jpeg'),
  
  // Messaggio di benvenuto
  welcomeTitle: 'Benvenuto!',
  welcomeSubtitle: 'Crea il tuo dolce personalizzato o scegli dai nostri prodotti',
  
  // Informazioni di contatto
  phone: '+39 123 456 7890',
  email: 'info@pasticceriadolcevita.it',
  address: 'Via Roma 123, 00100 Roma',
  
  // Orari di apertura
  openingHours: {
    weekdays: '8:00 - 20:00',
    saturday: '8:00 - 21:00',
    sunday: '9:00 - 13:00',
  },
};

// ============================================
// PREZZI E CALCOLI DOLCI
// ============================================
export const CAKE_PRICING = {
  // Prezzo base del dolce (€)
  basePrice: 25,
  
  // Prezzo per 100g (€)
  pricePerHundredGrams: 3.5,
  
  // Grammi per persona (standard: 140g)
  gramsPerPerson: 140,
  
  // Numero minimo di persone
  minPeople: 1,
  
  // Numero massimo di persone
  maxPeople: 50,
  
  // Numero predefinito di persone
  defaultPeople: 4,
};

// ============================================
// PERCENTUALE ACCONTO
// ============================================
export const PAYMENT_CONFIG = {
  // Percentuale di acconto richiesta (0.5 = 50%)
  depositPercentage: 0.5,
  
  // Metodi di pagamento disponibili
  paymentMethods: {
    card: {
      enabled: true,
      label: 'Carta di Credito/Debito',
      description: 'Visa, Mastercard, American Express',
    },
    paypal: {
      enabled: true,
      label: 'PayPal',
      description: 'Paga in modo sicuro con PayPal',
    },
  },
};

// ============================================
// OPZIONI DOLCI - BASI
// ============================================
export const CAKE_BASES_CONFIG = [
  {
    value: 'pasta_sfoglia',
    label: 'Pasta Sfoglia',
    description: 'Croccante e leggera',
    // Puoi aggiungere un'immagine personalizzata qui
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  },
  {
    value: 'pasta_frolla',
    label: 'Pasta Frolla',
    description: 'Friabile e burrosa',
    imageUrl: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400',
  },
  {
    value: 'meringa',
    label: 'Meringa',
    description: 'Dolce e ariosa',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
  },
  {
    value: 'pan_di_spagna',
    label: 'Pan di Spagna',
    description: 'Soffice e classico',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400',
  },
];

// ============================================
// OPZIONI DOLCI - CREME
// ============================================
export const CAKE_CREAMS_CONFIG = [
  {
    value: 'chantilly',
    label: 'Chantilly',
    description: 'Crema leggera e delicata',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
  },
  {
    value: 'cioccolato',
    label: 'Cioccolato',
    description: 'Ricca e golosa',
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
  },
  {
    value: 'pistacchio',
    label: 'Pistacchio',
    description: 'Cremosa e aromatica',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
  },
  {
    value: 'nocciola',
    label: 'Nocciola',
    description: 'Intensa e vellutata',
    imageUrl: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=400',
  },
];

// ============================================
// TESTI INTERFACCIA
// ============================================
export const UI_TEXTS = {
  home: {
    createCakeTitle: 'Crea il Tuo Dolce',
    createCakeDescription: 'Personalizza base, crema, dimensione e dedica',
    productsTitle: 'Altri Prodotti',
    productsDescription: 'Scopri la nostra selezione di dolci artigianali',
    howItWorksTitle: 'Come Funziona',
    steps: [
      'Configura il tuo dolce personalizzato',
      'Aggiungi altri prodotti se desideri',
      'Paga il 50% come acconto alla conferma',
      'Ritira il tuo ordine in pasticceria',
    ],
  },
  
  customizeCake: {
    title: 'Personalizza il Tuo Dolce',
    chooseBase: 'Scegli la Base',
    chooseCream: 'Scegli la Crema',
    numberOfPeople: 'Numero di Persone',
    dedication: 'Dedica sul Dolce',
    dedicationPlaceholder: 'Es: Buon Compleanno Maria!',
    photo: 'Foto sul Dolce (Opzionale)',
    addPhoto: 'Aggiungi Foto',
    changePhoto: 'Cambia Foto',
    preview: 'Anteprima Dolce',
    priceLabel: 'Prezzo Dolce Personalizzato',
    continueButton: 'Continua con Altri Prodotti',
  },
  
  products: {
    title: 'Altri Prodotti',
    subtitle: 'Completa il tuo ordine con i nostri dolci artigianali',
    summaryTitle: 'Riepilogo Prodotti Aggiuntivi',
    totalLabel: 'Totale Prodotti',
    checkoutButton: 'Vai al Pagamento',
    skipButton: 'Salta e Vai al Pagamento',
  },
  
  checkout: {
    title: 'Conferma Ordine',
    orderSummary: 'Riepilogo Ordine',
    customCake: 'Dolce Personalizzato',
    additionalProducts: 'Prodotti Aggiuntivi',
    totalOrder: 'Totale Ordine',
    depositRequired: 'Acconto richiesto (50%)',
    remainingText: 'Rimanente da pagare al ritiro',
    paymentMethod: 'Metodo di Pagamento',
    confirmButton: 'Paga Acconto',
    securityInfo: 'Il pagamento è sicuro e protetto. Pagherai solo il 50% ora, il resto al ritiro del tuo ordine.',
  },
};

// ============================================
// COLORI TEMA (puoi personalizzare i colori dell'app)
// ============================================
export const THEME_COLORS = {
  // Colore di sfondo principale
  background: '#F8F8FF',
  
  // Colore del testo principale
  text: '#282828',
  
  // Colore del testo secondario
  textSecondary: '#585858',
  
  // Colore primario (bottoni principali, accenti)
  primary: '#E91E63',
  
  // Colore secondario
  secondary: '#9C27B0',
  
  // Colore accent
  accent: '#FF4081',
  
  // Colore delle card
  card: '#FFFFFF',
  
  // Colore highlight (evidenziazioni)
  highlight: '#FFD180',
};

// ============================================
// IMPOSTAZIONI DEDICA
// ============================================
export const DEDICATION_CONFIG = {
  // Numero massimo di caratteri per la dedica
  maxLength: 50,
  
  // Placeholder di esempio
  placeholder: 'Es: Buon Compleanno Maria!',
};

// ============================================
// IMPOSTAZIONI FOTO
// ============================================
export const PHOTO_CONFIG = {
  // Qualità dell'immagine (0-1, dove 1 è la massima qualità)
  quality: 0.8,
  
  // Aspect ratio per il crop [larghezza, altezza]
  aspectRatio: [4, 3],
  
  // Permetti editing dell'immagine
  allowsEditing: true,
};

// ============================================
// MESSAGGI DI ERRORE E SUCCESSO
// ============================================
export const MESSAGES = {
  errors: {
    permissionDenied: 'Permesso Negato',
    permissionDeniedDescription: 'È necessario il permesso per accedere alla galleria',
    incompleteConfiguration: 'Configurazione Incompleta',
    incompleteConfigurationDescription: 'Seleziona base e crema per continuare',
    selectPaymentMethod: 'Seleziona Metodo di Pagamento',
    selectPaymentMethodDescription: 'Scegli come vuoi pagare l\'acconto',
  },
  
  success: {
    paymentSimulated: 'Pagamento Simulato',
    paymentSimulatedDescription: 'Acconto pagato con successo!\n\nQuesto è un pagamento simulato. In produzione, qui si integrerebbe un sistema di pagamento reale come Stripe o PayPal.',
    orderConfirmed: 'Ordine Confermato! 🎉',
    orderConfirmedDescription: 'Il tuo ordine è stato confermato. Riceverai una notifica quando sarà pronto per il ritiro.',
    backToHome: 'Torna alla Home',
  },
};

// ============================================
// ESPORTA TUTTO
// ============================================
export default {
  PASTRY_INFO,
  CAKE_PRICING,
  PAYMENT_CONFIG,
  CAKE_BASES_CONFIG,
  CAKE_CREAMS_CONFIG,
  UI_TEXTS,
  THEME_COLORS,
  DEDICATION_CONFIG,
  PHOTO_CONFIG,
  MESSAGES,
};
