import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, fonts, type } from '../theme/tokens';

/** Texto explicativo en `muted`; `<Strong>` resalta partes en `ink`. */
export function Paragraph({ children }: { children: ReactNode }) {
  return <Text style={[type.bodyLarge, styles.text]}>{children}</Text>;
}

export function Strong({ children }: { children: ReactNode }) {
  return <Text style={styles.strong}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: { color: colors.muted },
  strong: { color: colors.ink, fontFamily: fonts.bold },
});
