
# Configurazione Supabase per Pasticceria Due Mondi

Questa app richiede Supabase per gestire l'autenticazione degli utenti, il database dei clienti e gli ordini.

## Setup Iniziale

### 1. Crea un Progetto Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Crea un account o accedi
3. Crea un nuovo progetto
4. Annota l'URL del progetto e la chiave ANON KEY

### 2. Configura le Variabili d'Ambiente

Crea un file `.env` nella root del progetto con:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Crea le Tabelle nel Database

Vai su SQL Editor in Supabase ed esegui questi comandi:

```sql
-- Tabella Clienti
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Ordini
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  order_data JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_time TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_pickup_date ON orders(pickup_date);

-- Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy per customers: gli utenti possono vedere solo i propri dati
CREATE POLICY "Users can view own customer data"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customer data"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customer data"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy per orders: gli utenti possono vedere solo i propri ordini
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Admin può vedere tutto (sostituisci con la tua email admin)
CREATE POLICY "Admin can view all customers"
  ON customers FOR SELECT
  USING (auth.jwt() ->> 'email' = 'admin@duemondi.com');

CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING (auth.jwt() ->> 'email' = 'admin@duemondi.com');

CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  USING (auth.jwt() ->> 'email' = 'admin@duemondi.com');
```

### 4. Configura l'Autenticazione

1. Vai su Authentication > Settings in Supabase
2. Abilita "Email" come provider
3. Disabilita "Confirm email" se vuoi che gli utenti possano accedere subito dopo la registrazione
4. Configura le email templates se necessario

### 5. Crea l'Account Admin

1. Vai su Authentication > Users
2. Crea un nuovo utente con email: `admin@duemondi.com`
3. Imposta una password sicura
4. Questo account avrà accesso al pannello admin

## Funzionalità Implementate

### Autenticazione
- Login obbligatorio all'apertura dell'app
- Registrazione nuovi utenti con: nome, cognome, email, telefono
- Gestione sessioni con AsyncStorage

### Database Clienti
- Anagrafica completa di tutti i clienti registrati
- Storico ordini per ogni cliente
- Dati di contatto (email, telefono)

### Gestione Ordini
- Salvataggio automatico degli ordini nel database
- Stati ordini: pending (in attesa), completed (evaso), cancelled (annullato)
- Note personalizzate per ogni ordine
- Data e ora di ritiro

### Pannello Admin
- Accessibile solo all'utente admin
- Visualizzazione di tutti i clienti registrati
- Lista ordini in attesa
- Lista ordini evasi
- Possibilità di segnare ordini come evasi

### Notifiche Email
- Invio automatico email a duemondi87@gmail.com per ogni nuovo ordine
- Dettagli completi dell'ordine nell'email
- Informazioni cliente incluse

## Note Importanti

- **Sicurezza**: Le Row Level Security (RLS) policies garantiscono che ogni utente possa vedere solo i propri dati
- **Admin**: Solo l'utente con email `admin@duemondi.com` può accedere al pannello admin
- **Email**: Le email vengono inviate tramite expo-mail-composer, che apre il client email del dispositivo
- **Offline**: L'app funziona anche senza Supabase, ma senza autenticazione e salvataggio ordini

## Troubleshooting

### L'app non si connette a Supabase
- Verifica che le variabili d'ambiente siano configurate correttamente
- Controlla che l'URL e la chiave ANON KEY siano corretti
- Riavvia il server Expo dopo aver modificato il file .env

### Gli utenti non riescono a registrarsi
- Verifica che l'autenticazione email sia abilitata in Supabase
- Controlla le policy RLS nella tabella customers
- Verifica i log in Supabase Dashboard

### Il pannello admin non è accessibile
- Verifica che l'email admin sia corretta in `contexts/AuthContext.tsx`
- Controlla che l'utente admin esista in Supabase
- Verifica le policy RLS per l'admin

## Supporto

Per problemi o domande, contatta lo sviluppatore o consulta la documentazione di Supabase: https://supabase.com/docs
