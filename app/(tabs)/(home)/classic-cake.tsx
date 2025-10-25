
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/styles/commonStyles';
import { ClassicCakeConfiguration, GRAMS_PER_PERSON } from '@/types/order';
import { IconSymbol } from '@/components/IconSymbol';
import { UI_TEXTS, MESSAGES, DEDICATION_CONFIG, PHOTO_CONFIG, CAKE_PRICING, CLASSIC_CAKES_CONFIG } from '@/config/appConfig';
import { useOrder } from '@/contexts/OrderContext';

export default function ClassicCakeScreen() {
  const router = useRouter();
  const { classicCakeConfig, updateClassicCakeConfig, getClassicCakePrice } = useOrder();
  
  const [config, setConfig] = useState<ClassicCakeConfiguration>(classicCakeConfig);

  const updateConfig = (updates: Partial<ClassicCakeConfiguration>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    updateClassicCakeConfig(newConfig);
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          MESSAGES.errors.permissionDenied,
          MESSAGES.errors.permissionDeniedDescription
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: PHOTO_CONFIG.allowsEditing,
        aspect: PHOTO_CONFIG.aspectRatio as [number, number],
        quality: PHOTO_CONFIG.quality,
      });

      if (!result.canceled && result.assets[0]) {
        updateConfig({ photoUri: result.assets[0].uri });
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Errore', 'Si è verificato un errore durante la selezione dell\'immagine');
    }
  };

  const canProceed = config.cakeType && config.numberOfPeople > 0;

  const handleContinue = () => {
    if (!canProceed) {
      Alert.alert(
        MESSAGES.errors.incompleteConfiguration,
        MESSAGES.errors.incompleteClassicCakeConfiguration
      );
      return;
    }
    
    console.log('Classic cake configuration:', config);
    console.log('Classic cake price:', getClassicCakePrice());
    router.push({
      pathname: '/(tabs)/(home)/products',
      params: { classicCakeConfigured: 'true' }
    });
  };

  const renderSummary = () => {
    if (!config.cakeType) return null;

    const totalWeightKg = (config.numberOfPeople * GRAMS_PER_PERSON) / 1000;
    const basePrice = totalWeightKg * CAKE_PRICING.pricePerKg;
    const photoPrice = config.photoUri ? CAKE_PRICING.photoSurcharge : 0;
    const selectedCake = CLASSIC_CAKES_CONFIG.find(c => c.value === config.cakeType);

    return (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{UI_TEXTS.classicCake.preview}</Text>
        
        {selectedCake && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dolce:</Text>
            <Text style={styles.summaryValue}>{selectedCake.label}</Text>
          </View>
        )}
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Persone:</Text>
          <Text style={styles.summaryValue}>
            {config.numberOfPeople} ({totalWeightKg.toFixed(2)}kg)
          </Text>
        </View>
        
        {config.dedication && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dedica:</Text>
            <Text style={styles.summaryValue}>&quot;{config.dedication}&quot;</Text>
          </View>
        )}
        
        {config.photoUri && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Foto:</Text>
            <Text style={styles.summaryValue}>✓ Aggiunta (+€{photoPrice.toFixed(2)})</Text>
          </View>
        )}
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Totale:</Text>
          <Text style={styles.summaryTotalValue}>€{getClassicCakePrice().toFixed(2)}</Text>
        </View>
        
        <Text style={styles.priceBreakdown}>
          Base: €{basePrice.toFixed(2)}
          {photoPrice > 0 && ` + Foto: €${photoPrice.toFixed(2)}`}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: UI_TEXTS.classicCake.title,
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
        <Text style={styles.sectionTitle}>{UI_TEXTS.classicCake.selectCake}</Text>
        <View style={styles.cakesGrid}>
          {CLASSIC_CAKES_CONFIG.map((cake) => (
            <TouchableOpacity
              key={cake.value}
              style={[
                styles.cakeCard,
                config.cakeType === cake.value && styles.cakeCardSelected
              ]}
              onPress={() => updateConfig({ cakeType: cake.value as any })}
            >
              <View style={styles.cakeCardContent}>
                {cake.imageUrl && (
                  <Image 
                    source={{ uri: cake.imageUrl }} 
                    style={styles.cakeImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.cakeInfo}>
                  <Text style={[
                    styles.cakeLabel,
                    config.cakeType === cake.value && styles.cakeLabelSelected
                  ]}>
                    {cake.label}
                  </Text>
                  <Text style={styles.cakeDescription}>{cake.description}</Text>
                </View>
              </View>
              {config.cakeType === cake.value && (
                <View style={styles.selectedBadge}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{UI_TEXTS.classicCake.numberOfPeople}</Text>
        <View style={styles.peopleSelector}>
          <TouchableOpacity
            style={styles.peopleButton}
            onPress={() => updateConfig({ 
              numberOfPeople: Math.max(CAKE_PRICING.minPeople, config.numberOfPeople - 1) 
            })}
          >
            <IconSymbol name="minus" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.peopleDisplay}>
            <Text style={styles.peopleNumber}>{config.numberOfPeople}</Text>
            <Text style={styles.peopleLabel}>persone</Text>
            <Text style={styles.weightLabel}>
              ({config.numberOfPeople * GRAMS_PER_PERSON}g = {((config.numberOfPeople * GRAMS_PER_PERSON) / 1000).toFixed(2)}kg)
            </Text>
          </View>
          <TouchableOpacity
            style={styles.peopleButton}
            onPress={() => updateConfig({ 
              numberOfPeople: Math.min(CAKE_PRICING.maxPeople, config.numberOfPeople + 1) 
            })}
          >
            <IconSymbol name="plus" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{UI_TEXTS.classicCake.dedication}</Text>
        <TextInput
          style={styles.input}
          placeholder={DEDICATION_CONFIG.placeholder}
          placeholderTextColor={colors.textSecondary}
          value={config.dedication}
          onChangeText={(text) => updateConfig({ dedication: text })}
          maxLength={DEDICATION_CONFIG.maxLength}
        />
        <Text style={styles.charCount}>
          {config.dedication.length}/{DEDICATION_CONFIG.maxLength} caratteri
        </Text>

        <Text style={styles.sectionTitle}>{UI_TEXTS.classicCake.photo}</Text>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <IconSymbol name="photo" size={32} color={colors.primary} />
          <Text style={styles.photoButtonText}>
            {config.photoUri ? UI_TEXTS.classicCake.changePhoto : UI_TEXTS.classicCake.addPhoto}
          </Text>
          <Text style={styles.photoSurcharge}>+€{CAKE_PRICING.photoSurcharge.toFixed(2)}</Text>
        </TouchableOpacity>

        {renderSummary()}

        <TouchableOpacity
          style={[styles.continueButton, !canProceed && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canProceed}
        >
          <Text style={styles.continueButtonText}>{UI_TEXTS.classicCake.continueButton}</Text>
          <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  cakesGrid: {
    gap: 12,
    marginBottom: 10,
  },
  cakeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.background,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    position: 'relative',
    padding: 12,
  },
  cakeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  cakeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cakeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cakeInfo: {
    flex: 1,
    paddingRight: 30,
  },
  cakeLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cakeLabelSelected: {
    color: colors.primary,
  },
  cakeDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 2,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
    elevation: 3,
  },
  peopleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  peopleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  peopleDisplay: {
    alignItems: 'center',
    marginHorizontal: 30,
  },
  peopleNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
  },
  peopleLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  weightLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.highlight,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
    elevation: 1,
  },
  charCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: colors.highlight,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  photoSurcharge: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
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
  priceBreakdown: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 4px 12px rgba(156, 39, 176, 0.3)',
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
