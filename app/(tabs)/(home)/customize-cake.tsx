
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/styles/commonStyles';
import { CakeConfiguration, CAKE_BASES, CAKE_CREAMS, BASE_CAKE_PRICE, PRICE_PER_100G, GRAMS_PER_PERSON } from '@/types/order';
import OptionSelector from '@/components/OptionSelector';
import CakePreview from '@/components/CakePreview';
import { IconSymbol } from '@/components/IconSymbol';

export default function CustomizeCakeScreen() {
  const router = useRouter();
  const [config, setConfig] = useState<CakeConfiguration>({
    base: null,
    cream: null,
    numberOfPeople: 4,
    dedication: '',
    photoUri: null,
  });

  const updateConfig = (updates: Partial<CakeConfiguration>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permesso Negato', 'È necessario il permesso per accedere alla galleria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateConfig({ photoUri: result.assets[0].uri });
    }
  };

  const calculatePrice = () => {
    const totalWeight = config.numberOfPeople * GRAMS_PER_PERSON;
    const weightPrice = (totalWeight / 100) * PRICE_PER_100G;
    return BASE_CAKE_PRICE + weightPrice;
  };

  const canProceed = config.base && config.cream && config.numberOfPeople > 0;

  const handleContinue = () => {
    if (!canProceed) {
      Alert.alert('Configurazione Incompleta', 'Seleziona base e crema per continuare');
      return;
    }
    
    // Store config in a context or pass via params
    router.push({
      pathname: '/(tabs)/(home)/products',
      params: { cakeConfigured: 'true' }
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Personalizza il Tuo Dolce',
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
        <Text style={styles.sectionTitle}>Scegli la Base</Text>
        <OptionSelector
          title=""
          options={CAKE_BASES}
          selectedValue={config.base}
          onSelect={(value) => updateConfig({ base: value as any })}
        />

        <Text style={styles.sectionTitle}>Scegli la Crema</Text>
        <OptionSelector
          title=""
          options={CAKE_CREAMS}
          selectedValue={config.cream}
          onSelect={(value) => updateConfig({ cream: value as any })}
        />

        <Text style={styles.sectionTitle}>Numero di Persone</Text>
        <View style={styles.peopleSelector}>
          <TouchableOpacity
            style={styles.peopleButton}
            onPress={() => updateConfig({ numberOfPeople: Math.max(1, config.numberOfPeople - 1) })}
          >
            <IconSymbol name="minus" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.peopleDisplay}>
            <Text style={styles.peopleNumber}>{config.numberOfPeople}</Text>
            <Text style={styles.peopleLabel}>persone</Text>
            <Text style={styles.weightLabel}>
              ({config.numberOfPeople * GRAMS_PER_PERSON}g totali)
            </Text>
          </View>
          <TouchableOpacity
            style={styles.peopleButton}
            onPress={() => updateConfig({ numberOfPeople: config.numberOfPeople + 1 })}
          >
            <IconSymbol name="plus" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Dedica sul Dolce</Text>
        <TextInput
          style={styles.input}
          placeholder="Es: Buon Compleanno Maria!"
          placeholderTextColor={colors.textSecondary}
          value={config.dedication}
          onChangeText={(text) => updateConfig({ dedication: text })}
          maxLength={50}
        />
        <Text style={styles.charCount}>{config.dedication.length}/50 caratteri</Text>

        <Text style={styles.sectionTitle}>Foto sul Dolce (Opzionale)</Text>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <IconSymbol name="photo" size={32} color={colors.primary} />
          <Text style={styles.photoButtonText}>
            {config.photoUri ? 'Cambia Foto' : 'Aggiungi Foto'}
          </Text>
        </TouchableOpacity>

        {(config.base || config.cream) && (
          <View style={styles.previewSection}>
            <CakePreview config={config} />
          </View>
        )}

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Prezzo Dolce Personalizzato</Text>
          <Text style={styles.priceValue}>€{calculatePrice().toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !canProceed && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canProceed}
        >
          <Text style={styles.continueButtonText}>Continua con Altri Prodotti</Text>
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
  previewSection: {
    marginVertical: 20,
  },
  priceCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
    boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.3)',
    elevation: 4,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
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
