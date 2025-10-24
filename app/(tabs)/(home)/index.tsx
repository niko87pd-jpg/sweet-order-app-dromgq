
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { TouchableOpacity } from 'react-native';
import { PASTRY_INFO, UI_TEXTS } from '@/config/appConfig';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: PASTRY_INFO.name,
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
          <Text style={styles.title}>{PASTRY_INFO.welcomeTitle}</Text>
          <Text style={styles.subtitle}>
            {PASTRY_INFO.welcomeSubtitle}
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
            <Text style={styles.cardTitle}>{UI_TEXTS.home.createCakeTitle}</Text>
            <Text style={styles.cardDescription}>
              {UI_TEXTS.home.createCakeDescription}
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainCard}
          onPress={() => router.push('/(tabs)/(home)/classic-cake')}
        >
          <View style={[styles.cardIcon, { backgroundColor: colors.secondary }]}>
            <IconSymbol name="cake" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{UI_TEXTS.home.chooseCakeTitle}</Text>
            <Text style={styles.cardDescription}>
              {UI_TEXTS.home.chooseCakeDescription}
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainCard}
          onPress={() => router.push('/(tabs)/(home)/products')}
        >
          <View style={[styles.cardIcon, { backgroundColor: colors.accent }]}>
            <IconSymbol name="cart" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{UI_TEXTS.home.productsTitle}</Text>
            <Text style={styles.cardDescription}>
              {UI_TEXTS.home.productsDescription}
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{UI_TEXTS.home.howItWorksTitle}</Text>
          {UI_TEXTS.home.steps.map((step, index) => (
            <View key={index} style={styles.infoStep}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contattaci</Text>
          <TouchableOpacity 
            style={styles.contactRow}
            onPress={() => Linking.openURL(`tel:${PASTRY_INFO.phone}`)}
          >
            <IconSymbol name="phone" size={20} color={colors.primary} />
            <Text style={styles.contactText}>{PASTRY_INFO.phone}</Text>
          </TouchableOpacity>
          <View style={styles.contactRow}>
            <IconSymbol name="envelope" size={20} color={colors.primary} />
            <Text style={styles.contactText}>{PASTRY_INFO.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <IconSymbol name="location" size={20} color={colors.primary} />
            <Text style={styles.contactText}>{PASTRY_INFO.address}</Text>
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
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
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
    paddingHorizontal: 20,
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
    marginBottom: 16,
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
  contactCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
});
