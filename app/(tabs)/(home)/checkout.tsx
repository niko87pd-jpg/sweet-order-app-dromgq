
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { UI_TEXTS, MESSAGES, PAYMENT_CONFIG, CAKE_BASES_CONFIG, CAKE_CREAMS_CONFIG, MERINGA_FILLINGS_CONFIG, CLASSIC_CAKES_CONFIG, GRAMS_PER_PERSON } from '@/config/appConfig';
import { useOrder } from '@/contexts/OrderContext';

export default function CheckoutScreen() {
  const router = useRouter();
  const { 
    cakeConfig, 
    classicCakeConfig,
    orderItems, 
    getCakePrice, 
    getClassicCakePrice,
    getProductsTotal, 
    getOrderTotal, 
    getDepositAmount,
    clearOrder 
  } = useOrder();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert(
        MESSAGES.errors.selectPaymentMethod,
        MESSAGES.errors.selectPaymentMethodDescription
      );
      return;
    }

    console.log('Processing payment with method:', selectedPaymentMethod);
    console.log('Order total:', getOrderTotal());
    console.log('Deposit amount:', getDepositAmount());

    Alert.alert(
      MESSAGES.success.paymentSimulated,
      MESSAGES.success.paymentSimulatedDescription,
      [
        {
          text: MESSAGES.success.backToHome,
          onPress: () => {
            clearOrder();
            router.replace('/(tabs)/(home)/');
          },
        },
      ]
    );
  };

  const hasCustomCake = cakeConfig.base !== null;
  const hasClassicCake = classicCakeConfig.cakeType !== null;

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
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{UI_TEXTS.checkout.orderSummary}</Text>

          {hasCustomCake && (
            <>
              <Text style={styles.sectionLabel}>{UI_TEXTS.checkout.customCake}</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Base:</Text>
                <Text style={styles.summaryValue}>
                  {CAKE_BASES_CONFIG.find(b => b.value === cakeConfig.base)?.label}
                </Text>
              </View>

              {cakeConfig.base === 'meringa' && cakeConfig.meringaFilling && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Ripieno:</Text>
                  <Text style={styles.summaryValue}>
                    {MERINGA_FILLINGS_CONFIG.find(f => f.value === cakeConfig.meringaFilling)?.label}
                  </Text>
                </View>
              )}

              {cakeConfig.base !== 'meringa' && cakeConfig.cream && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Crema:</Text>
                  <Text style={styles.summaryValue}>
                    {CAKE_CREAMS_CONFIG.find(c => c.value === cakeConfig.cream)?.label}
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Persone:</Text>
                <Text style={styles.summaryValue}>
                  {cakeConfig.numberOfPeople} ({((cakeConfig.numberOfPeople * GRAMS_PER_PERSON) / 1000).toFixed(2)}kg)
                </Text>
              </View>

              {cakeConfig.dedication && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Dedica:</Text>
                  <Text style={styles.summaryValue}>&quot;{cakeConfig.dedication}&quot;</Text>
                </View>
              )}

              {cakeConfig.photoUri && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Foto:</Text>
                  <Text style={styles.summaryValue}>✓ Aggiunta</Text>
                </View>
              )}

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Prezzo Dolce:</Text>
                <Text style={styles.priceValue}>€{getCakePrice().toFixed(2)}</Text>
              </View>

              <View style={styles.divider} />
            </>
          )}

          {hasClassicCake && (
            <>
              <Text style={styles.sectionLabel}>{UI_TEXTS.checkout.classicCake}</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Dolce:</Text>
                <Text style={styles.summaryValue}>
                  {CLASSIC_CAKES_CONFIG.find(c => c.value === classicCakeConfig.cakeType)?.label}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Persone:</Text>
                <Text style={styles.summaryValue}>
                  {classicCakeConfig.numberOfPeople} ({((classicCakeConfig.numberOfPeople * GRAMS_PER_PERSON) / 1000).toFixed(2)}kg)
                </Text>
              </View>

              {classicCakeConfig.dedication && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Dedica:</Text>
                  <Text style={styles.summaryValue}>&quot;{classicCakeConfig.dedication}&quot;</Text>
                </View>
              )}

              {classicCakeConfig.photoUri && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Foto:</Text>
                  <Text style={styles.summaryValue}>✓ Aggiunta</Text>
                </View>
              )}

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Prezzo Dolce:</Text>
                <Text style={styles.priceValue}>€{getClassicCakePrice().toFixed(2)}</Text>
              </View>

              <View style={styles.divider} />
            </>
          )}

          {orderItems.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>{UI_TEXTS.checkout.additionalProducts}</Text>
              {orderItems.map((item) => (
                <View key={item.product.id} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {item.product.name} x{item.quantity}
                  </Text>
                  <Text style={styles.summaryValue}>
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Totale Prodotti:</Text>
                <Text style={styles.priceValue}>€{getProductsTotal().toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{UI_TEXTS.checkout.totalOrder}</Text>
            <Text style={styles.totalValue}>€{getOrderTotal().toFixed(2)}</Text>
          </View>

          <View style={styles.depositRow}>
            <Text style={styles.depositLabel}>{UI_TEXTS.checkout.depositRequired}</Text>
            <Text style={styles.depositValue}>€{getDepositAmount().toFixed(2)}</Text>
          </View>

          <Text style={styles.remainingText}>
            {UI_TEXTS.checkout.remainingText}: €{(getOrderTotal() - getDepositAmount()).toFixed(2)}
          </Text>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>{UI_TEXTS.checkout.paymentMethod}</Text>
          
          {Object.entries(PAYMENT_CONFIG.paymentMethods).map(([key, method]) => {
            if (!method.enabled) return null;
            
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.paymentOption,
                  selectedPaymentMethod === key && styles.paymentOptionSelected
                ]}
                onPress={() => setSelectedPaymentMethod(key)}
              >
                <View style={styles.paymentOptionContent}>
                  <Text style={[
                    styles.paymentOptionLabel,
                    selectedPaymentMethod === key && styles.paymentOptionLabelSelected
                  ]}>
                    {method.label}
                  </Text>
                  <Text style={styles.paymentOptionDescription}>
                    {method.description}
                  </Text>
                </View>
                {selectedPaymentMethod === key && (
                  <IconSymbol name="checkmark.circle.fill" size={28} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.securityInfo}>
          <IconSymbol name="lock.shield" size={24} color={colors.primary} />
          <Text style={styles.securityText}>{UI_TEXTS.checkout.securityInfo}</Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, !selectedPaymentMethod && styles.confirmButtonDisabled]}
          onPress={handlePayment}
          disabled={!selectedPaymentMethod}
        >
          <IconSymbol name="creditcard" size={24} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>{UI_TEXTS.checkout.confirmButton}</Text>
        </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.highlight,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  depositRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.highlight,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  depositLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  depositValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  remainingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  paymentCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.background,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  paymentOptionContent: {
    flex: 1,
  },
  paymentOptionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  paymentOptionLabelSelected: {
    color: colors.primary,
  },
  paymentOptionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.3)',
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
});
