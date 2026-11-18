import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { Button } from '../../components/Button';
import { FormScreen } from '../../components/FormScreen';
import { Hero } from '../../components/Hero';
import { Paragraph } from '../../components/Paragraph';
import { TextField } from '../../components/TextField';
import { TextLink } from '../../components/TextLink';
import { useForm } from '../../hooks/useForm';
import type { AuthStackParamList } from '../../navigation/types';
import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'Olvide'>;

const RULES = { email: validateEmail };

export function Olvide({ navigation }: Props) {
  const form = useForm({ email: '' }, RULES);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!form.validateAll()) return;
    setSubmitting(true);
    try {
      const email = form.values.email.trim();
      await authService.requestPasswordReset(email);
      navigation.navigate('Codigo', { email });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormScreen header={<Hero height={250} title={'¿Olvidaste tu\ncontraseña?'} onBack={navigation.goBack} />}>
      <Paragraph>
        Ingresá el correo con el que te registraste y te enviamos un código de 6 dígitos para crear una contraseña
        nueva.
      </Paragraph>
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
      <Button title="Enviar código" large onPress={submit} loading={submitting} />
      <TextLink title="Volver a iniciar sesión" onPress={() => navigation.popTo('Login')} />
    </FormScreen>
  );
}
