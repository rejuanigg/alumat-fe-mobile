import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '../theme/tokens';

/** Dos (o más) columnas de igual ancho, p. ej. Nombre/Apellido o Precio/Stock. */
export function Columns({ children }: { children: ReactNode }) {
  return (
    <View style={styles.row}>
      {Children.map(children, (child) => (
        <View style={styles.col}>{child}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  col: { flex: 1, minWidth: 0 },
});
