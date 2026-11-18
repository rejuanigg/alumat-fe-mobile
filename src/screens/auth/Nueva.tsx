import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { FormScreen } from '../../components/FormScreen';
import { Hero } from '../../components/Hero';
import { Icon } from '../../components/Icon';
import { PasswordField } from '../../components/PasswordField';
import { useForm, type FieldRules } from '../../hooks/useForm';
import type { AuthStackParamList } from '../../navigation/types';
import { authService } from '../../services/authService';
import { ServiceError } from '../../services/types';
import { colors, spacing, type } from '../../theme/tokens';
import { passwordRules, validateNewPassword, validatePasswordMatch } from '../../utils/validators';

type Props = NativeStackScreenProps<AuthStackParamList, 'Nueva'>;

type Values = { password: string; repeat: string };

const RULES: FieldRules<Values> = {
  password: validateNewPassword,
  repeat: (v, all) => validatePasswordMatch(all.password, v),
};

export function Nueva({ navigation, route }: Props) {
  const { email, code } = route.params;
  const form = useForm<Values>({ password: '', repeat: '' }, RULES);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const rules = passwordRules(form.values.password);

  const submit = async () => {
    setServerError(null);
    if (!form.validateAll()) return;
    setSubmitting(true);
    try {
      await authService.resetPassword(email, code, form.values.password);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }, { name: 'Listo', params: { from: 'reset' } }] });
    } catch (e) {
      setServerError(e instanceof ServiceError ? e.message : 'No pudimos guardar la contraseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormScreen header={<Hero height={230} title={'Nueva\ncontraseña'} onBack={navigation.goBack} />}>
      {serverError ? <Banner kind="error" message={serverError} /> : null}
      <PasswordField
        ref={form.register('password')}
        label="Nueva contraseña"
        value={form.values.password}
        onChangeText={(t) => form.setValue('password', t)}
        onBlur={() => form.validateField('password')}
        error={form.errors.password}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => form.focus('repeat')}
      />
      <View style={styles.checklist} accessibilityLabel="Requisitos de la contraseña">
        <Rule ok={rules.length} label="Al menos 8 caracteres" />
        <Rule ok={rules.upper} label="Una mayúscula" />
        <Rule ok={rules.number} label="Un número" />
      </View>
      <PasswordField
        ref={form.register('repeat')}
        label="Repetir contraseña"
        value={form.values.repeat}
        onChangeText={(t) => form.setValue('repeat', t)}
        onBlur={() => form.validateField('repeat')}
        error={form.errors.repeat}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <Button title="Guardar contraseña" large onPress={submit} loading={submitting} />
    </FormScreen>
  );
}

function Rule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View
      style={styles.rule}
      accessible
      accessibilityLabel={`${label}: ${ok ? 'cumplido' : 'pendiente'}`}
    >
      <View style={[styles.dot, ok ? styles.dotOk : styles.dotPending]}>
        {ok ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}
      </View>
      <Text style={[type.body, { color: ok ? colors.success : colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checklist: { gap: spacing.xs, marginTop: -spacing.xxs },
  rule: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dotOk: { backgroundColor: colors.successCheck },
  dotPending: { backgroundColor: colors.line },
});
