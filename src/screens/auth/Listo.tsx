import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Logo } from '../../components/Logo';
import { Panes } from '../../components/Panes';
import { Wave } from '../../components/Wave';
import type { AuthStackParamList } from '../../navigation/types';
import { colors, spacing, type } from '../../theme/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'Listo'>;

const COPY = {
  registro: 'Tu cuenta se creó correctamente. Ya podés iniciar sesión con tu correo y contraseña.',
  reset: 'Tu contraseña se actualizó. Ya podés iniciar sesión con la nueva.',
} as const;

export function Listo({ navigation, route }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // ~560 en el diseño; en pantallas bajas deja lugar al botón.
  const heroHeight = Math.min(560, height - insets.top - insets.bottom - 150) + insets.top;

  return (
    <View style={styles.root}>
      <View style={[styles.hero, { height: heroHeight, paddingTop: insets.top + spacing.md }]}>
        <Panes width={width} height={heroHeight} scale={1.15} />
        <Logo inverted />
        <View style={styles.message}>
          <View style={styles.check}>
            <Icon name="check" size={38} color={colors.white} strokeWidth={3} />
          </View>
          <Text style={[type.display, styles.title]} accessibilityRole="header">
            {'¡Todo\nlisto!'}
          </Text>
          <Text style={[type.bodyLarge, styles.text]}>{COPY[route.params.from]}</Text>
        </View>
        <Wave />
      </View>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Button
          title="Ir a iniciar sesión"
          large
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  hero: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.screen,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  message: { gap: spacing.md },
  check: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.successCheck,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: { color: colors.white },
  text: { color: colors.navySoft, maxWidth: 320 },
  bottom: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: spacing.screen, paddingTop: spacing.xl },
});
