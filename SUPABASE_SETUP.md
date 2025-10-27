
# Configurazione Supabase - Pasticceria Due Mondi

## ✅ Setup Completato

Il database Supabase è stato configurato con successo per la tua applicazione di pasticceria!

## 📊 Struttura Database

### Tabelle Create

#### 1. **customers** (Clienti)
Memorizza le informazioni dei clienti registrati.

**Campi:**
- `id` (UUID) - ID univoco del cliente
- `user_id` (UUID) - Riferimento all'utente Supabase Auth
- `first_name` (TEXT) - Nome
- `last_name` (TEXT) - Cognome
- `email` (TEXT) - Email
- `phone` (TEXT) - Numero di telefono
- `created_at` (TIMESTAMPTZ) - Data di registrazione
- `updated_at` (TIMESTAMPTZ) - Data ultimo aggiornamento

#### 2. **orders** (Ordini)
Memorizza tutti gli ordini effettuati dai clienti.

**Campi:**
- `id` (UUID) - ID univoco dell'ordine
- `customer_id` (UUID) - Riferimento al cliente
- `order_data` (JSONB) - Dati completi dell'ordine (dolce, prodotti, ecc.)
- `total_amount` (DECIMAL) - Importo totale
- `deposit_amount` (DECIMAL) - Acconto pagato (50%)
- `status` (TEXT) - Stato: 'pending', 'completed', 'cancelled'
- `pickup_date` (TIMESTAMPTZ) - Data di ritiro
- `pickup_time` (TEXT) - Ora di ritiro
- `notes` (TEXT) - Note del cliente
- `created_at` (TIMESTAMPTZ) - Data creazione ordine
- `updated_at` (TIMESTAMPTZ) - Data ultimo aggiornamento

## 🔒 Sicurezza (RLS Policies)

### Policies per `customers`:
- ✅ Gli utenti possono vedere solo il proprio profilo
- ✅ Gli utenti possono creare il proprio profilo
- ✅ Gli utenti possono aggiornare il proprio profilo
- ✅ L'admin (duemondi87@gmail.com) può vedere tutti i clienti

### Policies per `orders`:
- ✅ Gli utenti possono vedere solo i propri ordini
- ✅ Gli utenti possono creare i propri ordini
- ✅ L'admin (duemondi87@gmail.com) può vedere tutti gli ordini
- ✅ L'admin (duemondi87@gmail.com) può aggiornare tutti gli ordini

## 👤 Account Admin

**Email Admin:** duemondi87@gmail.com

Per accedere al pannello admin:
1. Registrati con l'email: duemondi87@gmail.com
2. Verifica l'email cliccando sul link ricevuto
3. Accedi all'app
4. Vai alla tab "Admin" per gestire clienti e ordini

## 🔧 Funzionalità Implementate

### ✅ Autenticazione
- Registrazione utenti con email e password
- Verifica email obbligatoria
- Login con credenziali
- Logout
- Protezione delle route (redirect automatico al login)

### ✅ Gestione Ordini
- Salvataggio ordini nel database
- Calcolo automatico prezzi (base + foto + extra)
- Prezzo foto: 4€ (6-12 persone), 8€ (12+ persone)
- Note personalizzate per ogni ordine
- Data e ora di ritiro con validazione (minimo 24h)
- Email di notifica a duemondi87@gmail.com

### ✅ Pannello Admin
- Visualizzazione tutti i clienti registrati
- Visualizzazione ordini in attesa
- Visualizzazione ordini evasi
- Possibilità di segnare ordini come completati
- Dettagli completi di ogni ordine

## 📱 Flusso Utente

### Per i Clienti:
1. **Registrazione/Login** → Obbligatorio per usare l'app
2. **Personalizza Dolce** → Scegli base, crema, persone, dedica, foto
3. **Aggiungi Prodotti** → Candeline, contenitori, ecc.
4. **Checkout** → Seleziona data/ora ritiro, aggiungi note
5. **Pagamento** → Paga il 50% di acconto (simulato)
6. **Conferma** → Ricevi conferma e email

### Per l'Admin:
1. **Login** con duemondi87@gmail.com
2. **Tab Admin** → Accesso al pannello di gestione
3. **Visualizza Clienti** → Anagrafica completa
4. **Gestisci Ordini** → Ordini in attesa e completati
5. **Segna Evasi** → Aggiorna stato ordini

## 🐛 Bug Corretti

### ✅ Database
- Creazione tabelle `customers` e `orders`
- Implementazione RLS policies complete
- Indici per performance ottimali
- Trigger per aggiornamento automatico `updated_at`

### ✅ Autenticazione
- Aggiunta verifica email con `emailRedirectTo`
- Migliorato error handling con messaggi specifici
- Corretta email admin (duemondi87@gmail.com)
- Validazione form migliorata

### ✅ Ordini
- Salvataggio corretto nel database con `.select()`
- Gestione note ordine
- Calcolo prezzo foto corretto (4€/8€ in base a persone)
- Email di notifica con dettagli completi

### ✅ UI/UX
- Messaggi di errore più chiari
- Loading states durante operazioni
- Validazione data/ora ritiro (minimo 24h)
- Conferma prima di segnare ordini come evasi

## 🔑 Variabili d'Ambiente

Assicurati di avere queste variabili configurate:

```env
EXPO_PUBLIC_SUPABASE_URL=https://wygucqfuakuxvukyupzb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## 📧 Email di Notifica

Ogni ordine invia automaticamente un'email a **duemondi87@gmail.com** con:
- Dettagli cliente (nome, email, telefono)
- Dettagli dolce (base, crema, persone, dedica, foto)
- Prodotti aggiuntivi
- Note del cliente
- Data e ora di ritiro
- Totali (importo totale, acconto, rimanente)

## 🎯 Prossimi Passi

1. **Testa la Registrazione:**
   - Registra un nuovo utente
   - Verifica l'email
   - Effettua il login

2. **Testa un Ordine:**
   - Crea un dolce personalizzato
   - Aggiungi prodotti
   - Completa il checkout
   - Verifica che l'ordine appaia nel database

3. **Testa il Pannello Admin:**
   - Registra l'account admin (duemondi87@gmail.com)
   - Accedi al pannello admin
   - Visualizza clienti e ordini
   - Segna un ordine come evaso

## 🆘 Troubleshooting

### Problema: "Supabase Non Configurato"
**Soluzione:** Verifica che le variabili d'ambiente siano configurate correttamente.

### Problema: "Email not confirmed"
**Soluzione:** Clicca sul link di verifica nell'email ricevuta dopo la registrazione.

### Problema: "Impossibile salvare l'ordine"
**Soluzione:** Verifica di essere loggato e che il cliente sia registrato nel database.

### Problema: "Accesso Negato al Pannello Admin"
**Soluzione:** Assicurati di essere loggato con l'email duemondi87@gmail.com.

## 📞 Supporto

Per problemi o domande, contatta:
- Email: duemondi87@gmail.com
- Telefono: 3479200940

---

**Stato:** ✅ Completamente Configurato e Funzionante
**Data:** 2025
**Versione:** 1.0
