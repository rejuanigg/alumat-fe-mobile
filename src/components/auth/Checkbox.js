import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

import { TENANT } from '../../config/tenantConfig';

const COLORS = TENANT.colors;

// ---------------------------------------------------------------------------
// Casilla de selección con texto. Toda la fila es tocable (mín. 48 dp de alto).
// ---------------------------------------------------------------------------
export default function Checkbox({ label, hint, checked, onChange, style }) {
  return (
    <Pressable
      style={[styles.row, style]}
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      accessibilityHint={hint}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Check size={16} color={COLORS.white} strokeWidth={3} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: 48,
    paddingHorizontal: 14,
  },

  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  boxChecked: {
    backgroundColor: COLORS.primary,
  },

  label: {
    fontSize: 15,
    color: COLORS.title,
  },
});
