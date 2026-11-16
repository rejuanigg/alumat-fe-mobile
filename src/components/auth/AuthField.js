import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

import { TENANT } from '../../config/tenantConfig';
import { softShadow } from '../../theme/shadows';

const COLORS = TENANT.colors;

// ---------------------------------------------------------------------------
// Campo en píldora: ícono, etiqueta siempre visible, TextInput y mensaje de
// error debajo. El resto de las props van directo al TextInput.
// - right: contenido extra a la derecha (p. ej. el botón del ojo)
// - compact: píldora más baja para formularios largos (SignUp)
// - inputRef: ref del TextInput (para mover el foco)
// ---------------------------------------------------------------------------
export default function AuthField({
  Icon,
  label,
  error,
  right,
  compact = false,
  inputRef,
  style,
  ...inputProps
}) {
  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact, style]}>
      <View
        style={[
          styles.pill,
          compact && styles.pillCompact,
          error ? styles.pillError : null,
        ]}
      >
        <View
          style={[styles.iconCircle, compact && styles.iconCircleCompact]}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          <Icon size={compact ? 20 : 22} color={COLORS.title} strokeWidth={1.75} />
        </View>

        <View style={styles.body}>
          {/* La etiqueta ya la lee el TextInput; se oculta para no repetirla */}
          <Text
            style={[styles.label, compact && styles.labelCompact]}
            importantForAccessibility="no"
            accessibilityElementsHidden
          >
            {label}
          </Text>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholderTextColor={COLORS.text}
            accessibilityLabel={label}
            accessibilityHint={error || undefined}
            {...inputProps}
          />
        </View>

        {right}
      </View>

      {/* Ícono + texto: el error no se comunica solo con el color */}
      {error ? (
        <View
          style={styles.errorRow}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          <AlertCircle size={14} color={COLORS.error} strokeWidth={2.25} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  wrapperCompact: {
    marginBottom: 14,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 18,
    ...softShadow(0.06),
  },
  pillCompact: {
    paddingVertical: 9,
    paddingLeft: 12,
  },
  pillError: {
    borderColor: COLORS.error,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  body: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 2,
  },
  labelCompact: {
    fontSize: 12,
  },

  input: {
    fontSize: 17,
    color: COLORS.title,
    paddingVertical: 0,
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
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
