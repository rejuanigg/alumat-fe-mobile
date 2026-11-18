import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { Columns } from '../../components/Columns';
import { FormScreen } from '../../components/FormScreen';
import { Hero } from '../../components/Hero';
import { PasswordField } from '../../components/PasswordField';
import { TextField } from '../../components/TextField';
import { TextLink } from '../../components/TextLink';
import { useForm, type FieldRules } from '../../hooks/useForm';
import type { AuthStackParamList } from '../../navigation/types';
import { authService } from '../../services/authService';
import { ServiceError } from '../../services/types';
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validateNewPassword,
  validatePasswordMatch,
  validatePhone,
  validateTerms,
} from '../../utils/validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'Registro'>;

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  repeat: string;
  terms: boolean;
};

const INITIAL: Values = { firstName: '', lastName: '', email: '', phone: '', password: '', repeat: '', terms: false };

const RULES: FieldRules<Values> = {
  firstName: validateFirstName,
  lastName: validateLastName,
  email: validateEmail,
  phone: validatePhone,
  password: validateNewPassword,
  repeat: (v, all) => validatePasswordMatch(all.password, v),
  terms: validateTerms,
};

export function Registro({ navigation }: Props) {
  const form = useForm(INITIAL, RULES);
  const { values: v, errors, setValue, validateField, register, focus } = form;
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const submit = async () => {
    setServerError(null);
    if (!form.validateAll()) return;
    setSubmitting(true);
    try {
      await authService.register(v);
      navigation.replace('Listo', { from: 'registro' });
    } catch (e) {
      setServerError(e instanceof ServiceError ? e.message : 'No pudimos crear la cuenta. Probá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormScreen header={<Hero height={184} title="Crear cuenta" onBack={navigation.goBack} />}>
      {serverError ? <Banner kind="error" message={serverError} /> : null}
      <Columns>
        <TextField
          ref={register('firstName')}
          label="Nombre"
          value={v.firstName}
          onChangeText={(t) => setValue('firstName', t)}
          onBlur={() => validateField('firstName')}
          error={errors.firstName}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => focus('lastName')}
        />
        <TextField
          ref={register('lastName')}
          label="Apellido"
          value={v.lastName}
          onChangeText={(t) => setValue('lastName', t)}
          onBlur={() => validateField('lastName')}
          error={errors.lastName}
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => focus('email')}
        />
      </Columns>
      <TextField
        ref={register('email')}
        label="Correo electrónico"
        placeholder="nombre@empresa.com"
        value={v.email}
        onChangeText={(t) => setValue('email', t)}
        onBlur={() => validateField('email')}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => focus('phone')}
      />
      <TextField
        ref={register('phone')}
        label="Teléfono"
        placeholder="+54 9 11 5555 5555"
        value={v.phone}
        onChangeText={(t) => setValue('phone', t)}
        onBlur={() => validateField('phone')}
        error={errors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => focus('password')}
      />
      <PasswordField
        ref={register('password')}
        label="Contraseña"
        placeholder="Mínimo 8 caracteres"
        value={v.password}
        onChangeText={(t) => setValue('password', t)}
        onBlur={() => validateField('password')}
        error={errors.password}
        hint="Al menos 8 caracteres, una mayúscula y un número."
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => focus('repeat')}
      />
      <PasswordField
        ref={register('repeat')}
        label="Repetir contraseña"
        value={v.repeat}
        onChangeText={(t) => setValue('repeat', t)}
        onBlur={() => validateField('repeat')}
        error={errors.repeat}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={() => validateField('repeat')}
      />
      <Checkbox
        label="Acepto los términos y condiciones"
        checked={v.terms}
        onChange={(c) => setValue('terms', c)}
        error={errors.terms}
      />
      <Button title="Crear cuenta" large onPress={submit} loading={submitting} />
      <TextLink prefix="¿Ya tenés cuenta?" title="Iniciá sesión" onPress={() => navigation.popTo('Login')} />
    </FormScreen>
  );
}
