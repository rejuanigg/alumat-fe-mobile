import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, sizes, type } from '../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'destructiveSoft';

type Props = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  large?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

const palette: Record<ButtonVariant, { bg: string; fg: string }> = {
  primary: { bg: colors.blue, fg: colors.white },
  secondary: { bg: colors.tintBlue, fg: colors.link },
  destructive: { bg: colors.error, fg: colors.white },
  destructiveSoft: { bg: colors.errorBg, fg: colors.error },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  large = false,
  loading = false,
  disabled = false,
  style,
  accessibilityHint,
}: Props) {
  const p = palette[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: p.bg, height: large ? sizes.buttonLarge : sizes.field },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <Text style={[type.button, { color: p.fg }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function ButtonSecondary(props: Omit<Props, 'variant'>) {
  return <Button {...props} variant="secondary" />;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
