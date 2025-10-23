
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Pasticceria Dolce Vita',
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
          <Text style={styles.emoji}>🧁</Text>
          <Text style={styles.title}>Benvenuto!</Text>
          <Text style={styles.subtitle}>
            Crea il tuo dolce personalizzato o scegli dai nostri prodotti
          </Text>
        </View>

        <TouchableOpacity
          style={styles.mainCard}
          onPress={() => router.push('/(tabs)/(home)/customize-cake')}
        >
          <View style={styles.cardIcon}>
            <IconSymbol name="birthday.cake" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Crea il Tuo Dolce</Text>
            <Text style={styles.cardDescription}>
              Personalizza base, crema, dimensione e dedica
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainCard}
          onPress={() => router.push('/(tabs)/(home)/products')}
        >
          <View style={[styles.cardIcon, { backgroundColor: colors.secondary }]}>
            <IconSymbol name="cart" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Altri Prodotti</Text>
            <Text style={styles.cardDescription}>
              Scopri la nostra selezione di dolci artigianali
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Come Funziona</Text>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Configura il tuo dolce personalizzato</Text>
          </View>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Aggiungi altri prodotti se desideri</Text>
          </View>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Paga il 50% come acconto alla conferma</Text>
          </View>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>Ritira il tuo ordine in pasticceria</Text>
          </View>
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
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  mainCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
});
