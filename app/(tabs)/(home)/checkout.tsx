
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Linking, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as MailComposer from 'expo-mail-composer';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { UI_TEXTS, MESSAGES, PAYMENT_CONFIG, CAKE_BASES_CONFIG, CAKE_CREAMS_CONFIG, MERINGA_FILLINGS_CONFIG, CLASSIC_CAKES_CONFIG, GRAMS_PER_PERSON, PASTRY_INFO } from '@/config/appConfig';
import { useOrder } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function CheckoutScreen() {
  const router = useRouter();
  const { customer, isSupabaseEnabled } = useAuth();
  const { 
    cakeConfig, 
    classicCakeConfig,
    orderItems, 
    getCakePrice, 
    getClassicCakePrice,
    getProductsTotal, 
    getOrderTotal, 
    getDepositAmount,
    clearOrder,
    pickupDate,
    pickupTime,
    setPickupDate,
    setPickupTime,
    orderNotes,
    setOrderNotes,
  } = useOrder();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(pickupDate || new Date());
  const [tempTime, setTempTime] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 25); // Default to 25 hours from now
    return now;
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      setPickupDate(selectedDate);
      if (Platform.OS === 'android') {
        // On Android, close the picker after selection
        setShowDatePicker(false);
      }
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      return;
    }
    
    if (selectedTime) {
      setTempTime(selectedTime);
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setPickupTime(`${hours}:${minutes}`);
      if (Platform.OS === 'android') {
        // On Android, close the picker after selection
        setShowTimePicker(false);
      }
    }
  };

  const isValidPickupDateTime = (): boolean => {
    if (!pickupDate || !pickupTime) return false;
    
    const [hours, minutes] = pickupTime.split(':').map(Number);
    const pickupDateTime = new Date(pickupDate);
    pickupDateTime.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    const minPickupTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    return pickupDateTime >= minPickupTime;
  };

  const sendOrderEmail = async () => {
    try {
      // Build email body
      let emailBody = `Nuovo Ordine da ${customer?.first_name || 'Cliente'} ${customer?.last_name || ''}\n\n`;
      emailBody += `=== DETTAGLI CLIENTE ===\n`;
      emailBody += `Nome: ${customer?.first_name || 'N/A'} ${customer?.last_name || ''}\n`;
      emailBody += `Email: ${customer?.email || 'N/A'}\n`;
      emailBody += `Telefono: ${customer?.phone || 'N/A'}\n\n`;
      
      emailBody += `=== DETTAGLI ORDINE ===\n`;
      
      if (hasCustomCake) {
        emailBody += `\nDOLCE PERSONALIZZATO:\n`;
        emailBody += `Base: ${CAKE_BASES_CONFIG.find(b => b.value === cakeConfig.base)?.label}\n`;
        if (cakeConfig.base === 'meringa' && cakeConfig.meringaFilling) {
          emailBody += `Ripieno: ${MERINGA_FILLINGS_CONFIG.find(f => f.value === cakeConfig.meringaFilling)?.label}\n`;
        }
        if (cakeConfig.base !== 'meringa' && cakeConfig.creamFirstLayer) {
          emailBody += `Crema Primo Strato: ${CAKE_CREAMS_CONFIG.find(c => c.value === cakeConfig.creamFirstLayer)?.label}\n`;
          emailBody += `Crema Secondo Strato: ${CAKE_CREAMS_CONFIG.find(c => c.value === cakeConfig.creamSecondLayer)?.label}\n`;
        }
        emailBody += `Persone: ${cakeConfig.numberOfPeople} (${((cakeConfig.numberOfPeople * GRAMS_PER_PERSON) / 1000).toFixed(2)}kg)\n`;
        if (cakeConfig.dedication) {
          emailBody += `Dedica: "${cakeConfig.dedication}"\n`;
        }
        if (cakeConfig.photoUri) {
          emailBody += `Foto: Sì\n`;
        }
        emailBody += `Prezzo: €${getCakePrice().toFixed(2)}\n`;
      }
      
      if (hasClassicCake) {
        emailBody += `\nDOLCE CLASSICO:\n`;
        emailBody += `Dolce: ${CLASSIC_CAKES_CONFIG.find(c => c.value === classicCakeConfig.cakeType)?.label}\n`;
        emailBody += `Persone: ${classicCakeConfig.numberOfPeople} (${((classicCakeConfig.numberOfPeople * GRAMS_PER_PERSON) / 1000).toFixed(2)}kg)\n`;
        if (classicCakeConfig.dedication) {
          emailBody += `Dedica: "${classicCakeConfig.dedication}"\n`;
        }
        if (classicCakeConfig.photoUri) {
          emailBody += `Foto: Sì\n`;
        }
        emailBody += `Prezzo: €${getClassicCakePrice().toFixed(2)}\n`;
      }
      
      if (orderItems.length > 0) {
        emailBody += `\nPRODOTTI AGGIUNTIVI:\n`;
        orderItems.forEach(item => {
          emailBody += `- ${item.product.name} x${item.quantity} = €${(item.product.price * item.quantity).toFixed(2)}\n`;
        });
      }
      
      if (orderNotes) {
        emailBody += `\nNOTE DEL CLIENTE:\n${orderNotes}\n`;
      }
      
      emailBody += `\n=== RITIRO ===\n`;
      emailBody += `Data: ${pickupDate?.toLocaleDateString('it-IT')}\n`;
      emailBody += `Ora: ${pickupTime}\n\n`;
      
      emailBody += `=== TOTALI ===\n`;
      emailBody += `Totale Ordine: €${getOrderTotal().toFixed(2)}\n`;
      emailBody += `Acconto Pagato: €${getDepositAmount().toFixed(2)}\n`;
      emailBody += `Rimanente: €${(getOrderTotal() - getDepositAmount()).toFixed(2)}\n`;

      // Send email
      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: ['duemondi87@gmail.com'],
          subject: `Nuovo Ordine - ${customer?.first_name || 'Cliente'} ${customer?.last_name || ''}`,
          body: emailBody,
        });
      } else {
        console.log('Email not available, order details:', emailBody);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert(
        MESSAGES.errors.selectPaymentMethod,
        MESSAGES.errors.selectPaymentMethodDescription
      );
      return;
    }

    if (!pickupDate || !pickupTime) {
      Alert.alert(
        MESSAGES.errors.selectPickupDateTime,
        MESSAGES.errors.selectPickupDateTimeDescription
      );
      return;
    }

    if (!isValidPickupDateTime()) {
      Alert.alert(
        MESSAGES.errors.minimumNoticeRequired,
        MESSAGES.errors.minimumNoticeRequiredDescription
      );
      return;
    }

    console.log('Processing payment with method:', selectedPaymentMethod);
    console.log('Order total:', getOrderTotal());
    console.log('Deposit amount:', getDepositAmount());
    console.log('Pickup date:', pickupDate);
    console.log('Pickup time:', pickupTime);
    console.log('Order notes:', orderNotes);

    // Save order to database if Supabase is enabled
    if (isSupabaseEnabled && customer) {
      try {
        const { error } = await supabase.from('orders').insert({
          customer_id: customer.id,
          order_data: {
            cakeConfig,
            classicCakeConfig,
            orderItems,
          },
          total_amount: getOrderTotal(),
          deposit_amount: getDepositAmount(),
          status: 'pending',
          pickup_date: pickupDate?.toISOString(),
          pickup_time: pickupTime,
          notes: orderNotes,
        });

        if (error) {
          console.error('Error saving order:', error);
        }
      } catch (error) {
        console.error('Error saving order:', error);
      }
    }

    // Send email notification
    await sendOrderEmail();

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

  const handleOpenMap = () => {
    const address = encodeURIComponent(PASTRY_INFO.address);
    const label = encodeURIComponent(PASTRY_INFO.name);
    
    let url = '';
    if (Platform.OS === 'ios') {
      url = `maps://app?daddr=${address}&dirflg=d`;
    } else {
      url = `google.navigation:q=${address}`;
    }
    
    // Fallback to web maps if native app is not available
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(webUrl);
      }
    }).catch(() => {
      Linking.openURL(webUrl);
    });
  };

  const handleCallPhone = () => {
    const phoneUrl = `tel:${PASTRY_INFO.phone}`;
    Linking.canOpenURL(phoneUrl).then(supported => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Errore', 'Impossibile effettuare la chiamata');
      }
    }).catch(() => {
      Alert.alert('Errore', 'Impossibile effettuare la chiamata');
    });
  };

  const hasCustomCake = cakeConfig.base !== null;
  const hasClassicCake = classicCakeConfig.cakeType !== null;

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Seleziona data';
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

              {cakeConfig.base !== 'meringa' && cakeConfig.creamFirstLayer && (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Crema Primo Strato:</Text>
                    <Text style={styles.summaryValue}>
                      {CAKE_CREAMS_CONFIG.find(c => c.value === cakeConfig.creamFirstLayer)?.label}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Crema Secondo Strato:</Text>
                    <Text style={styles.summaryValue}>
                      {CAKE_CREAMS_CONFIG.find(c => c.value === cakeConfig.creamSecondLayer)?.label}
                    </Text>
                  </View>
                </>
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

          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Note</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Eventuali note sull'ordine..."
              placeholderTextColor={colors.textSecondary}
              value={orderNotes}
              onChangeText={setOrderNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.divider} />

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

        <View style={styles.dateTimeCard}>
          <Text style={styles.dateTimeTitle}>{UI_TEXTS.checkout.pickupDateTime}</Text>
          
          <View style={styles.bordeauxBox}>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <IconSymbol name="calendar" size={24} color="#FFFFFF" />
              <View style={styles.dateTimeContent}>
                <Text style={styles.dateTimeLabel}>{UI_TEXTS.checkout.selectDate}</Text>
                <Text style={styles.dateTimeValue}>{formatDate(pickupDate)}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <IconSymbol name="clock" size={24} color="#FFFFFF" />
              <View style={styles.dateTimeContent}>
                <Text style={styles.dateTimeLabel}>{UI_TEXTS.checkout.selectTime}</Text>
                <Text style={styles.dateTimeValue}>{pickupTime || 'Seleziona orario'}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.noticeBox}>
            <IconSymbol name="info.circle" size={20} color={colors.secondary} />
            <View style={styles.noticeTextContainer}>
              <Text style={styles.noticeText}>{UI_TEXTS.checkout.minimumNotice}</Text>
              <Text style={styles.urgencyText}>
                Per urgenze last minute chiamare al{' '}
                <Text style={styles.phoneLink} onPress={handleCallPhone}>
                  {PASTRY_INFO.phone}
                </Text>
                {' '}(in orario di apertura)
              </Text>
            </View>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={handleDateChange}
            minimumDate={new Date()}
            locale="it-IT"
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
            onChange={handleTimeChange}
            locale="it-IT"
            is24Hour={true}
          />
        )}

        <View style={styles.mapCard}>
          <Text style={styles.mapTitle}>Dove Siamo</Text>
          <View style={styles.mapPlaceholder}>
            <IconSymbol name="map" size={48} color={colors.primary} />
            <Text style={styles.mapText}>{PASTRY_INFO.name}</Text>
            <Text style={styles.mapAddress}>{PASTRY_INFO.address}</Text>
            <Text style={styles.mapNote}>
              Nota: Le mappe interattive non sono supportate su web in Natively.
              {'\n'}Usa il pulsante qui sotto per aprire il navigatore.
            </Text>
          </View>
          <TouchableOpacity style={styles.navigationButton} onPress={handleOpenMap}>
            <IconSymbol name="location.fill" size={24} color="#FFFFFF" />
            <Text style={styles.navigationButtonText}>Avvia Navigatore</Text>
          </TouchableOpacity>
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
          style={[
            styles.confirmButton, 
            (!selectedPaymentMethod || !pickupDate || !pickupTime || !isValidPickupDateTime()) && styles.confirmButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={!selectedPaymentMethod || !pickupDate || !pickupTime || !isValidPickupDateTime()}
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
  dateTimeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  dateTimeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  bordeauxBox: {
    backgroundColor: '#800020',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(128, 0, 32, 0.3)',
    elevation: 4,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 12,
  },
  dateTimeContent: {
    flex: 1,
    marginLeft: 12,
  },
  dateTimeLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 2,
    fontWeight: '600',
    opacity: 0.9,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.highlight,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  urgencyText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  phoneLink: {
    color: colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  mapCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  mapPlaceholder: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 200,
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  mapAddress: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  mapNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  navigationButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navigationButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
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
  notesSection: {
    marginTop: 16,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.highlight,
    minHeight: 100,
  },
});
