import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  Circle,
  ArrowRight,
} from 'lucide-react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { auth } from '../src/config/firebaseConfig';
import {
  COLORS,
  ASSETS,
  softShadow,
  AuthDecorations,
  Field,
} from '../src/components/AuthShared';

// ---------------------------------------------------------------------------
// Reglas de contraseña (equivalen a /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
// ---------------------------------------------------------------------------
const getPasswordRules = (password) => [
  { key: 'length', label: 'Al menos 6 caracteres', ok: password.length >= 6 },
  { key: 'upper', label: 'Una letra mayúscula (A-Z)', ok: /[A-Z]/.test(password) },
  { key: 'lower', label: 'Una letra minúscula (a-z)', ok: /[a-z]/.test(password) },
  { key: 'number', label: 'Un número (0-9)', ok: /\d/.test(password) },
];

// ---------------------------------------------------------------------------
// Cuadro con las reglas de la contraseña (se actualiza en vivo)
// ---------------------------------------------------------------------------
function PasswordRules({ password, showError }) {
  const rules = getPasswordRules(password);
  const hasUnmet = rules.some((r) => !r.ok);

  return (
    <View
      style={[
        styles.rulesBox,
        showError && hasUnmet ? styles.rulesBoxError : null,
      ]}
    >
      <Text style={styles.rulesTitle}>La contraseña debe tener:</Text>

      {rules.map((rule) => (
        <View key={rule.key} style={styles.ruleRow}>
          {rule.ok ? (
            <View style={[styles.ruleIcon, styles.ruleIconOk]}>
              <Check size={12} color={COLORS.white} strokeWidth={3} />
            </View>
          ) : (
            <Circle
              size={18}
              color={showError ? COLORS.error : COLORS.text}
              strokeWidth={1.75}
            />
          )}

          <Text
            style={[
              styles.ruleText,
              rule.ok ? styles.ruleTextOk : null,
              !rule.ok && showError ? styles.ruleTextError : null,
            ]}
          >
            {rule.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const clearError = (campo) =>
    setErrors((prev) => ({ ...prev, [campo]: '', general: '' }));

  const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  // REGISTRAR USUARIO EN FIREBASE
  const handleSignUp = async () => {
    if (loading) return;

    const nuevosErrores = {};
    const obligatorio = 'Este campo es obligatorio.';

    if (!firstName.trim()) nuevosErrores.firstName = obligatorio;
    if (!lastName.trim()) nuevosErrores.lastName = obligatorio;
    if (!email.trim()) nuevosErrores.email = obligatorio;
    if (!password) nuevosErrores.password = obligatorio;
    if (!confirmPassword) nuevosErrores.confirmPassword = obligatorio;

    const correo = email.trim().toLowerCase();

    if (email.trim() && !validarCorreo(correo)) {
      nuevosErrores.email = 'Correo electrónico con formato inválido.';
    }

    if (password && getPasswordRules(password).some((r) => !r.ok)) {
      nuevosErrores.password = 'La contraseña no cumple con todas las reglas.';
    }

    if (password && confirmPassword && password !== confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    // auth es null si Firebase no está configurado (faltan variables EXPO_PUBLIC_*)
    if (!auth) {
      setErrors({
        general: 'El servicio de registro no está disponible. Revisá la configuración.',
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );

      await updateProfile(credential.user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

      // Firebase detecta la sesión y muestra Home.
      // (Alert.alert no hace nada en web; en celular muestra el aviso.)
      Alert.alert('Registro exitoso', 'Tu cuenta fue creada correctamente.');
    } catch (error) {
      console.error('Error de registro:', error.code);

      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrors({ email: 'Este correo ya está registrado.' });
          break;

        case 'auth/invalid-email':
          setErrors({ email: 'El correo electrónico no es válido.' });
          break;

        case 'auth/weak-password':
          setErrors({ password: 'La contraseña es demasiado débil.' });
          break;

        case 'auth/network-request-failed':
          setErrors({ general: 'Error de conexión. Intentá nuevamente.' });
          break;

        case 'auth/invalid-api-key':
          setErrors({ general: 'Error de configuración de Firebase.' });
          break;

        default:
          setErrors({ general: 'No se pudo completar el registro.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleEye = (visible, setVisible) => (
    <Pressable
      style={styles.eyeButton}
      onPress={() => setVisible((v) => !v)}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      hitSlop={8}
    >
      {visible ? (
        <EyeOff size={22} color={COLORS.text} strokeWidth={1.75} />
      ) : (
        <Eye size={22} color={COLORS.text} strokeWidth={1.75} />
      )}
    </Pressable>
  );

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
            <Image source={ASSETS.logo} style={styles.logo} resizeMode="contain" />

            {/* Título y subtítulo */}
            <Text style={styles.title}>Registrarse</Text>
            <Text style={styles.subtitle}>
              Creá tu cuenta para gestionar productos y órdenes.
            </Text>
            <View style={styles.divider} />

            <View style={styles.form}>
              {/* Nombre */}
              <Field compact Icon={User} label="Nombre" error={errors.firstName}>
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su nombre"
                  placeholderTextColor={COLORS.text}
                  value={firstName}
                  onChangeText={(t) => {
                    setFirstName(t);
                    clearError('firstName');
                  }}
                  autoCapitalize="words"
                  autoComplete="name-given"
                />
              </Field>

              {/* Apellido */}
              <Field compact Icon={User} label="Apellido" error={errors.lastName}>
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su apellido"
                  placeholderTextColor={COLORS.text}
                  value={lastName}
                  onChangeText={(t) => {
                    setLastName(t);
                    clearError('lastName');
                  }}
                  autoCapitalize="words"
                  autoComplete="name-family"
                />
              </Field>

              {/* Correo electrónico */}
              <Field compact Icon={Mail} label="Correo electrónico" error={errors.email}>
                <TextInput
                  style={styles.input}
                  placeholder="usuario@ejemplo.com"
                  placeholderTextColor={COLORS.text}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    clearError('email');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />
              </Field>

              {/* Contraseña */}
              <Field
                compact
                Icon={Lock}
                label="Contraseña"
                error={errors.password}
                right={toggleEye(showPassword, setShowPassword)}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese su contraseña"
                  placeholderTextColor={COLORS.text}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    clearError('password');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password-new"
                />
              </Field>

              {/* Reglas de la contraseña */}
              <PasswordRules password={password} showError={!!errors.password} />

              {/* Confirmar contraseña */}
              <Field
                compact
                Icon={ShieldCheck}
                label="Confirmar contraseña"
                error={errors.confirmPassword}
                right={toggleEye(showConfirmPassword, setShowConfirmPassword)}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Confirme su contraseña"
                  placeholderTextColor={COLORS.text}
                  value={confirmPassword}
                  onChangeText={(t) => {
                    setConfirmPassword(t);
                    clearError('confirmPassword');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password-new"
                  onSubmitEditing={handleSignUp}
                />
              </Field>

              {/* Error general (conexión, configuración, etc.) */}
              {errors.general ? (
                <Text style={[styles.errorText, styles.generalError]}>
                  {errors.general}
                </Text>
              ) : null}

              {/* Botón registrarse */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  (loading || pressed) && styles.buttonPressed,
                ]}
                onPress={handleSignUp}
                disabled={loading}
                accessibilityRole="button"
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                    <ArrowRight size={22} color={COLORS.white} strokeWidth={2.25} />
                  </View>
                )}
              </Pressable>

              {/* Ir a login */}
              <Pressable
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginText}>
                  ¿Ya tienes una cuenta?{' '}
                  <Text style={styles.loginHighlight}>Inicia sesión</Text>
                </Text>
              </Pressable>
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
    paddingVertical: 28,
  },

  logo: {
    width: 90,
    height: 100,
    marginBottom: 12,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.title,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
    textAlign: 'center',
    maxWidth: 300,
  },

  divider: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 16,
    marginBottom: 24,
  },

  form: {
    width: '100%',
    maxWidth: 420,
  },

  input: {
    fontSize: 16,
    color: COLORS.title,
    paddingVertical: 0,
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
  },

  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 20,
  },

  generalError: {
    textAlign: 'center',
    marginLeft: 0,
    marginBottom: 4,
  },

  // Cuadro de reglas de contraseña
  rulesBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
    ...softShadow(0.04),
  },

  rulesBoxError: {
    borderColor: COLORS.error,
  },

  rulesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.title,
    marginBottom: 8,
  },

  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 3,
  },

  ruleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ruleIconOk: {
    backgroundColor: COLORS.success,
  },

  ruleText: {
    fontSize: 14,
    color: COLORS.text,
  },

  ruleTextOk: {
    color: COLORS.success,
  },

  ruleTextError: {
    color: COLORS.error,
  },

  button: {
    width: '78%',
    alignSelf: 'center',
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    ...softShadow(0.2),
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '700',
  },

  loginLink: {
    marginTop: 24,
    // Ancho completo + texto centrado: en Android, con fuentes de sistema de
    // algunos fabricantes, un contenedor ajustado al texto corta la última palabra
    alignSelf: 'stretch',
  },

  loginText: {
    color: COLORS.text,
    fontSize: 15,
    textAlign: 'center',
  },

  loginHighlight: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});