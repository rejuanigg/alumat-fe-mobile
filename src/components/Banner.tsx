import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, type } from '../theme/tokens';
import { Icon } from './Icon';

type Props = {
  kind: 'success' | 'error';
  message: string;
};

export function Banner({ kind, message }: Props) {
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
});
