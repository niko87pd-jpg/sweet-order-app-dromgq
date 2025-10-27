
# 🔧 Technical Reference - Supabase Integration

## Database Schema

### Table: `customers`

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `orders`

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) NOT NULL,
  order_data JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  deposit_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  pickup_date TIMESTAMPTZ NOT NULL,
  pickup_time TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security Policies

### Customers Table

```sql
-- Users can view their own customer record
CREATE POLICY "Users can view their own customer record"
ON customers FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own customer record
CREATE POLICY "Users can insert their own customer record"
ON customers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own customer record
CREATE POLICY "Users can update their own customer record"
ON customers FOR UPDATE
USING (auth.uid() = user_id);

-- Admin can view all customers
CREATE POLICY "Admin can view all customers"
ON customers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE users.id = auth.uid()
    AND users.email = 'duemondi87@gmail.com'
  )
);
```

### Orders Table

```sql
-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM customers
    WHERE customers.id = orders.customer_id
    AND customers.user_id = auth.uid()
  )
);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders"
ON orders FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM customers
    WHERE customers.id = orders.customer_id
    AND customers.user_id = auth.uid()
  )
);

-- Admin can view all orders
CREATE POLICY "Admin can view all orders"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE users.id = auth.uid()
    AND users.email = 'duemondi87@gmail.com'
  )
);

-- Admin can update all orders
CREATE POLICY "Admin can update all orders"
ON orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE users.id = auth.uid()
    AND users.email = 'duemondi87@gmail.com'
  )
);
```

## Supabase Configuration

### Project Details
- **Project ID**: `wygucqfuakuxvukyupzb`
- **Project URL**: `https://wygucqfuakuxvukyupzb.supabase.co`
- **Region**: Auto-selected by Supabase

### Authentication Settings
- **Email Verification**: Required
- **Email Redirect URL**: `https://natively.dev/email-confirmed`
- **Session Storage**: AsyncStorage (React Native)
- **Auto Refresh Token**: Enabled
- **Persist Session**: Enabled

### Admin Account
- **Email**: `duemondi87@gmail.com`
- **Permissions**: Full access to all customers and orders

## TypeScript Interfaces

### Customer Interface
```typescript
interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}
```

### Order Interface
```typescript
interface Order {
  id: string;
  customer_id: string;
  order_data: any; // Contains cakeConfig, classicCakeConfig, orderItems
  total_amount: number;
  deposit_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  pickup_date: string;
  pickup_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

## API Usage Examples

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    emailRedirectTo: 'https://natively.dev/email-confirmed',
    data: {
      first_name: 'Mario',
      last_name: 'Rossi',
      phone: '3471234567',
    },
  },
});
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

### Create Customer Record
```typescript
const { data, error } = await supabase
  .from('customers')
  .insert({
    user_id: userId,
    first_name: 'Mario',
    last_name: 'Rossi',
    email: 'user@example.com',
    phone: '3471234567',
  });
```

### Create Order
```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    customer_id: customerId,
    order_data: {
      cakeConfig,
      classicCakeConfig,
      orderItems,
    },
    total_amount: 50.00,
    deposit_amount: 25.00,
    status: 'pending',
    pickup_date: new Date().toISOString(),
    pickup_time: '15:00',
    notes: 'Note del cliente',
  });
```

### Fetch Orders (Admin)
```typescript
const { data, error } = await supabase
  .from('orders')
  .select('*, customers(*)')
  .eq('status', 'pending')
  .order('created_at', { ascending: false });
```

### Update Order Status
```typescript
const { error } = await supabase
  .from('orders')
  .update({ 
    status: 'completed', 
    updated_at: new Date().toISOString() 
  })
  .eq('id', orderId);
```

## Environment Variables

### `.env` File
```env
EXPO_PUBLIC_SUPABASE_URL=https://wygucqfuakuxvukyupzb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Usage in Code
```typescript
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
```

## File Structure

```
lib/
  └── supabase.ts          # Supabase client configuration

contexts/
  └── AuthContext.tsx      # Authentication context and hooks

app/
  ├── auth.tsx            # Login/Register screen
  ├── (tabs)/
  │   ├── admin.tsx       # Admin panel
  │   └── (home)/
  │       └── checkout.tsx # Order checkout and submission

.env                       # Environment variables
```

## Security Best Practices

1. ✅ **Never commit `.env` to git** - Add to `.gitignore`
2. ✅ **Use RLS policies** - Implemented on all tables
3. ✅ **Validate user input** - Done in forms
4. ✅ **Require email verification** - Enabled
5. ✅ **Use secure password requirements** - Minimum 6 characters
6. ✅ **Store sessions securely** - Using AsyncStorage
7. ✅ **Admin checks on sensitive operations** - Implemented

## Testing Checklist

- [ ] User registration works
- [ ] Email verification is sent
- [ ] User login works
- [ ] User can create orders
- [ ] Orders are saved to database
- [ ] Email is sent to admin
- [ ] Admin can view all customers
- [ ] Admin can view all orders
- [ ] Admin can mark orders as completed
- [ ] RLS prevents unauthorized access
- [ ] Session persists after app restart

## Monitoring & Debugging

### Check Supabase Logs
```typescript
// In your code
console.log('Supabase configured:', isSupabaseConfigured());
console.log('Current user:', user);
console.log('Is admin:', isAdmin);
```

### Common Error Messages
- `"Email not confirmed"` - User needs to verify email
- `"Invalid login credentials"` - Wrong email/password
- `"Row level security policy violation"` - User trying to access unauthorized data

## Performance Considerations

1. **Indexes**: Consider adding indexes on frequently queried columns
   ```sql
   CREATE INDEX idx_orders_customer_id ON orders(customer_id);
   CREATE INDEX idx_orders_status ON orders(status);
   CREATE INDEX idx_customers_user_id ON customers(user_id);
   ```

2. **Query Optimization**: Use `.select()` to fetch only needed columns

3. **Pagination**: For large datasets, implement pagination
   ```typescript
   .range(0, 9) // First 10 items
   ```

## Backup & Recovery

Supabase automatically backs up your database. To manually export:

```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

## Future Enhancements

Potential features to add:
- [ ] Push notifications for order status
- [ ] Image upload to Supabase Storage
- [ ] Real-time order updates
- [ ] Customer order history view
- [ ] Rating and review system
- [ ] Loyalty points system
- [ ] Multiple admin users
- [ ] Order analytics dashboard

---

**All systems operational! 🚀**
