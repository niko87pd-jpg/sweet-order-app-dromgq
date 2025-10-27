
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured, Customer } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  customer: Customer | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string; phone: string }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isSupabaseEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const isSupabaseEnabled = isSupabaseConfigured();

  // Admin email - matches the email in RLS policies
  const ADMIN_EMAIL = 'duemondi87@gmail.com';

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadCustomerData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadCustomerData(session.user.id);
      } else {
        setCustomer(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseEnabled]);

  const loadCustomerData = async (userId: string) => {
    try {
      console.log('Loading customer data for user:', userId);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error loading customer data:', error);
      } else {
        console.log('Customer data loaded:', data);
        setCustomer(data);
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: { firstName: string; lastName: string; phone: string }
  ) => {
    try {
      console.log('Signing up user:', email);
      
      // Sign up with email verification
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      console.log('Signup successful:', data);

      // Create customer record
      if (data.user) {
        console.log('Creating customer record for user:', data.user.id);
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            user_id: data.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: email,
            phone: userData.phone,
          });

        if (customerError) {
          console.error('Error creating customer record:', customerError);
          return { error: new Error('Errore nella creazione del profilo cliente') };
        }
        console.log('Customer record created successfully');
      }

      return { error: null };
    } catch (error) {
      console.error('Signup exception:', error);
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
      } else {
        console.log('Sign in successful');
      }

      return { error };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    await supabase.auth.signOut();
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        customer,
        isAdmin,
        loading,
        signUp,
        signIn,
        signOut,
        isSupabaseEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
