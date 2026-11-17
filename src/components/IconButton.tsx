import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, sizes } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

type Props = {
  icon: IconName;
  label: string;
  onPress: () => void;
  color?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
};

/** Botón de ícono con zona táctil de 44×44. */
export function IconButton({ icon, label, onPress, color = colors.ink, background, style, iconSize = 22 }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,
        background ? { backgroundColor: background } : null,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon name={icon} color={color} size={iconSize} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
});
