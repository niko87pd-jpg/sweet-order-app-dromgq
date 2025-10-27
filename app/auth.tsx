
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { UI_TEXTS, MESSAGES, PASTRY_INFO } from '@/config/appConfig';
import { UserRegistration } from '@/types/order';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, isSupabaseEnabled } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState<UserRegistration>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async () => {
    // Validate form
    if (!isLogin) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        Alert.alert('Errore', 'Compila tutti i campi obbligatori');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Errore', 'Inserisci un indirizzo email valido');
        return;
      }

      // Basic phone validation
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        Alert.alert('Errore', 'Inserisci un numero di telefono valido (10 cifre)');
        return;
      }

      if (!password || password.length < 6) {
        Alert.alert('Errore', 'La password deve essere di almeno 6 caratteri');
        return;
      }

      if (!isSupabaseEnabled) {
        Alert.alert(
          'Supabase Non Configurato',
          'Per registrarti, è necessario configurare Supabase. Contatta l\'amministratore.',
        );
        return;
      }

      setLoading(true);
      const { error } = await signUp(formData.email, password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      setLoading(false);

      if (error) {
        Alert.alert('Errore', error.message || 'Impossibile completare la registrazione');
        return;
      }

      Alert.alert(
        MESSAGES.success.registrationSuccess,
        'Il tuo account è stato creato con successo! Ora puoi effettuare il login.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsLogin(true);
              setPassword('');
            },
          },
        ]
      );
    } else {
      if (!formData.email) {
        Alert.alert('Errore', 'Inserisci la tua email');
        return;
      }

      if (!password) {
        Alert.alert('Errore', 'Inserisci la tua password');
        return;
      }

      if (!isSupabaseEnabled) {
        Alert.alert(
          'Supabase Non Configurato',
          'Per accedere, è necessario configurare Supabase. Contatta l\'amministratore.',
        );
        return;
      }

      setLoading(true);
      const { error } = await signIn(formData.email, password);
      setLoading(false);

      if (error) {
        Alert.alert('Errore', error.message || 'Email o password non corretti');
        return;
      }

      router.replace('/(tabs)/(home)/');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: isLogin ? UI_TEXTS.auth.loginTitle : UI_TEXTS.auth.registerTitle,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerBackTitle: 'Indietro',
        }}
      />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <IconSymbol name="person.circle" size={80} color={colors.primary} />
          <Text style={styles.title}>
            {isLogin ? UI_TEXTS.auth.loginTitle : UI_TEXTS.auth.registerTitle}
          </Text>
          <Text style={styles.subtitle}>{PASTRY_INFO.name}</Text>
        </View>

        <View style={styles.formCard}>
          {!isLogin && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{UI_TEXTS.auth.firstName}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mario"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{UI_TEXTS.auth.lastName}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rossi"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                  autoCapitalize="words"
                />
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{UI_TEXTS.auth.email}</Text>
            <TextInput
              style={styles.input}
              placeholder="mario.rossi@email.com"
              placeholderTextColor={colors.textSecondary}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{UI_TEXTS.auth.phone}</Text>
              <TextInput
                style={styles.input}
                placeholder="3471234567"
                placeholderTextColor={colors.textSecondary}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Inserisci la tua password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  {isLogin ? UI_TEXTS.auth.loginButton : UI_TEXTS.auth.registerButton}
                </Text>
                <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchButtonText}>
              {isLogin ? UI_TEXTS.auth.switchToRegister : UI_TEXTS.auth.switchToLogin}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <IconSymbol name="info.circle" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Registrandoti potrai salvare i tuoi ordini e ricevere notifiche sullo stato della preparazione.
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.highlight,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.3)',
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  switchButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
