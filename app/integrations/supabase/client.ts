import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://wygucqfuakuxvukyupzb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Z3VjcWZ1YWt1eHZ1a3l1cHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjQ0MDksImV4cCI6MjA3NzEwMDQwOX0.kJFgVpMahmJu0Y9c6-WC7wB9BRQXpM1qIxUYQ7cdyhI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
