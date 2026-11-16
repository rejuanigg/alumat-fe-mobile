import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

import { TENANT } from '../../config/tenantConfig';

const COLORS = TENANT.colors;

// ---------------------------------------------------------------------------
// Notificación integrada para errores generales (autenticación, conexión).
// Queda visible hasta que el usuario actúe: no es un toast ni una alerta.
// El ícono acompaña al texto para no depender solo del color.
// - actionLabel / onAction: acción opcional, p. ej. "Reintentar"
// ---------------------------------------------------------------------------
export default function ErrorBanner({ message, actionLabel, onAction }) {
  if (!message) return null;

  return (
    <View
      style={styles.banner}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.row}>
        <AlertCircle size={18} color={COLORS.error} strokeWidth={2} />
        <Text style={styles.text}>{message}</Text>
      </View>

      {actionLabel && onAction ? (
        <Pressable
          style={styles.action}
          onPress={onAction}
          accessibilityRole="button"
          hitSlop={12}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  text: {
    flex: 1,
    color: COLORS.error,
    fontSize: 14,
    lineHeight: 20,
  },

  action: {
    alignSelf: 'flex-end',
    marginTop: 6,
    paddingVertical: 4,
  },

  actionText: {
    color: COLORS.link,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
