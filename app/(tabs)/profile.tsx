
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, Linking, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { PASTRY_INFO } from '@/config/appConfig';

export default function ProfileScreen() {
  const handleCall = () => {
    Linking.openURL(`tel:${PASTRY_INFO.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${PASTRY_INFO.email}`);
  };

  const handleAddress = () => {
    const encodedAddress = encodeURIComponent(PASTRY_INFO.address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

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
          {PASTRY_INFO.logo && (
            <Image 
              source={PASTRY_INFO.logo} 
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <Text style={styles.shopName}>{PASTRY_INFO.name}</Text>
          <Text style={styles.emoji}>{PASTRY_INFO.emoji}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contattaci</Text>
          
          <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
            <View style={styles.iconContainer}>
              <IconSymbol name="phone" size={24} color={colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Telefono</Text>
              <Text style={styles.contactValue}>{PASTRY_INFO.phone}</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
            <View style={styles.iconContainer}>
              <IconSymbol name="envelope" size={24} color={colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{PASTRY_INFO.email}</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleAddress}>
            <View style={styles.iconContainer}>
              <IconSymbol name="location" size={24} color={colors.primary} />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Indirizzo</Text>
              <Text style={styles.contactValue}>{PASTRY_INFO.address}</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orari di Apertura</Text>
          
          <View style={styles.hoursCard}>
            <View style={styles.hoursRow}>
              <Text style={styles.dayLabel}>Lunedì - Venerdì</Text>
              <Text style={styles.hoursValue}>{PASTRY_INFO.openingHours.weekdays}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.hoursRow}>
              <Text style={styles.dayLabel}>Sabato</Text>
              <Text style={styles.hoursValue}>{PASTRY_INFO.openingHours.saturday}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.hoursRow}>
              <Text style={styles.dayLabel}>Domenica</Text>
              <Text style={styles.hoursValue}>{PASTRY_INFO.openingHours.sunday}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni App</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Questa app ti permette di ordinare dolci personalizzati e prodotti artigianali dalla nostra pasticceria.
            </Text>
            <Text style={styles.infoText}>
              Puoi configurare il tuo dolce scegliendo base, crema, dimensione e aggiungere una dedica personalizzata.
            </Text>
            <Text style={styles.infoText}>
              Il pagamento richiede un acconto del 50% alla conferma dell&apos;ordine, il resto verrà pagato al ritiro.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Versione 1.0.0</Text>
          <Text style={styles.footerText}>© 2024 {PASTRY_INFO.name}</Text>
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
    marginBottom: 30,
    paddingVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  shopName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  emoji: {
    fontSize: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  contactCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  hoursCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  hoursValue: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: 4,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary + '30',
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});
