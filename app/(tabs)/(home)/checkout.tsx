
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { UI_TEXTS, MESSAGES, PAYMENT_CONFIG } from '@/config/appConfig';

export default function CheckoutScreen() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | null>(null);

  // Mock data - in real app this would come from context/state management
  const cakePrice = 38.50;
  const productsPrice = 15.50;
  const totalPrice = cakePrice + productsPrice;
  const depositAmount = totalPrice * PAYMENT_CONFIG.depositPercentage;
  const remainingAmount = totalPrice - depositAmount;

  const handlePayment = () => {
    if (!paymentMethod) {
      Alert.alert(
        MESSAGES.errors.selectPaymentMethod,
        MESSAGES.errors.selectPaymentMethodDescription
      );
      return;
    }

    console.log('Processing payment:', {
      method: paymentMethod,
      amount: depositAmount,
      totalPrice,
    });

    Alert.alert(
      MESSAGES.success.paymentSimulated,
      `${MESSAGES.success.paymentSimulatedDescription.replace('Acconto pagato', `Acconto di €${depositAmount.toFixed(2)} pagato`)}`,
      [
        {
          text: 'OK',
          onPress: () => {
            Alert.alert(
              MESSAGES.success.orderConfirmed,
              MESSAGES.success.orderConfirmedDescription,
              [
                {
                  text: MESSAGES.success.backToHome,
                  onPress: () => router.push('/(tabs)/(home)/'),
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: UI_TEXTS.checkout.title,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerBackTitle: 'Indietro',
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
          <Text style={styles.emoji}>🎂</Text>
          <Text style={styles.title}>{UI_TEXTS.checkout.orderSummary}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{UI_TEXTS.checkout.customCake}</Text>
          <View style={styles.row}>
            <Text style={styles.itemLabel}>Base: Pan di Spagna</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemLabel}>Crema: Pistacchio</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemLabel}>Persone: 4 (560g)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemLabel}>Dedica: &quot;Buon Compleanno!&quot;</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.priceLabel}>Prezzo Dolce</Text>
            <Text style={styles.priceValue}>€{cakePrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{UI_TEXTS.checkout.additionalProducts}</Text>
          <View style={styles.row}>
            <Text style={styles.itemLabel}>Cannoli Siciliani x2</Text>
            <Text style={styles.itemValue}>€7.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemLabel}>Macarons x1</Text>
            <Text style={styles.itemValue}>€8.50</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.priceLabel}>{UI_TEXTS.checkout.additionalProducts}</Text>
            <Text style={styles.priceValue}>€{productsPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.totalCard}>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>{UI_TEXTS.checkout.totalOrder}</Text>
            <Text style={styles.totalValue}>€{totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.depositRow}>
            <View style={styles.depositInfo}>
              <IconSymbol name="info.circle" size={20} color="#FFFFFF" />
              <Text style={styles.depositText}>
                {UI_TEXTS.checkout.depositRequired}
              </Text>
            </View>
            <Text style={styles.depositValue}>€{depositAmount.toFixed(2)}</Text>
          </View>
          <Text style={styles.remainingText}>
            {UI_TEXTS.checkout.remainingText}: €{remainingAmount.toFixed(2)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{UI_TEXTS.checkout.paymentMethod}</Text>
        
        {PAYMENT_CONFIG.paymentMethods.card.enabled && (
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.paymentOptionContent}>
              <IconSymbol name="creditcard" size={28} color={paymentMethod === 'card' ? colors.primary : colors.text} />
              <View style={styles.paymentOptionText}>
                <Text style={[
                  styles.paymentOptionTitle,
                  paymentMethod === 'card' && styles.paymentOptionTitleSelected
                ]}>
                  {PAYMENT_CONFIG.paymentMethods.card.label}
                </Text>
                <Text style={styles.paymentOptionDescription}>
                  {PAYMENT_CONFIG.paymentMethods.card.description}
                </Text>
              </View>
            </View>
            {paymentMethod === 'card' && (
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}

        {PAYMENT_CONFIG.paymentMethods.paypal.enabled && (
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'paypal' && styles.paymentOptionSelected
            ]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <View style={styles.paymentOptionContent}>
              <IconSymbol name="dollarsign.circle" size={28} color={paymentMethod === 'paypal' ? colors.primary : colors.text} />
              <View style={styles.paymentOptionText}>
                <Text style={[
                  styles.paymentOptionTitle,
                  paymentMethod === 'paypal' && styles.paymentOptionTitleSelected
                ]}>
                  {PAYMENT_CONFIG.paymentMethods.paypal.label}
                </Text>
                <Text style={styles.paymentOptionDescription}>
                  {PAYMENT_CONFIG.paymentMethods.paypal.description}
                </Text>
              </View>
            </View>
            {paymentMethod === 'paypal' && (
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.confirmButton,
            !paymentMethod && styles.confirmButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={!paymentMethod}
        >
          <Text style={styles.confirmButtonText}>
            {UI_TEXTS.checkout.confirmButton} €{depositAmount.toFixed(2)}
          </Text>
          <IconSymbol name="lock.fill" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <IconSymbol name="info.circle" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            {UI_TEXTS.checkout.securityInfo}
          </Text>
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
    marginBottom: 24,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  itemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.highlight,
    marginVertical: 12,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.3)',
    elevation: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  depositRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  depositInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  depositText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  depositValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  remainingText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  paymentOption: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  paymentOptionText: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  paymentOptionTitleSelected: {
    color: colors.primary,
  },
  paymentOptionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  confirmButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(156, 39, 176, 0.3)',
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
