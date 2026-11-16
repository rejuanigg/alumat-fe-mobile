import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

import { TENANT } from '../../config/tenantConfig';
import { softShadow } from '../../theme/shadows';

const COLORS = TENANT.colors;

// ---------------------------------------------------------------------------
// Campo de formulario de productos: misma estética que AuthField (superficie,
// borde y sombra de la paleta), pero en tarjeta para admitir texto multilínea.
// El resto de las props van directo al TextInput.
// ---------------------------------------------------------------------------
export default function ProductField({ label, error, multiline, style, ...inputProps }) {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.box, error ? styles.boxError : null]}>
        {/* La etiqueta ya la lee el TextInput; se oculta para no repetirla */}
        <Text
          style={styles.label}
          importantForAccessibility="no"
          accessibilityElementsHidden
        >
          {label}
        </Text>
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor={COLORS.text}
          accessibilityLabel={label}
          accessibilityHint={error || undefined}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...inputProps}
        />
      </View>

      {/* Ícono + texto: el error no se comunica solo con el color */}
      {error ? (
        <View style={styles.errorRow} accessibilityLiveRegion="polite" accessibilityRole="alert">
          <AlertCircle size={14} color={COLORS.error} strokeWidth={2.25} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },

  box: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 20,
    ...softShadow(0.06),
  },
  boxError: {
    borderColor: COLORS.error,
  },

  label: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 2,
  },

  input: {
    fontSize: 17,
    color: COLORS.title,
    paddingVertical: 2,
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
  },
  inputMultiline: {
    minHeight: 88,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    marginLeft: 20,
  },

  errorText: {
    flexShrink: 1,
    color: COLORS.error,
    fontSize: 12,
  },
});
