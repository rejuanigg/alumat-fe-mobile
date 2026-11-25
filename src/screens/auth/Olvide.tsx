import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { FormScreen } from '../../components/FormScreen';
import { Hero } from '../../components/Hero';
import { Paragraph } from '../../components/Paragraph';
import { TextField } from '../../components/TextField';
import { TextLink } from '../../components/TextLink';
import { useForm } from '../../hooks/useForm';
import type { AuthStackParamList } from '../../navigation/types';
import { authService } from '../../services/authService';
import { ServiceError } from '../../services/types';
import { validateEmail } from '../../utils/validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'Olvide'>;

const RULES = { email: validateEmail };

export function Olvide({ navigation }: Props) {
  const form = useForm({ email: '' }, RULES);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const submit = async () => {
    setServerError(null);
    if (!form.validateAll()) return;
    setSubmitting(true);
    try {
      const email = form.values.email.trim().toLowerCase();
      await authService.requestPasswordReset(email);
      navigation.navigate('Enviado', { email });
    } catch (e) {
      setServerError(e instanceof ServiceError ? e.message : 'No pudimos enviar el correo. Probá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormScreen header={<Hero height={250} title={'¿Olvidaste tu\ncontraseña?'} onBack={navigation.goBack} />}>
      <Paragraph>
        Ingresá el correo con el que te registraste y te enviamos un enlace para crear una contraseña nueva.
      </Paragraph>
      {serverError ? <Banner kind="error" message={serverError} /> : null}
      <TextField
        ref={form.register('email')}
        label="Correo electrónico"
        placeholder="nombre@empresa.com"
        value={form.values.email}
        onChangeText={(t) => form.setValue('email', t)}
        onBlur={() => form.validateField('email')}
        error={form.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={submit}
      />
      <Button title="Enviar enlace" large onPress={submit} loading={submitting} />
      <TextLink title="Volver a iniciar sesión" onPress={() => navigation.popTo('Login')} />
    </FormScreen>
  );
}
