
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profilo',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.name}>Cliente</Text>
          <Text style={styles.email}>cliente@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I Miei Ordini</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="list.bullet" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Ordini Attivi</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="clock" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Storico Ordini</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impostazioni</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="person" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Dati Personali</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="bell" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Notifiche</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="creditcard" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Metodi di Pagamento</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supporto</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="questionmark.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Centro Assistenza</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="envelope" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Contattaci</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Pasticceria Dolce Vita</Text>
          <Text style={styles.infoText}>📍 Via Roma 123, Milano</Text>
          <Text style={styles.infoText}>📞 +39 02 1234567</Text>
          <Text style={styles.infoText}>🕐 Lun-Sab: 8:00-20:00</Text>
          <Text style={styles.infoText}>🕐 Dom: 9:00-13:00</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  contentContainerWithTabBar: {
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 22,
  },
});
