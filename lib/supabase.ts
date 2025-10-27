
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = 'https://wygucqfuakuxvukyupzb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Z3VjcWZ1YWt1eHZ1a3l1cHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjQ0MDksImV4cCI6MjA3NzEwMDQwOX0.kJFgVpMahmJu0Y9c6-WC7wB9BRQXpM1qIxUYQ7cdyhI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  order_data: any;
  total_amount: number;
  deposit_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  pickup_date: string;
  pickup_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '';
};

console.log('Supabase configured:', isSupabaseConfigured());
console.log('Supabase URL:', supabaseUrl);
