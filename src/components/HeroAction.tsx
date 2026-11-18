import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, sizes, type } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

type Props = { title: string; icon?: IconName; onPress: () => void };

/** Botón blanco compacto para la barra superior del hero (ej. "Nuevo"). */
export function HeroAction({ title, icon = 'plus', onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
    >
      <Icon name={icon} color={colors.navy} size={18} strokeWidth={2.6} />
      <Text style={[type.button, styles.text]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: sizes.touch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: radii.button,
    backgroundColor: colors.white,
  },
  pressed: { opacity: 0.85 },
  text: { color: colors.navy, fontSize: 15 },
});
