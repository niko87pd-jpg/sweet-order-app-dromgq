
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/styles/commonStyles';
import { CakeConfiguration, CAKE_BASES, CAKE_CREAMS, MERINGA_FILLINGS, GRAMS_PER_PERSON } from '@/types/order';
import OptionSelector from '@/components/OptionSelector';
import { IconSymbol } from '@/components/IconSymbol';
import { UI_TEXTS, MESSAGES, DEDICATION_CONFIG, PHOTO_CONFIG, CAKE_PRICING, CAKE_CONDIMENTO_CONFIG, CAKE_VARIEGATURA_CONFIG, CAKE_FINITURA_CONFIG, CAKE_LACTOSE_FREE_CONFIG } from '@/config/appConfig';
import { useOrder } from '@/contexts/OrderContext';

export default function CustomizeCakeScreen() {
  const router = useRouter();
  const { cakeConfig, updateCakeConfig, getCakePrice } = useOrder();
  
  const [config, setConfig] = useState<CakeConfiguration>(cakeConfig);

  const updateConfig = (updates: Partial<CakeConfiguration>) => {
    const newConfig = { ...config, ...updates };
    
    // Se cambia la base, resetta cream o meringaFilling appropriatamente
    if (updates.base !== undefined) {
      if (updates.base === 'meringa') {
        newConfig.cream = null;
        newConfig.creamFirstLayer = null;
        newConfig.creamSecondLayer = null;
        newConfig.variegatura = 'nessuna';
        if (!newConfig.meringaFilling) {
          newConfig.meringaFilling = null;
        }
      } else {
        newConfig.meringaFilling = null;
        if (!newConfig.creamFirstLayer) {
          newConfig.creamFirstLayer = null;
        }
        if (!newConfig.creamSecondLayer) {
          newConfig.creamSecondLayer = null;
        }
      }
    }

    // Gestisci il cambio dell'opzione senza lattosio
    if (updates.lactoseFree === 'senza_lattosio' && config.lactoseFree !== 'senza_lattosio') {
      Alert.alert(
        MESSAGES.warnings.lactoseFreeWarning,
        MESSAGES.warnings.lactoseFreeWarningDescription
      );
    }
    
    setConfig(newConfig);
    updateCakeConfig(newConfig);
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

  const isMeringa = config.base === 'meringa';
  const canProceed = config.base && config.numberOfPeople > 0 && 
    (isMeringa ? config.meringaFilling : (config.creamFirstLayer && config.creamSecondLayer));

  const handleContinue = () => {
    if (!canProceed) {
      Alert.alert(
        MESSAGES.errors.incompleteConfiguration,
        MESSAGES.errors.incompleteConfigurationDescription
      );
      return;
    }
    
    console.log('Cake configuration:', config);
    console.log('Cake price:', getCakePrice());
    router.push({
      pathname: '/(tabs)/(home)/products',
      params: { cakeConfigured: 'true' }
    });
  };

  const renderSummary = () => {
    if (!config.base && !config.creamFirstLayer && !config.creamSecondLayer && !config.meringaFilling) return null;

    const totalWeightKg = (config.numberOfPeople * GRAMS_PER_PERSON) / 1000;
    const basePrice = totalWeightKg * CAKE_PRICING.pricePerKg;
    
    const variegaturaOption = CAKE_VARIEGATURA_CONFIG.find(v => v.value === config.variegatura);
    const variegaturaPrice = (!isMeringa && variegaturaOption?.price) || 0;
    
    const finituraOption = CAKE_FINITURA_CONFIG.find(f => f.value === config.finitura);
    const finituraPrice = finituraOption?.price || 0;
    
    const lactoseFreeOption = CAKE_LACTOSE_FREE_CONFIG.find(l => l.value === config.lactoseFree);
    const lactoseFreePrice = lactoseFreeOption?.price || 0;
    
    const photoPrice = config.photoUri ? CAKE_PRICING.photoSurcharge : 0;

    const differentCreamsPrice = (config.creamFirstLayer && config.creamSecondLayer && 
      config.creamFirstLayer !== config.creamSecondLayer) ? CAKE_PRICING.differentCreamsSurcharge : 0;

    return (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{UI_TEXTS.customizeCake.preview}</Text>
        
        {config.base && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base:</Text>
            <Text style={styles.summaryValue}>
              {CAKE_BASES.find(b => b.value === config.base)?.label}
            </Text>
          </View>
        )}
        
        {isMeringa && config.meringaFilling && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ripieno:</Text>
            <Text style={styles.summaryValue}>
              {MERINGA_FILLINGS.find(f => f.value === config.meringaFilling)?.label}
            </Text>
          </View>
        )}
        
        {!isMeringa && config.creamFirstLayer && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Crema Primo Strato:</Text>
            <Text style={styles.summaryValue}>
              {CAKE_CREAMS.find(c => c.value === config.creamFirstLayer)?.label}
            </Text>
          </View>
        )}

        {!isMeringa && config.creamSecondLayer && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Crema Secondo Strato:</Text>
            <Text style={styles.summaryValue}>
              {CAKE_CREAMS.find(c => c.value === config.creamSecondLayer)?.label}
            </Text>
          </View>
        )}

        {differentCreamsPrice > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Due Creme Diverse:</Text>
            <Text style={styles.summaryValue}>+€{differentCreamsPrice.toFixed(2)}</Text>
          </View>
        )}

        {config.condimento !== 'nessuno' && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Condimento:</Text>
            <Text style={styles.summaryValue}>
              {CAKE_CONDIMENTO_CONFIG.find(c => c.value === config.condimento)?.label}
            </Text>
          </View>
        )}
        
        {!isMeringa && config.variegatura !== 'nessuna' && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Variegatura:</Text>
            <Text style={styles.summaryValue}>
              {CAKE_VARIEGATURA_CONFIG.find(v => v.value === config.variegatura)?.label}
              {variegaturaPrice > 0 && ` (+€${variegaturaPrice.toFixed(2)})`}
            </Text>
          </View>
        )}
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Finitura:</Text>
          <Text style={styles.summaryValue}>
            {finituraOption?.label}
            {finituraPrice > 0 && ` (+€${finituraPrice.toFixed(2)})`}
          </Text>
        </View>
        
        {config.lactoseFree === 'senza_lattosio' && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Crema Senza Lattosio:</Text>
            <Text style={styles.summaryValue}>
              Sì (+€{lactoseFreePrice.toFixed(2)})
            </Text>
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
          <Text style={styles.summaryTotalValue}>€{getCakePrice().toFixed(2)}</Text>
        </View>
        
        <Text style={styles.priceBreakdown}>
          Base: €{basePrice.toFixed(2)}
          {variegaturaPrice > 0 && ` + Variegatura: €${variegaturaPrice.toFixed(2)}`}
          {finituraPrice > 0 && ` + Finitura: €${finituraPrice.toFixed(2)}`}
          {lactoseFreePrice > 0 && ` + Senza Lattosio: €${lactoseFreePrice.toFixed(2)}`}
          {differentCreamsPrice > 0 && ` + Due Creme: €${differentCreamsPrice.toFixed(2)}`}
          {photoPrice > 0 && ` + Foto: €${photoPrice.toFixed(2)}`}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: UI_TEXTS.customizeCake.title,
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
        <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.chooseBase}</Text>
        <OptionSelector
          title=""
          options={CAKE_BASES}
          selectedValue={config.base}
          onSelect={(value) => updateConfig({ base: value as any })}
        />

        {isMeringa ? (
          <>
            <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.chooseMeringaFilling}</Text>
            <OptionSelector
              title=""
              options={MERINGA_FILLINGS}
              selectedValue={config.meringaFilling}
              onSelect={(value) => updateConfig({ meringaFilling: value as any })}
            />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.chooseCream}</Text>
            
            <Text style={styles.subSectionTitle}>{UI_TEXTS.customizeCake.firstLayer}</Text>
            <OptionSelector
              title=""
              options={CAKE_CREAMS}
              selectedValue={config.creamFirstLayer}
              onSelect={(value) => updateConfig({ creamFirstLayer: value as any })}
            />

            <Text style={styles.subSectionTitle}>{UI_TEXTS.customizeCake.secondLayer}</Text>
            <OptionSelector
              title=""
              options={CAKE_CREAMS}
              selectedValue={config.creamSecondLayer}
              onSelect={(value) => updateConfig({ creamSecondLayer: value as any })}
            />

            {config.creamFirstLayer && config.creamSecondLayer && 
             config.creamFirstLayer !== config.creamSecondLayer && (
              <View style={styles.infoBox}>
                <IconSymbol name="info.circle" size={20} color={colors.primary} />
                <Text style={styles.infoText}>
                  Due creme diverse: +€{CAKE_PRICING.differentCreamsSurcharge.toFixed(2)}
                </Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.chooseCondimento}</Text>
            <View style={styles.optionsGrid}>
              {CAKE_CONDIMENTO_CONFIG.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    config.condimento === option.value && styles.optionCardSelected
                  ]}
                  onPress={() => updateConfig({ condimento: option.value as any })}
                >
                  <Text style={[
                    styles.optionLabel,
                    config.condimento === option.value && styles.optionLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.chooseVariegatura}</Text>
            <View style={styles.optionsGrid}>
              {CAKE_VARIEGATURA_CONFIG.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    config.variegatura === option.value && styles.optionCardSelected
                  ]}
                  onPress={() => updateConfig({ variegatura: option.value as any })}
                >
                  <Text style={[
                    styles.optionLabel,
                    config.variegatura === option.value && styles.optionLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  {option.price > 0 && (
                    <Text style={styles.optionPrice}>+€{option.price.toFixed(2)}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.chooseFinitura}</Text>
        <View style={styles.optionsGrid}>
          {CAKE_FINITURA_CONFIG.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.finituraCard,
                config.finitura === option.value && styles.finituraCardSelected
              ]}
              onPress={() => updateConfig({ finitura: option.value as any })}
            >
              {option.color && (
                <View style={[styles.colorIndicator, { backgroundColor: option.color }]} />
              )}
              <View style={styles.finituraContent}>
                <Text style={[
                  styles.finituraLabel,
                  config.finitura === option.value && styles.finituraLabelSelected
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.finituraDescription,
                  config.finitura === option.value && styles.finituraDescriptionSelected
                ]}>
                  {option.description}
                </Text>
              </View>
              {config.finitura === option.value && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.chooseLactoseFree}</Text>
        <View style={styles.optionsGrid}>
          {CAKE_LACTOSE_FREE_CONFIG.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionCard,
                config.lactoseFree === option.value && styles.optionCardSelected
              ]}
              onPress={() => updateConfig({ lactoseFree: option.value as any })}
            >
              <Text style={[
                styles.optionLabel,
                config.lactoseFree === option.value && styles.optionLabelSelected
              ]}>
                {option.label}
              </Text>
              {option.price > 0 && (
                <Text style={styles.optionPrice}>+€{option.price.toFixed(2)}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.numberOfPeople}</Text>
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

        <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.dedication}</Text>
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

        <Text style={styles.sectionTitle}>{UI_TEXTS.customizeCake.photo}</Text>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <IconSymbol name="photo" size={32} color={colors.primary} />
          <Text style={styles.photoButtonText}>
            {config.photoUri ? UI_TEXTS.customizeCake.changePhoto : UI_TEXTS.customizeCake.addPhoto}
          </Text>
          <Text style={styles.photoSurcharge}>+€{CAKE_PRICING.photoSurcharge.toFixed(2)}</Text>
        </TouchableOpacity>

        {renderSummary()}

        <TouchableOpacity
          style={[styles.continueButton, !canProceed && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canProceed}
        >
          <Text style={styles.continueButtonText}>{UI_TEXTS.customizeCake.continueButton}</Text>
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
  subSectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    minWidth: '48%',
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  optionPrice: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  finituraCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: colors.background,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
    elevation: 1,
    marginBottom: 8,
    width: '100%',
  },
  finituraCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  colorIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.textSecondary + '40',
  },
  finituraContent: {
    flex: 1,
  },
  finituraLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  finituraLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  finituraDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  finituraDescriptionSelected: {
    color: colors.text,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
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
