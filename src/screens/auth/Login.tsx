import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { FormScreen } from '../../components/FormScreen';
import { Logo } from '../../components/Logo';
import { PasswordField } from '../../components/PasswordField';
import { TextField } from '../../components/TextField';
import { TextLink } from '../../components/TextLink';
import { Wave } from '../../components/Wave';
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import type { AuthStackParamList } from '../../navigation/types';
import { authService } from '../../services/authService';
import { ServiceError } from '../../services/types';
import { colors, spacing, type } from '../../theme/tokens';
import { validateEmail, validateLoginPassword } from '../../utils/validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const HERO_HEIGHT = 330;
const RULES = { email: validateEmail, password: validateLoginPassword };

export function Login({ navigation }: Props) {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const form = useForm({ email: '', password: '' }, RULES);
  const { setValue, reset } = form;

  useEffect(() => {
    void authService.getRememberedEmail().then((email) => {
      if (email) {
        setValue('email', email);
        setRemember(true);
      }
    });
  }, [setValue]);

  const submit = async () => {
    setAuthError(null);
    if (!form.validateAll()) return;
    setSubmitting(true);
    try {
      await signIn(form.values.email, form.values.password, remember);
      reset({ email: '', password: '' });
    } catch (e) {
      setAuthError(e instanceof ServiceError ? e.message : 'No pudimos iniciar sesión. Probá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const header = (
    <ImageBackground
      source={require('../../../assets/edificio.png')}
      resizeMode="cover"
      style={[styles.hero, { height: HERO_HEIGHT + insets.top }]}
      accessibilityIgnoresInvertColors
    >
      <View style={styles.veil} />
      <View style={[styles.heroContent, { paddingTop: insets.top + spacing.md }]}>
        <Logo inverted />
        <Text style={[type.title40, styles.title]} accessibilityRole="header">
          {'Hola de\nnuevo'}
        </Text>
      </View>
      <Wave />
    </ImageBackground>
  );

  return (
    <FormScreen header={header}>
      {authError ? <Banner kind="error" message={authError} /> : null}
      <TextField
        ref={form.register('email')}
        label="Correo electrónico"
        placeholder="nombre@empresa.com"
        value={form.values.email}
        onChangeText={(t) => setValue('email', t)}
        onBlur={() => form.validateField('email')}
        error={form.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => form.focus('password')}
      />
      <PasswordField
        ref={form.register('password')}
        label="Contraseña"
        placeholder="Tu contraseña"
        value={form.values.password}
        onChangeText={(t) => setValue('password', t)}
        onBlur={() => form.validateField('password')}
        error={form.errors.password}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <View style={styles.row}>
        <Checkbox label="Recordarme" checked={remember} onChange={setRemember} />
        <TextLink title="¿Olvidaste tu contraseña?" onPress={() => navigation.navigate('Olvide')} align="right" />
      </View>
      <Button title="Ingresar" large onPress={submit} loading={submitting} />
      <TextLink prefix="¿No tenés cuenta?" title="Registrate" onPress={() => navigation.navigate('Registro')} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', backgroundColor: colors.navy },
  veil: { ...StyleSheet.absoluteFill, backgroundColor: colors.navy, opacity: 0.55 },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingBottom: 52,
  },
  title: { color: colors.white },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
