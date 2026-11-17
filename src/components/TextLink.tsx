import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, sizes, type } from '../theme/tokens';

type Props = {
  /** Texto previo sin acción (ej. "¿No tenés cuenta?"). */
  prefix?: string;
  title: string;
  onPress: () => void;
  align?: 'center' | 'left' | 'right';
};

export function TextLink({ prefix, title, onPress, align = 'center' }: Props) {
  const justify = align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end';
  return (
    <View style={[styles.row, { justifyContent: justify }]}>
      {prefix ? <Text style={[type.body, styles.prefix]}>{prefix} </Text> : null}
      <Pressable onPress={onPress} accessibilityRole="link" accessibilityLabel={title} style={styles.hit} hitSlop={4}>
        <Text style={[type.body, styles.link]}>{title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  prefix: { color: colors.muted },
  hit: { minHeight: sizes.touch, justifyContent: 'center' },
  link: { color: colors.link, fontFamily: fonts.bold },
});
