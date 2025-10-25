
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Product } from '@/types/order';
import { IconSymbol } from './IconSymbol';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ProductCard({ product, quantity, onAdd, onRemove }: ProductCardProps) {
  return (
    <View style={styles.container}>
      {product.imageUrl ? (
        <Image 
          source={{ uri: product.imageUrl }} 
          style={styles.image}
          defaultSource={require('@/assets/images/final_quest_240x240.png')}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <IconSymbol name="photo" size={32} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>€{product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        {quantity > 0 ? (
          <>
            <TouchableOpacity style={styles.quantityButton} onPress={onRemove}>
              <IconSymbol name="minus" size={20} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={onAdd}>
              <IconSymbol name="plus" size={20} color={colors.primary} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Text style={styles.addButtonText}>Aggiungi</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: colors.background,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
