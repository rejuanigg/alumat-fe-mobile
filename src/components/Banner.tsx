import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, sizes, spacing, type } from '../theme/tokens';
import { Icon } from './Icon';

export type BannerAction = {
  label: string;
  onPress: () => void;
  /** Muestra un indicador de carga y evita que se presione dos veces. */
  loading?: boolean;
  /** Texto que lee el lector de pantalla, si la etiqueta sola no alcanza. */
  accessibilityLabel?: string;
};

type Props = {
  kind: 'success' | 'error';
  message: string;
  action?: BannerAction;
};

export function Banner({ kind, message, action }: Props) {
  const fg = kind === 'success' ? colors.success : colors.error;
  const bg = kind === 'success' ? colors.successBg : colors.errorBg;
  return (
    <View
      style={[styles.banner, { backgroundColor: bg }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      {kind === 'success' ? <Icon name="check" color={fg} size={20} strokeWidth={2.4} /> : null}
      <Text style={[type.body, styles.text, { color: fg }]}>{message}</Text>
      {action ? (
        <Pressable
          onPress={action.onPress}
          disabled={action.loading}
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel ?? action.label}
          accessibilityState={{ busy: action.loading, disabled: action.loading }}
          hitSlop={4}
          style={styles.action}
        >
          {action.loading ? (
            <ActivityIndicator color={fg} />
          ) : (
            <Text style={[type.body, styles.actionText, { color: fg }]}>{action.label}</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.field,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: { flex: 1, fontFamily: type.label.fontFamily },
  action: { minHeight: sizes.touch, minWidth: sizes.touch, justifyContent: 'center', alignItems: 'center' },
  actionText: { fontFamily: fonts.bold, textDecorationLine: 'underline' },
});
