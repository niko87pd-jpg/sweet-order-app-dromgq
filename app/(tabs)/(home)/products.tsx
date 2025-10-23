
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { ADDITIONAL_PRODUCTS } from '@/data/products';
import { OrderItem } from '@/types/order';
import ProductCard from '@/components/ProductCard';
import { IconSymbol } from '@/components/IconSymbol';
import { UI_TEXTS } from '@/config/appConfig';

export default function ProductsScreen() {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const getProductQuantity = (productId: string) => {
    return orderItems.find(item => item.product.id === productId)?.quantity || 0;
  };

  const addProduct = (productId: string) => {
    const product = ADDITIONAL_PRODUCTS.find(p => p.id === productId);
    if (!product) {
      console.log('Product not found:', productId);
      return;
    }

    setOrderItems(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeProduct = (productId: string) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (!existing) return prev;

      if (existing.quantity === 1) {
        return prev.filter(item => item.product.id !== productId);
      }

      return prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Stack.Screen
        options={{
          title: UI_TEXTS.products.title,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerBackTitle: 'Indietro',
        }}
      />
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            Platform.OS !== 'ios' && styles.contentContainerWithTabBar
          ]}
        >
          <Text style={styles.header}>{UI_TEXTS.products.title}</Text>
          <Text style={styles.subheader}>
            {UI_TEXTS.products.subtitle}
          </Text>

          {ADDITIONAL_PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={getProductQuantity(product.id)}
              onAdd={() => addProduct(product.id)}
              onRemove={() => removeProduct(product.id)}
            />
          ))}

          {orderItems.length > 0 && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{UI_TEXTS.products.summaryTitle}</Text>
              {orderItems.map(item => (
                <View key={item.product.id} style={styles.summaryRow}>
                  <Text style={styles.summaryItemName}>
                    {item.product.name} x{item.quantity}
                  </Text>
                  <Text style={styles.summaryItemPrice}>
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>{UI_TEXTS.products.totalLabel}</Text>
                <Text style={styles.summaryTotalValue}>€{calculateTotal().toFixed(2)}</Text>
              </View>
            </View>
          )}

          <View style={styles.spacer} />
        </ScrollView>

        {totalItems > 0 && (
          <View style={styles.bottomBar}>
            <View style={styles.bottomBarContent}>
              <View>
                <Text style={styles.bottomBarLabel}>{totalItems} prodotti</Text>
                <Text style={styles.bottomBarPrice}>€{calculateTotal().toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => router.push('/(tabs)/(home)/checkout')}
              >
                <Text style={styles.checkoutButtonText}>{UI_TEXTS.products.checkoutButton}</Text>
                <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {totalItems === 0 && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.push('/(tabs)/(home)/checkout')}
            >
              <Text style={styles.skipButtonText}>{UI_TEXTS.products.skipButton}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  contentContainerWithTabBar: {
    paddingBottom: 200,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItemName: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.highlight,
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  spacer: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 0 : 80,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 8,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  bottomBarPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
