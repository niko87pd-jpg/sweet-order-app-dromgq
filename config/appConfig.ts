
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
  name: 'Pasticceria Due Mondi',
  
  // Emoji o icona principale (apparirà nella home)
  emoji: '🧁',
  
  // Logo della pasticceria (percorso al file immagine)
  logo: require('@/assets/images/b27037d7-641b-4c48-9b18-7bf63e20cb9f.jpeg'),
  
  // Messaggio di benvenuto
  welcomeTitle: 'Benvenuto!',
  welcomeSubtitle: 'Crea il tuo dolce personalizzato o scegli dai nostri prodotti',
  
  // Informazioni di contatto
  phone: '3479200940',
  email: 'pasticceriaduemondi87@gmail.com',
  address: 'Via Mattei 20, Maserà di Padova (PD)',
  
  // Orari di apertura
  openingHours: {
    weekdays: '7:00 - 13:00 / 15:30 - 19:30',
    saturday: '7:00 - 13:00 / 15:30 - 19:30',
    sunday: '7:00 - 13:00',
  },
};

// ============================================
// PREZZI E CALCOLI DOLCI
// ============================================
export const CAKE_PRICING = {
  // Prezzo base del dolce (€)
  basePrice: 0,
  
  // Prezzo per kg (€)
  pricePerKg: 25,
  
  // Prezzo per 100g (€) - calcolato automaticamente da pricePerKg
  pricePerHundredGrams: 2.5,
  
  // Grammi per persona (standard: 140g)
  gramsPerPerson: 140,
  
  // Numero minimo di persone
  minPeople: 6,
  
  // Numero massimo di persone
  maxPeople: 50,
  
  // Numero predefinito di persone
  defaultPeople: 6,
  
  // Sovraprezzo per foto sul dolce (€) - 4€ per 6-12 persone, 8€ per 12+ persone
  photoSurcharge: 4, // Base price for 6-12 people
  photoSurchargeOver12: 8, // Price for 12+ people
  
  // Sovraprezzo per due creme diverse (€)
  differentCreamsSurcharge: 3,
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
  {
    value: 'pan_di_spagna_cioccolato',
    label: 'Pan di Spagna al Cioccolato',
    description: 'Soffice e goloso',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
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
// OPZIONI DOLCI - RIPIENI PER MERINGA
// ============================================
export const MERINGA_FILLINGS_CONFIG = [
  {
    value: 'frutta',
    label: 'Frutta',
    description: 'Fresca e leggera',
  },
  {
    value: 'panna_e_cioccolato',
    label: 'Panna e Cioccolato',
    description: 'Classica e golosa',
  },
  {
    value: 'fragole_e_gocce_cioccolato',
    label: 'Fragole e Gocce di Cioccolato',
    description: 'Dolce e croccante',
  },
  {
    value: 'limone',
    label: 'Limone',
    description: 'Fresco e agrumato',
  },
];

// ============================================
// OPZIONI DOLCI - CONDIMENTO
// ============================================
export const CAKE_CONDIMENTO_CONFIG = [
  {
    value: 'nessuno',
    label: 'Nessun Condimento',
    description: 'Senza condimento',
    price: 0,
  },
  {
    value: 'frutta_mista',
    label: 'Frutta Mista',
    description: 'Frutta fresca di stagione',
    price: 0,
  },
  {
    value: 'fragole',
    label: 'Fragole',
    description: 'Fragole fresche',
    price: 0,
  },
  {
    value: 'gocce_cioccolato',
    label: 'Gocce di Cioccolato',
    description: 'Gocce di cioccolato fondente',
    price: 0,
  },
  {
    value: 'granella_nocciole',
    label: 'Granella di Nocciole',
    description: 'Nocciole tostate e tritate',
    price: 0,
  },
  {
    value: 'granella_pistacchio',
    label: 'Granella di Pistacchio',
    description: 'Pistacchi tritati',
    price: 0,
  },
  {
    value: 'scagliette_cioccolato_bianco',
    label: 'Scagliette Cioccolato Bianco',
    description: 'Scaglie di cioccolato bianco',
    price: 0,
  },
];

// ============================================
// OPZIONI DOLCI - VARIEGATURA CON CREME SPALMABILI
// ============================================
export const CAKE_VARIEGATURA_CONFIG = [
  {
    value: 'nessuna',
    label: 'Nessuna Variegatura',
    description: 'Senza variegatura',
    price: 0,
  },
  {
    value: 'cioccolato',
    label: 'Cioccolato',
    description: 'Crema spalmabile al cioccolato',
    price: 3,
  },
  {
    value: 'cioccolato_bianco',
    label: 'Cioccolato Bianco',
    description: 'Crema spalmabile al cioccolato bianco',
    price: 3,
  },
  {
    value: 'pistacchio',
    label: 'Pistacchio',
    description: 'Crema spalmabile al pistacchio',
    price: 3,
  },
];

// ============================================
// OPZIONI DOLCI - FINITURA
// ============================================
export const CAKE_FINITURA_CONFIG = [
  {
    value: 'panna_normale',
    label: 'Panna Normale',
    description: 'Compreso nel prezzo',
    price: 0,
    color: null,
  },
  {
    value: 'panna_rosa',
    label: 'Panna Colorata - Rosa',
    description: '+3€',
    price: 3,
    color: '#FFB6C1',
  },
  {
    value: 'panna_gialla',
    label: 'Panna Colorata - Gialla',
    description: '+3€',
    price: 3,
    color: '#FFD700',
  },
  {
    value: 'panna_verde',
    label: 'Panna Colorata - Verde',
    description: '+3€',
    price: 3,
    color: '#90EE90',
  },
  {
    value: 'panna_azzurra',
    label: 'Panna Colorata - Azzurra',
    description: '+3€',
    price: 3,
    color: '#87CEEB',
  },
  {
    value: 'panna_lilla',
    label: 'Panna Colorata - Lilla',
    description: '+3€',
    price: 3,
    color: '#DDA0DD',
  },
  {
    value: 'panna_arancione',
    label: 'Panna Colorata - Arancione',
    description: '+3€',
    price: 3,
    color: '#FFA500',
  },
  {
    value: 'panna_viola',
    label: 'Panna Colorata - Viola',
    description: '+3€',
    price: 3,
    color: '#9370DB',
  },
  {
    value: 'panna_cioccolato',
    label: 'Panna al Cioccolato',
    description: '+3€',
    price: 3,
    color: '#8B4513',
  },
];

// ============================================
// OPZIONI DOLCI - SENZA LATTOSIO
// ============================================
export const CAKE_LACTOSE_FREE_CONFIG = [
  {
    value: 'con_lattosio',
    label: 'Con Lattosio',
    description: 'Normale',
    price: 0,
  },
  {
    value: 'senza_lattosio',
    label: 'Opzione Crema Senza Lattosio',
    description: '+10€',
    price: 10,
  },
];

// ============================================
// DOLCI CLASSICI
// ============================================
export const CLASSIC_CAKES_CONFIG = [
  {
    value: 'millefoglie',
    label: 'Millefoglie',
    description: 'Sfoglia croccante con crema chantilly e gocce di cioccolato rifinito con panna montata.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  },
  {
    value: 'dolce_del_re',
    label: 'Dolce del Re',
    description: 'Pan di spagna morbido con crema chantilly e frutta fresca, rifinito con panna montata.',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400',
  },
  {
    value: 'dolce_alle_creme',
    label: 'Dolce alle Creme',
    description: 'Pan di spagna morbido con crema chantilly e crema al cioccolato, rifinito con panna montata.',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
  },
  {
    value: 'tiramisu',
    label: 'Tiramisù',
    description: 'Pan di spagna bagnato con bagna analcolica al caffè e farcito con crema al mascarpone, rifinito con panna montata e una spolverata di cacao.',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
  },
  {
    value: 'dolce_al_limone',
    label: 'Dolce al Limone',
    description: 'Pan di spagna morbido farcito con crema al limone e rifinito con panna montata.',
    imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400',
  },
  {
    value: 'dolce_ai_frutti_di_bosco',
    label: 'Dolce ai Frutti di Bosco',
    description: 'Pan di spagna morbido farcito con crema ai frutti di bosco e rifinito con panna montata e glassa alla fragola.',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
  },
  {
    value: 'dolce_al_pistacchio',
    label: 'Dolce al Pistacchio',
    description: 'Pan di spagna morbido al cioccolato con farcitura crema molto leggera al pistacchio, rifinito con panna montata e granella di pistacchi.',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
  },
  {
    value: 'crostata_di_frutta',
    label: 'Crostata alla Frutta',
    description: 'Base di pasta frolla con crema chantilly e frutta fresca, rifinito con un velo di gelatina di albicocca.',
    imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400',
  },
  {
    value: 'crostata_al_cioccolato',
    label: 'Crostata al Cioccolato',
    description: 'Base di pasta frolla con cioccolata spalmabile pre cottura.',
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
  },
  {
    value: 'sant_honore',
    label: 'Sant&apos;Honoré',
    description: 'Base pasta sfoglia, crema chantilly, pan di spagna bagnato al marsala, gocce di cioccolato, rifinito con panna montata e bignè alla crema.',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400',
  },
  {
    value: 'meringata_alla_frutta',
    label: 'Meringa alla Frutta',
    description: 'Base meringa con una crema leggerissima e frutta, rifinito con panna montata e frutta.',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
  },
  {
    value: 'meringata_al_cioccolato',
    label: 'Meringata al Cioccolato',
    description: 'Base meringa con crema leggerissima 1 strato bianca e uno al cioccolato, rifinita con panna montata e panna al cioccolato.',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
  },
];

// ============================================
// TESTI INTERFACCIA
// ============================================
export const UI_TEXTS = {
  home: {
    createCakeTitle: 'Crea il Tuo Dolce',
    createCakeDescription: 'Personalizza base, crema, dimensione e dedica',
    chooseCakeTitle: 'Scegli il Tuo Dolce',
    chooseCakeDescription: 'Scopri i nostri dolci classici già composti',
    productsTitle: 'Altri Prodotti',
    productsDescription: 'Candeline, contenitori termici e accessori',
    howItWorksTitle: 'Come Funziona',
    steps: [
      'Configura il tuo dolce personalizzato o scegli un dolce classico',
      'Aggiungi altri prodotti se desideri',
      'Paga il 50% come acconto alla conferma',
      'Ritira il tuo ordine in pasticceria',
    ],
  },
  
  customizeCake: {
    title: 'Personalizza il Tuo Dolce',
    chooseBase: 'Scegli la Base',
    chooseCream: 'Scegli la Crema',
    chooseMeringaFilling: 'Scegli il Ripieno per Meringa',
    chooseCondimento: 'Condimento',
    chooseVariegatura: 'Variegatura con Creme Spalmabili',
    chooseFinitura: 'Finitura',
    chooseLactoseFree: 'Opzione Crema Senza Lattosio',
    numberOfPeople: 'Numero di Persone',
    dedication: 'Dedica sul Dolce',
    dedicationPlaceholder: 'Es: Buon Compleanno Maria!',
    photo: 'Foto sul Dolce (+8€)',
    addPhoto: 'Aggiungi Foto',
    changePhoto: 'Cambia Foto',
    preview: 'Riepilogo Dolce',
    priceLabel: 'Prezzo Dolce Personalizzato',
    continueButton: 'Continua con Altri Prodotti',
    firstLayer: 'Primo Strato',
    secondLayer: 'Secondo Strato',
  },

  classicCake: {
    title: 'Scegli il Tuo Dolce',
    selectCake: 'Seleziona un Dolce Classico',
    numberOfPeople: 'Numero di Persone',
    dedication: 'Dedica sul Dolce',
    dedicationPlaceholder: 'Es: Buon Compleanno Maria!',
    photo: 'Foto sul Dolce (+8€)',
    addPhoto: 'Aggiungi Foto',
    changePhoto: 'Cambia Foto',
    preview: 'Riepilogo Dolce',
    priceLabel: 'Prezzo Dolce',
    continueButton: 'Continua con Altri Prodotti',
  },
  
  products: {
    title: 'Altri Prodotti',
    subtitle: 'Completa il tuo ordine con i nostri prodotti',
    summaryTitle: 'Riepilogo Prodotti Aggiuntivi',
    totalLabel: 'Totale Prodotti',
    checkoutButton: 'Vai al Pagamento',
    skipButton: 'Salta e Vai al Pagamento',
  },
  
  checkout: {
    title: 'Conferma Ordine',
    orderSummary: 'Riepilogo Ordine',
    customCake: 'Dolce Personalizzato',
    classicCake: 'Dolce Classico',
    additionalProducts: 'Prodotti Aggiuntivi',
    totalOrder: 'Totale Ordine',
    depositRequired: 'Acconto richiesto (50%)',
    remainingText: 'Rimanente da pagare al ritiro',
    paymentMethod: 'Metodo di Pagamento',
    confirmButton: 'Paga Acconto',
    securityInfo: 'Il pagamento è sicuro e protetto. Pagherai solo il 50% ora, il resto al ritiro del tuo ordine.',
    pickupDateTime: 'Data e Ora di Ritiro',
    selectDate: 'Seleziona Data',
    selectTime: 'Seleziona Orario',
    minimumNotice: 'Prenotazione minima 24 ore prima del ritiro',
  },

  auth: {
    loginTitle: 'Accedi',
    registerTitle: 'Registrati',
    firstName: 'Nome',
    lastName: 'Cognome',
    email: 'Email',
    phone: 'Numero di Telefono',
    loginButton: 'Accedi',
    registerButton: 'Registrati',
    switchToRegister: 'Non hai un account? Registrati',
    switchToLogin: 'Hai già un account? Accedi',
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
    incompleteConfigurationDescription: 'Seleziona base e crema/ripieno per continuare',
    incompleteClassicCakeConfiguration: 'Seleziona un dolce e il numero di persone per continuare',
    selectPaymentMethod: 'Seleziona Metodo di Pagamento',
    selectPaymentMethodDescription: 'Scegli come vuoi pagare l\'acconto',
    selectPickupDateTime: 'Seleziona Data e Ora',
    selectPickupDateTimeDescription: 'Scegli quando vuoi ritirare il tuo ordine',
    minimumNoticeRequired: 'Prenotazione Anticipata Richiesta',
    minimumNoticeRequiredDescription: 'Il ritiro deve essere prenotato con almeno 24 ore di anticipo',
  },
  
  success: {
    paymentSimulated: 'Pagamento Simulato',
    paymentSimulatedDescription: 'Acconto pagato con successo!\n\nQuesto è un pagamento simulato. In produzione, qui si integrerebbe un sistema di pagamento reale come Stripe o PayPal.',
    orderConfirmed: 'Ordine Confermato! 🎉',
    orderConfirmedDescription: 'Il tuo ordine è stato confermato. Riceverai una notifica quando sarà pronto per il ritiro.',
    backToHome: 'Torna alla Home',
    registrationSuccess: 'Registrazione Completata',
    registrationSuccessDescription: 'Il tuo account è stato creato con successo!',
  },

  warnings: {
    lactoseFreeWarning: 'Attenzione',
    lactoseFreeWarningDescription: 'Pan di spagna, sfoglia e crostata contengono tracce di latte poi cucinati in forno.',
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
  MERINGA_FILLINGS_CONFIG,
  CAKE_CONDIMENTO_CONFIG,
  CAKE_VARIEGATURA_CONFIG,
  CAKE_FINITURA_CONFIG,
  CAKE_LACTOSE_FREE_CONFIG,
  CLASSIC_CAKES_CONFIG,
  UI_TEXTS,
  THEME_COLORS,
  DEDICATION_CONFIG,
  PHOTO_CONFIG,
  MESSAGES,
};
