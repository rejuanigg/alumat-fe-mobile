import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { FormScreen } from '../../components/FormScreen';
import { Hero } from '../../components/Hero';
import { Paragraph, Strong } from '../../components/Paragraph';
import { TextLink } from '../../components/TextLink';
import type { AuthStackParamList } from '../../navigation/types';
import { authService } from '../../services/authService';
import { ServiceError } from '../../services/types';
import { colors, sizes, type } from '../../theme/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'Enviado'>;

const RESEND_SECONDS = 45;

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/** Confirmación de que Firebase envió el correo con el enlace para crear una contraseña nueva. */
export function Enviado({ navigation, route }: Props) {
  const { email } = route.params;
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const resend = async () => {
    setSending(true);
    setBanner(null);
    try {
      await authService.requestPasswordReset(email);
      setBanner({ kind: 'success', message: 'Te enviamos el correo de nuevo.' });
      setSeconds(RESEND_SECONDS);
    } catch (e) {
      setBanner({ kind: 'error', message: e instanceof ServiceError ? e.message : 'No pudimos reenviar el correo.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <FormScreen header={<Hero height={250} title={'Revisá tu\ncorreo'} onBack={navigation.goBack} />}>
      <Paragraph>
        Si <Strong>{email}</Strong> tiene una cuenta, te llega un correo con un enlace para crear una contraseña
        nueva. Abrilo, elegí la contraseña y después volvé a iniciar sesión.
      </Paragraph>
      <Paragraph>Si no lo ves en unos minutos, revisá la carpeta de spam o correo no deseado.</Paragraph>
      {banner ? <Banner kind={banner.kind} message={banner.message} /> : null}
      <Button title="Volver a iniciar sesión" large onPress={() => navigation.popTo('Login')} />
      <View style={styles.resend}>
        {seconds > 0 ? (
          <Text style={[type.body, styles.muted]} accessibilityLiveRegion="polite">
            Podés pedir otro correo en {mmss(seconds)}
          </Text>
        ) : (
          <TextLink
            prefix="¿No te llegó?"
            title={sending ? 'Enviando…' : 'Reenviar correo'}
            onPress={() => {
              if (!sending) void resend();
            }}
          />
        )}
        <TextLink title="Cambiar correo" onPress={navigation.goBack} />
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  resend: { alignItems: 'center' },
  muted: { color: colors.muted, minHeight: sizes.touch, paddingTop: 12 },
});
