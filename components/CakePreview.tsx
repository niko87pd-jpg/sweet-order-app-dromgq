
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { CakeConfiguration, CAKE_BASES, CAKE_CREAMS, GRAMS_PER_PERSON } from '@/types/order';

interface CakePreviewProps {
  config: CakeConfiguration;
}

export default function CakePreview({ config }: CakePreviewProps) {
  const baseLabel = CAKE_BASES.find(b => b.value === config.base)?.label || 'Non selezionata';
  const creamLabel = CAKE_CREAMS.find(c => c.value === config.cream)?.label || 'Non selezionata';
  const totalWeight = config.numberOfPeople * GRAMS_PER_PERSON;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anteprima Dolce</Text>
      
      <View style={styles.cakeDisplay}>
        {config.photoUri ? (
          <Image source={{ uri: config.photoUri }} style={styles.cakeImage} />
        ) : (
          <View style={styles.placeholderCake}>
            <Text style={styles.cakeEmoji}>🎂</Text>
          </View>
        )}
        
        {config.dedication && (
          <View style={styles.dedicationOverlay}>
            <Text style={styles.dedicationText}>{config.dedication}</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Base:</Text>
          <Text style={styles.detailValue}>{baseLabel}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Crema:</Text>
          <Text style={styles.detailValue}>{creamLabel}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Persone:</Text>
          <Text style={styles.detailValue}>{config.numberOfPeople}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Peso totale:</Text>
          <Text style={styles.detailValue}>{totalWeight}g</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  cakeDisplay: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  cakeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderCake: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cakeEmoji: {
    fontSize: 80,
  },
  dedicationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    alignItems: 'center',
  },
  dedicationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    fontStyle: 'italic',
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
