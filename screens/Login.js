import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Mail, ArrowRight } from 'lucide-react-native';

import { AuthDecorations } from '../src/components/AuthShared';
import AuthField from '../src/components/auth/AuthField';
import PasswordField from '../src/components/auth/PasswordField';
import PrimaryButton from '../src/components/auth/PrimaryButton';
import ErrorBanner from '../src/components/auth/ErrorBanner';
import Checkbox from '../src/components/auth/Checkbox';
import useLoginForm from '../src/hooks/useLoginForm';
import { MESSAGES } from '../src/constants/messages';
import { TENANT } from '../src/config/tenantConfig';
import { EMAIL_MAX_LENGTH, normalizeEmail } from '../src/validation/loginValidation';
const T = MESSAGES.login;
const COLORS = TENANT.colors;

export default function Login({ navigation }) {
  const form = useLoginForm();

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      {/* Decoraciones de fondo: pegadas a los bordes reales de la pantalla */}
      <AuthDecorations />

      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <Image
              source={TENANT.logo}
              style={styles.logo}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />

            {/* Título y subtítulo */}
            <Text style={styles.title} accessibilityRole="header">
              {T.title}
            </Text>
            <Text style={styles.subtitle}>{T.subtitle}</Text>
            <View style={styles.divider} />

            <View style={styles.form}>
              {/* Correo electrónico */}
              <AuthField
                Icon={Mail}
                label={T.emailLabel}
                error={form.errors.email}
                inputRef={form.emailRef}
                placeholder={T.emailPlaceholder}
                value={form.values.email}
                onChangeText={form.onChangeEmail}
                onBlur={form.onBlurEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                importantForAutofill="yes"
                maxLength={EMAIL_MAX_LENGTH}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => form.passwordRef.current?.focus()}
              />

              {/* Contraseña */}
              <PasswordField
                label={T.passwordLabel}
                showLabel={T.showPassword}
                hideLabel={T.hidePassword}
                error={form.errors.password}
                inputRef={form.passwordRef}
                placeholder={T.passwordPlaceholder}
                value={form.values.password}
                onChangeText={form.onChangePassword}
                onBlur={form.onBlurPassword}
                returnKeyType="done"
                onSubmitEditing={form.onSubmit}
              />

              {/* Recordar correo */}
              {TENANT.allowRememberEmail ? (
                <Checkbox
                  label={T.remember}
                  hint={T.rememberHint}
                  checked={form.remember}
                  onChange={form.onToggleRemember}
                />
              ) : null}

              {/* Error de autenticación / conexión */}
              <ErrorBanner
                message={form.authError?.message}
                actionLabel={form.authError?.canRetry ? T.retry : null}
                onAction={form.onSubmit}
              />

              {/* Botón iniciar sesión */}
              <PrimaryButton
                title={T.submit}
                loadingTitle={T.submitting}
                loading={form.loading}
                onPress={form.onSubmit}
                Icon={ArrowRight}
              />

              {/* Recuperar contraseña */}
              <Pressable
                style={styles.forgotContainer}
                onPress={() =>
                  navigation.navigate('ForgotPassword', {
                    email: normalizeEmail(form.values.email),
                  })
                }
                accessibilityRole="link"
                hitSlop={8}
              >
                <Text style={styles.forgotText}>{T.forgotPassword}</Text>
              </Pressable>

              {/* Registrarse (según la política de la empresa) */}
              {TENANT.allowSelfRegistration ? (
                <Pressable
                  style={styles.registerContainer}
                  onPress={() => navigation.navigate('SignUp')}
                  accessibilityRole="link"
                  accessibilityLabel={`${T.noAccount} ${T.register}`}
                  hitSlop={8}
                >
                  <Text style={styles.registerText}>
                    {T.noAccount}{' '}
                    <Text style={styles.registerLink}>{T.register}</Text>
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  logo: {
    width: 110,
    height: 130,
    marginBottom: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.title,
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.text,
    textAlign: 'center',
    maxWidth: 300,
  },

  divider: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 18,
    marginBottom: 28,
  },

  form: {
    width: '100%',
    maxWidth: 420,
  },

  // minHeight 48 para el área táctil; los márgenes se compensan para que el
  // texto quede en el mismo lugar que en el diseño aprobado
  forgotContainer: {
    marginTop: 8,
    // Ancho completo + texto centrado: en Android, con fuentes de sistema de
    // algunos fabricantes, un contenedor ajustado al texto corta la última palabra
    alignSelf: 'stretch',
    minHeight: 48,
    justifyContent: 'center',
  },

  forgotText: {
    fontSize: 15,
    textAlign: 'center',
    color: COLORS.link,
    textDecorationLine: 'underline',
  },

  registerContainer: {
    marginTop: 0,
    alignSelf: 'stretch',
    minHeight: 48,
    justifyContent: 'center',
  },

  registerText: {
    fontSize: 15,
    textAlign: 'center',
    color: COLORS.text,
  },

  registerLink: {
    color: COLORS.link,
    textDecorationLine: 'underline',
  },
});
