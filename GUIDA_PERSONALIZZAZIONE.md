
# 📱 Guida alla Personalizzazione dell'App Pasticceria

Benvenuto! Questa guida ti aiuterà a personalizzare l'app con le tue foto, i tuoi prodotti e le tue impostazioni.

## 📋 Indice

- [1. Configurazione Generale](#1-configurazione-generale)
- [2. Personalizzare i Prodotti](#2-personalizzare-i-prodotti)
- [3. Aggiungere le Tue Foto](#3-aggiungere-le-tue-foto)
- [4. Personalizzare i Colori](#4-personalizzare-i-colori)
- [5. Modificare i Prezzi](#5-modificare-i-prezzi)
- [6. Personalizzare i Testi](#6-personalizzare-i-testi)

---

## 1. Configurazione Generale

### File Principale: `config/appConfig.ts`

Questo è il file più importante per la personalizzazione. Contiene tutte le impostazioni dell'app.

### Informazioni Pasticceria

Apri `config/appConfig.ts` e modifica la sezione `PASTRY_INFO`:

```typescript
export const PASTRY_INFO = {
  name: 'Il Tuo Nome Pasticceria',  // Cambia qui
  emoji: '🧁',                        // Cambia l'emoji se vuoi
  welcomeTitle: 'Benvenuto!',
  welcomeSubtitle: 'Il tuo messaggio personalizzato',
  
  // Aggiungi i tuoi contatti
  phone: '+39 123 456 7890',
  email: 'tuaemail@pasticceria.it',
  address: 'Via Tua 123, 00100 Città',
  
  openingHours: {
    weekdays: '8:00 - 20:00',
    saturday: '8:00 - 21:00',
    sunday: '9:00 - 13:00',
  },
};
```

---

## 2. Personalizzare i Prodotti

### File: `data/products.ts`

Qui puoi modificare, aggiungere o rimuovere prodotti.

### Modificare un Prodotto Esistente

```typescript
{
  id: '1',                    // NON modificare l'ID
  name: 'Cannoli Siciliani',  // Cambia il nome
  description: 'La tua descrizione',
  price: 3.5,                 // Cambia il prezzo
  imageUrl: 'URL_TUA_FOTO',   // Vedi sezione foto
}
```

### Aggiungere un Nuovo Prodotto

Copia questo template alla fine dell'array `ADDITIONAL_PRODUCTS`:

```typescript
{
  id: '7',  // Incrementa il numero
  name: 'Nome Nuovo Prodotto',
  description: 'Descrizione del prodotto',
  price: 10.0,
  imageUrl: 'https://tuosito.com/foto.jpg',
},
```

### Rimuovere un Prodotto

Elimina semplicemente l'intero blocco del prodotto dall'array.

---

## 3. Aggiungere le Tue Foto

### Opzione 1: Usare Unsplash (Gratuito)

1. Vai su [Unsplash.com](https://unsplash.com)
2. Cerca l'immagine che ti serve
3. Clicca sull'immagine
4. Copia l'URL e aggiungi `?w=400` alla fine
5. Esempio: `https://images.unsplash.com/photo-123456?w=400`

### Opzione 2: Usare Imgur (Consigliato per le Tue Foto)

1. Vai su [Imgur.com](https://imgur.com)
2. Carica la tua foto
3. Clicca con il tasto destro sull'immagine caricata
4. Seleziona "Copia indirizzo immagine"
5. Usa questo URL nel campo `imageUrl`

### Opzione 3: Usare il Tuo Server

Se hai un sito web o un server:

1. Carica le foto sul tuo server
2. Usa l'URL diretto: `https://tuosito.com/immagini/prodotto.jpg`

### Dove Cambiare le Foto

#### Foto Prodotti

File: `data/products.ts`

```typescript
imageUrl: 'https://imgur.com/abc123.jpg',  // Sostituisci qui
```

#### Foto Basi e Creme

File: `config/appConfig.ts`

Sezioni `CAKE_BASES_CONFIG` e `CAKE_CREAMS_CONFIG`:

```typescript
{
  value: 'pasta_sfoglia',
  label: 'Pasta Sfoglia',
  description: 'Croccante e leggera',
  imageUrl: 'URL_TUA_FOTO',  // Cambia qui
}
```

---

## 4. Personalizzare i Colori

### File: `config/appConfig.ts`

Sezione `THEME_COLORS`:

```typescript
export const THEME_COLORS = {
  background: '#F8F8FF',    // Sfondo app
  text: '#282828',          // Testo principale
  textSecondary: '#585858', // Testo secondario
  primary: '#E91E63',       // Colore principale (bottoni)
  secondary: '#9C27B0',     // Colore secondario
  accent: '#FF4081',        // Accenti
  card: '#FFFFFF',          // Sfondo card
  highlight: '#FFD180',     // Evidenziazioni
};
```

### Come Scegliere i Colori

1. Usa un color picker online: [Coolors.co](https://coolors.co)
2. I colori sono in formato HEX (es: #E91E63)
3. Assicurati che ci sia buon contrasto tra testo e sfondo

### Esempi di Palette

**Palette Rosa/Viola (Attuale):**
- Primary: #E91E63 (Rosa)
- Secondary: #9C27B0 (Viola)

**Palette Blu/Azzurro:**
- Primary: #2196F3 (Blu)
- Secondary: #03A9F4 (Azzurro)

**Palette Verde/Lime:**
- Primary: #4CAF50 (Verde)
- Secondary: #8BC34A (Lime)

---

## 5. Modificare i Prezzi

### File: `config/appConfig.ts`

Sezione `CAKE_PRICING`:

```typescript
export const CAKE_PRICING = {
  basePrice: 25,              // Prezzo base dolce (€)
  pricePerHundredGrams: 3.5,  // Prezzo per 100g (€)
  gramsPerPerson: 140,        // Grammi per persona
  minPeople: 1,               // Minimo persone
  maxPeople: 50,              // Massimo persone
  defaultPeople: 4,           // Numero predefinito
};
```

### Percentuale Acconto

Sezione `PAYMENT_CONFIG`:

```typescript
export const PAYMENT_CONFIG = {
  depositPercentage: 0.5,  // 0.5 = 50%, 0.3 = 30%, ecc.
  // ...
};
```

---

## 6. Personalizzare i Testi

### File: `config/appConfig.ts`

Sezione `UI_TEXTS`:

Qui puoi modificare tutti i testi dell'interfaccia:

```typescript
export const UI_TEXTS = {
  home: {
    createCakeTitle: 'Crea il Tuo Dolce',
    createCakeDescription: 'Personalizza base, crema...',
    // ... altri testi
  },
  customizeCake: {
    title: 'Personalizza il Tuo Dolce',
    // ... altri testi
  },
  // ... altre sezioni
};
```

### Messaggi di Errore e Successo

Sezione `MESSAGES`:

```typescript
export const MESSAGES = {
  errors: {
    permissionDenied: 'Permesso Negato',
    // ... altri messaggi
  },
  success: {
    orderConfirmed: 'Ordine Confermato! 🎉',
    // ... altri messaggi
  },
};
```

---

## 🎯 Checklist Personalizzazione

Usa questa checklist per assicurarti di aver personalizzato tutto:

### Informazioni Base
- [ ] Nome pasticceria
- [ ] Emoji/icona
- [ ] Messaggio di benvenuto
- [ ] Telefono
- [ ] Email
- [ ] Indirizzo
- [ ] Orari di apertura

### Prodotti
- [ ] Modificati nomi prodotti
- [ ] Modificati prezzi prodotti
- [ ] Modificate descrizioni
- [ ] Aggiunte foto prodotti
- [ ] Aggiunti/rimossi prodotti

### Dolci Personalizzati
- [ ] Modificate opzioni basi
- [ ] Modificate opzioni creme
- [ ] Modificato prezzo base
- [ ] Modificato prezzo per 100g
- [ ] Modificati grammi per persona

### Aspetto
- [ ] Modificati colori tema
- [ ] Testato contrasto colori
- [ ] Verificato su iOS e Android

### Pagamenti
- [ ] Modificata percentuale acconto
- [ ] Configurati metodi di pagamento

### Testi
- [ ] Personalizzati testi interfaccia
- [ ] Personalizzati messaggi errore
- [ ] Personalizzati messaggi successo

---

## 🐛 Risoluzione Problemi

### Le immagini non si caricano

1. Verifica che l'URL sia corretto
2. Assicurati che l'URL inizi con `https://`
3. Prova ad aprire l'URL nel browser
4. Usa immagini in formato JPG o PNG

### I colori non cambiano

1. Verifica di aver modificato `config/appConfig.ts`
2. Riavvia l'app completamente
3. Controlla che i colori siano in formato HEX (#RRGGBB)

### I prezzi non si aggiornano

1. Verifica di aver modificato `CAKE_PRICING` in `config/appConfig.ts`
2. Controlla che i numeri siano senza virgolette
3. Usa il punto per i decimali (es: 3.5, non 3,5)

---

## 📞 Supporto

Se hai bisogno di aiuto:

1. Controlla questa guida
2. Verifica di aver salvato tutti i file
3. Riavvia l'app
4. Controlla la console per eventuali errori

---

## 🚀 Prossimi Passi

Dopo aver personalizzato l'app:

1. **Testa tutto**: Prova tutte le funzionalità
2. **Verifica le foto**: Assicurati che tutte le immagini si carichino
3. **Controlla i prezzi**: Verifica che i calcoli siano corretti
4. **Test su dispositivi**: Prova su iOS e Android
5. **Integra pagamenti reali**: Quando sei pronto, integra Stripe o PayPal

---

## 📝 Note Importanti

- **Non modificare gli ID dei prodotti** dopo averli creati
- **Fai backup** prima di modifiche importanti
- **Testa sempre** dopo ogni modifica
- **Usa immagini ottimizzate** (max 500KB per foto)
- **Mantieni i colori accessibili** (buon contrasto)

---

Buona personalizzazione! 🎉
