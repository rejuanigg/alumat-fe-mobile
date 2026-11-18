import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, type } from '../theme/tokens';

type Props = { label: string; value: string };

/** Fila etiqueta/valor para tarjetas (las filas se separan con gap: 1 sobre fondo `line`). */
export function ListRow({ label, value }: Props) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={[type.label, styles.label]}>{label}</Text>
      <Text style={[type.bodyLarge, styles.value]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: 14, gap: 2 },
  label: { color: colors.muted },
  value: { color: colors.ink },
});
