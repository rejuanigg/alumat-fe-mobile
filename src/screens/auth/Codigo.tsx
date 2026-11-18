import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { FormScreen } from '../../components/FormScreen';
import { Hero } from '../../components/Hero';
import { OtpInput } from '../../components/OtpInput';
import { Paragraph, Strong } from '../../components/Paragraph';
import { TextLink } from '../../components/TextLink';
import type { AuthStackParamList } from '../../navigation/types';
import { authService } from '../../services/authService';
import { ServiceError } from '../../services/types';
import { colors, type } from '../../theme/tokens';
import { validateCode } from '../../utils/validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'Codigo'>;

const RESEND_SECONDS = 45;

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function Codigo({ navigation, route }: Props) {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const verify = async (value = code) => {
    const msg = validateCode(value);
    setError(msg);
    if (msg) return;
    setSubmitting(true);
    try {
      await authService.verifyResetCode(email, value);
      navigation.navigate('Nueva', { email, code: value });
    } catch (e) {
      setError(e instanceof ServiceError ? e.message : 'No pudimos verificar el código.');
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    await authService.requestPasswordReset(email);
    setCode('');
    setError(undefined);
    setResent(true);
    setSeconds(RESEND_SECONDS);
  };

  return (
    <FormScreen header={<Hero height={250} title={'Revisá tu\ncorreo'} onBack={navigation.goBack} />}>
      <Paragraph>
        Te enviamos un código de 6 dígitos a <Strong>{email}</Strong>. Ingresalo para continuar.
      </Paragraph>
      {resent ? <Banner kind="success" message="Te enviamos un código nuevo." /> : null}
      <OtpInput
        value={code}
        onChange={(v) => {
          setCode(v);
          if (error) setError(v.length === 6 ? undefined : validateCode(v));
        }}
        error={error}
        onComplete={(v) => void verify(v)}
      />
      <Button title="Verificar código" large onPress={() => void verify()} loading={submitting} />
      <View style={styles.resend}>
        {seconds > 0 ? (
          <Text style={[type.body, styles.muted]} accessibilityLiveRegion="polite">
            Podés pedir otro código en {mmss(seconds)}
          </Text>
        ) : (
          <TextLink prefix="¿No te llegó?" title="Reenviar código" onPress={() => void resend()} />
        )}
        <TextLink title="Cambiar correo" onPress={navigation.goBack} />
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  resend: { alignItems: 'center' },
  muted: { color: colors.muted, minHeight: 44, textAlignVertical: 'center', paddingTop: 12 },
});
