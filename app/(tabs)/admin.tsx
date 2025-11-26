
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Customer, Order } from '@/lib/supabase';

type TabType = 'customers' | 'pending' | 'completed';

export default function AdminScreen() {
  const router = useRouter();
  const { isAdmin, user, isSupabaseEnabled } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      Alert.alert(
        'Accesso Negato',
        'Devi effettuare il login per accedere al pannello admin.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    if (!isSupabaseEnabled) {
      Alert.alert(
        'Supabase Non Configurato',
        'Per utilizzare il pannello admin, devi prima configurare Supabase.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    if (!isAdmin) {
      Alert.alert(
        'Accesso Negato',
        'Non hai i permessi per accedere a questa sezione.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    loadData();
  }, [isAdmin, user, isSupabaseEnabled]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;
      setCustomers(customersData || []);

      // Load pending orders
      const { data: pendingData, error: pendingError } = await supabase
        .from('orders')
        .select('*, customers(*)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingOrders(pendingData || []);

      // Load completed orders
      const { data: completedData, error: completedError } = await supabase
        .from('orders')
        .select('*, customers(*)')
        .eq('status', 'completed')
        .order('updated_at', { ascending: false });

      if (completedError) throw completedError;
      setCompletedOrders(completedData || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Errore', 'Impossibile caricare i dati');
    } finally {
      setLoading(false);
    }
  };

  const markOrderAsCompleted = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      Alert.alert('Successo', 'Ordine segnato come evaso');
      loadData();
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert('Errore', 'Impossibile aggiornare l\'ordine');
    }
  };

  const renderCustomers = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Clienti Registrati ({customers.length})</Text>
      {customers.map((customer) => (
        <View key={customer.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <IconSymbol name="person.circle" size={40} color={colors.primary} />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>
                {customer.first_name} {customer.last_name}
              </Text>
              <Text style={styles.cardSubtitle}>
                Cliente dal {new Date(customer.created_at).toLocaleDateString('it-IT')}
              </Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <IconSymbol name="envelope" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{customer.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol name="phone" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{customer.phone}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderOrders = (orders: Order[], isPending: boolean) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {isPending ? `Ordini in Attesa (${orders.length})` : `Ordini Evasi (${orders.length})`}
      </Text>
      {orders.map((order: any) => (
        <View key={order.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <IconSymbol 
              name={isPending ? "clock" : "checkmark.circle"} 
              size={40} 
              color={isPending ? colors.secondary : colors.primary} 
            />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>
                Ordine #{order.id.slice(0, 8)}
              </Text>
              <Text style={styles.cardSubtitle}>
                {order.customers?.first_name} {order.customers?.last_name}
              </Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                Ritiro: {new Date(order.pickup_date).toLocaleDateString('it-IT')} alle {order.pickup_time}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol name="eurosign" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                Totale: €{order.total_amount.toFixed(2)} (Acconto: €{order.deposit_amount.toFixed(2)})
              </Text>
            </View>
            {order.notes && (
              <View style={styles.infoRow}>
                <IconSymbol name="note.text" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>Note: {order.notes}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <IconSymbol name="envelope" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{order.customers?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol name="phone" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{order.customers?.phone}</Text>
            </View>
          </View>
          {isPending && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => {
                Alert.alert(
                  'Conferma',
                  'Segnare questo ordine come evaso?',
                  [
                    { text: 'Annulla', style: 'cancel' },
                    { text: 'Conferma', onPress: () => markOrderAsCompleted(order.id) },
                  ]
                );
              }}
            >
              <IconSymbol name="checkmark.circle" size={20} color="#FFFFFF" />
              <Text style={styles.completeButtonText}>Segna come Evaso</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Caricamento...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Pannello Admin',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerBackTitle: 'Indietro',
        }}
      />
      <View style={styles.container}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'customers' && styles.tabActive]}
            onPress={() => setActiveTab('customers')}
          >
            <IconSymbol 
              name="person.2" 
              size={20} 
              color={activeTab === 'customers' ? '#FFFFFF' : colors.text} 
            />
            <Text style={[styles.tabText, activeTab === 'customers' && styles.tabTextActive]}>
              Clienti
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            onPress={() => setActiveTab('pending')}
          >
            <IconSymbol 
              name="clock" 
              size={20} 
              color={activeTab === 'pending' ? '#FFFFFF' : colors.text} 
            />
            <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
              In Attesa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
            onPress={() => setActiveTab('completed')}
          >
            <IconSymbol 
              name="checkmark.circle" 
              size={20} 
              color={activeTab === 'completed' ? '#FFFFFF' : colors.text} 
            />
            <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
              Evasi
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            Platform.OS !== 'ios' && styles.contentContainerWithTabBar
          ]}
        >
          {activeTab === 'customers' && renderCustomers()}
          {activeTab === 'pending' && renderOrders(pendingOrders, true)}
          {activeTab === 'completed' && renderOrders(completedOrders, false)}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  contentContainerWithTabBar: {
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  completeButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
