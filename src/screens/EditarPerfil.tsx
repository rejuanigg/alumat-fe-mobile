import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';

import { Avatar } from '../components/Avatar';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Columns } from '../components/Columns';
import { FormScreen } from '../components/FormScreen';
import { Hero } from '../components/Hero';
import { PasswordField } from '../components/PasswordField';
import { TextField } from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { useForm, type FieldRules } from '../hooks/useForm';
import type { PerfilStackParamList } from '../navigation/types';
import { profileService, WRONG_CURRENT_PASSWORD } from '../services/profileService';
import { ServiceError, type User } from '../services/types';
import { colors, fonts, sizes, spacing, type } from '../theme/tokens';
import { initials } from '../utils/format';
import { pickImage } from '../utils/imagePicker';
import {
  PASSWORD_HINT,
  validateEmail,
  validateFirstName,
  validateLastName,
  validateNewPassword,
  validatePasswordMatch,
  validatePhone,
} from '../utils/validators';

type Props = NativeStackScreenProps<PerfilStackParamList, 'EditarPerfil'>;

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUri: string | null;
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
};

/** El cambio de contraseña es opcional: solo se valida si se completó alguno de sus campos. */
const wantsPasswordChange = (all: Values) => Boolean(all.currentPassword || all.newPassword || all.repeatPassword);

const RULES: FieldRules<Values> = {
  firstName: validateFirstName,
  lastName: validateLastName,
  email: validateEmail,
  phone: validatePhone,
  currentPassword: (v, all) => {
    if (!wantsPasswordChange(all)) return undefined;
    return v ? undefined : 'Ingresá tu contraseña actual para cambiarla.';
  },
  newPassword: (v, all) => {
    if (!wantsPasswordChange(all)) return undefined;
    if (!v) return 'Ingresá la nueva contraseña.';
    const error = validateNewPassword(v, all);
    if (error) return error;
    if (v === all.currentPassword) return 'La nueva contraseña tiene que ser distinta de la actual.';
    return undefined;
  },
  repeatPassword: (v, all) => {
    if (!wantsPasswordChange(all)) return undefined;
    return validatePasswordMatch(all.newPassword, v);
  },
};

const toValues = (u: User): Values => ({
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  phone: u.phone,
  photoUri: u.photoUri,
  currentPassword: '',
  newPassword: '',
  repeatPassword: '',
});

export function EditarPerfil({ navigation }: Props) {
  const { user, updateUser } = useAuth();
  if (!user) return null;
  return <EditarPerfilForm user={user} onSaved={updateUser} onBack={navigation.goBack} />;
}

function EditarPerfilForm({ user, onSaved, onBack }: { user: User; onSaved: (u: User) => void; onBack: () => void }) {
  const form = useForm<Values>(toValues(user), RULES);
  const { values: v, errors, setValue, setError, validateField, register, focus } = form;
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);

  const changePhoto = async () => {
    const result = await pickImage('profile');
    if (result.status === 'ok') {
      setPhotoError(null);
      setValue('photoUri', result.image.uri);
    } else if (result.status === 'error') {
      setPhotoError(result.message);
    }
  };

  const submit = async () => {
    setBanner(null);
    if (!form.validateAll()) return;
    setSaving(true);
    try {
      const changingPassword = wantsPasswordChange(v);
      const { user: updated, pendingEmail } = await profileService.update(
        user,
        v,
        changingPassword ? { current: v.currentPassword, next: v.newPassword } : undefined,
      );
      onSaved(updated);
      setValue('currentPassword', '');
      setValue('newPassword', '');
      setValue('repeatPassword', '');
      // Al limpiar uno por uno pueden quedar errores intermedios: revalidamos ya con los tres vacíos.
      (['currentPassword', 'newPassword', 'repeatPassword'] as const).forEach(validateField);
      const parts = ['Cambios guardados correctamente.'];
      if (changingPassword) parts.push('Tu contraseña se actualizó.');
      if (pendingEmail) parts.push(`Te enviamos un correo a ${pendingEmail} para confirmar el cambio de correo.`);
      setBanner({ kind: 'success', message: parts.join(' ') });
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (e) {
      if (e instanceof ServiceError && e.code === WRONG_CURRENT_PASSWORD) {
        setError('currentPassword', e.message);
        return;
      }
      if (e instanceof ServiceError && e.code === 'auth/password-does-not-meet-requirements') {
        setError('newPassword', e.message);
        return;
      }
      setBanner({
        kind: 'error',
        message: e instanceof ServiceError ? e.message : 'No pudimos guardar los cambios. Probá de nuevo.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreen
      scrollRef={scrollRef}
      bottomInset={false}
      header={<Hero height={200} title={'Editar\nperfil'} onBack={onBack} />}
    >
      {banner ? <Banner kind={banner.kind} message={banner.message} /> : null}
      <View style={styles.photoRow}>
        <Avatar
          initials={initials(v.firstName || user.firstName, v.lastName || user.lastName)}
          photoUri={v.photoUri}
          size={80}
          background={colors.navy}
          color={colors.white}
        />
        <View style={styles.photoActions}>
          <View style={styles.links}>
            <Pressable onPress={() => void changePhoto()} accessibilityRole="button" style={styles.link} hitSlop={4}>
              <Text style={[type.body, styles.linkText]}>Cambiar foto</Text>
            </Pressable>
            {v.photoUri ? (
              <Pressable
                onPress={() => {
                  setPhotoError(null);
                  setValue('photoUri', null);
                }}
                accessibilityRole="button"
                style={styles.link}
                hitSlop={4}
              >
                <Text style={[type.body, styles.removeText]}>Quitar foto</Text>
              </Pressable>
            ) : null}
          </View>
          <Text style={[type.small, styles.muted]}>PNG, JPG o WEBP · máx. 2 MB</Text>
        </View>
      </View>
      {photoError ? (
        <Text style={[type.small, styles.error]} accessibilityLiveRegion="polite" accessibilityRole="alert">
          {photoError}
        </Text>
      ) : null}
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
        value={v.phone}
        onChangeText={(t) => setValue('phone', t)}
        onBlur={() => validateField('phone')}
        error={errors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => focus('currentPassword')}
      />
      <View style={styles.section}>
        <Text style={[type.heading, styles.sectionTitle]} accessibilityRole="header">
          Cambiar contraseña
        </Text>
        <Text style={[type.small, styles.muted]}>Dejalo vacío si no querés cambiarla.</Text>
      </View>
      <PasswordField
        ref={register('currentPassword')}
        label="Contraseña actual"
        value={v.currentPassword}
        onChangeText={(t) => setValue('currentPassword', t)}
        onBlur={() => validateField('currentPassword')}
        error={errors.currentPassword}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => focus('newPassword')}
      />
      <PasswordField
        ref={register('newPassword')}
        label="Nueva contraseña"
        value={v.newPassword}
        onChangeText={(t) => setValue('newPassword', t)}
        onBlur={() => validateField('newPassword')}
        error={errors.newPassword}
        hint={PASSWORD_HINT}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => focus('repeatPassword')}
      />
      <PasswordField
        ref={register('repeatPassword')}
        label="Repetir nueva contraseña"
        value={v.repeatPassword}
        onChangeText={(t) => setValue('repeatPassword', t)}
        onBlur={() => validateField('repeatPassword')}
        error={errors.repeatPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={() => void submit()}
      />
      <Button title="Guardar cambios" large onPress={() => void submit()} loading={saving} />
      <Button title="Cancelar" variant="secondary" onPress={onBack} disabled={saving} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  photoActions: { flex: 1, gap: 2 },
  links: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.md },
  link: { minHeight: sizes.touch, justifyContent: 'center' },
  linkText: { color: colors.link, fontFamily: fonts.bold },
  removeText: { color: colors.error, fontFamily: fonts.bold },
  muted: { color: colors.muted },
  section: { gap: 2, marginTop: spacing.sm },
  sectionTitle: { color: colors.navy },
  error: { color: colors.error },
});
