
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface Option {
  value: string;
  label: string;
}

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export default function OptionSelector({ title, options, selectedValue, onSelect }: OptionSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                selectedValue === option.value && styles.optionButtonSelected,
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedValue === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  optionsScroll: {
    flexGrow: 0,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.textSecondary,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
});
