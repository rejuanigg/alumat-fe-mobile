import type { ReactNode } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, type } from '../theme/tokens';
import { IconButton } from './IconButton';
import { Logo } from './Logo';
import { Panes } from './Panes';
import { Wave } from './Wave';

type Props = {
  /** Alto de diseño del hero (sin contar el área segura superior). */
  height: number;
  title?: string;
  onBack?: () => void;
  /** Reemplaza al logo en la esquina superior derecha. */
  right?: ReactNode;
  showLogo?: boolean;
  /** Contenido extra entre la barra superior y el título. */
  children?: ReactNode;
  titleStyle?: 'title34' | 'title40' | 'display';
  /** Color de la Wave: blanco en formularios, bg en pantallas internas. */
  waveColor?: string;
  showWave?: boolean;
  /** Margen inferior extra para el contenido superpuesto. */
  bottomSpace?: number;
};

export function Hero({
  height,
  title,
  onBack,
  right,
  showLogo = true,
  children,
  titleStyle = 'title34',
  waveColor = colors.surface,
  showWave = true,
  bottomSpace = 52,
}: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const total = height + insets.top;
  return (
    <View style={[styles.hero, { minHeight: total, paddingTop: insets.top + spacing.xs }]}>
      <Panes width={width} height={total} />
      <View style={styles.topBar}>
        {onBack ? (
          <IconButton icon="back" label="Volver" onPress={onBack} color={colors.white} iconSize={24} />
        ) : (
          <View style={styles.spacer} />
        )}
        {right ?? (showLogo ? <Logo inverted /> : null)}
      </View>
      <View style={[styles.content, { paddingBottom: bottomSpace }]}>
        {children}
        {title ? (
          <Text style={[type[titleStyle], styles.title]} accessibilityRole="header">
            {title}
          </Text>
        ) : null}
      </View>
      {showWave ? <Wave color={waveColor} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.navy,
    overflow: 'visible',
    zIndex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.xs,
    paddingRight: spacing.lg,
    minHeight: 44,
  },
  spacer: { width: 44, height: 44 },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.screen,
  },
  title: { color: colors.white },
});
