import React from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';

import { TENANT } from '../../config/tenantConfig';
import { softShadow } from '../../theme/shadows';

const COLORS = TENANT.colors;

// ---------------------------------------------------------------------------
// Botón principal en píldora. Mientras `loading` muestra el indicador de
// actividad con `loadingTitle` y no acepta nuevos toques.
// ---------------------------------------------------------------------------
export default function PrimaryButton({
  title,
  loadingTitle,
  loading = false,
  disabled = false,
  onPress,
  Icon,
  style,
}) {
  const inactive = loading || disabled;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        (inactive || pressed) && styles.buttonPressed,
        style,
      ]}
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={loading ? loadingTitle : title}
      accessibilityState={{ disabled: inactive, busy: loading }}
    >
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={COLORS.white} /> : null}
        <Text style={styles.text}>{loading ? loadingTitle : title}</Text>
        {!loading && Icon ? (
          <Icon size={22} color={COLORS.white} strokeWidth={2.25} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '78%',
    alignSelf: 'center',
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 14,
    ...softShadow(0.2),
  },

  buttonPressed: {
    opacity: 0.85,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  text: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '700',
  },
});
