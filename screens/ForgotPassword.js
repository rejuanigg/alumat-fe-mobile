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
import { Mail, ArrowRight } from 'lucide-react-native';
import { sendPasswordResetEmail } from 'firebase/auth';

import { auth } from '../src/config/firebaseConfig';
import { MESSAGES } from '../src/constants/messages';
import {
  COLORS,
  ASSETS,
  softShadow,
  AuthDecorations,
  Field,
} from '../src/components/AuthShared';

export default function ForgotPassword({ navigation, route }) {
  // Login pasa el correo que ya estaba escrito, para no tipearlo de nuevo
  const [email, setEmail] = useState(route?.params?.email ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sentTo, setSentTo] = useState('');

  const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  // Enviar el enlace de recuperación
  const handleReset = async () => {
    if (loading) return;

    if (!email.trim()) {
      setErrors({ email: 'Este campo es obligatorio.' });
      return;
    }

    const correo = email.trim().toLowerCase();

    if (!validarCorreo(correo)) {
      setErrors({ email: 'Correo electrónico con formato inválido.' });
      return;
    }

    // auth es null si Firebase no está configurado (faltan variables EXPO_PUBLIC_*)
    if (!auth) {
      setErrors({
        general: 'El servicio de acceso no está disponible. Revisá la configuración.',
      });
      return;
    }

    setErrors({});
    setSentTo('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, correo);

      // El aviso en pantalla funciona también en web; en celular sumamos el Alert
      setSentTo(correo);
      if (Platform.OS !== 'web') {
        Alert.alert('Correo enviado', 'Revisá tu bandeja de entrada.');
      }
    } catch (error) {
      console.error('Error al recuperar contraseña:', error.code);

      switch (error.code) {
        case 'auth/invalid-email':
          setErrors({ email: 'Correo electrónico inválido.' });
          break;

        // Se responde igual que si se hubiera enviado, para no revelar si el
        // correo está registrado
        case 'auth/user-not-found':
          setSentTo(correo);
          break;

        case 'auth/too-many-requests':
          setErrors({ general: 'Demasiados intentos. Intentá más tarde.' });
          break;

        case 'auth/network-request-failed':
          setErrors({ general: 'Error de conexión. Intentá nuevamente.' });
          break;

        case 'auth/invalid-api-key':
          setErrors({ general: 'Error de configuración de Firebase.' });
          break;

        default:
          setErrors({ general: 'No se pudo enviar el correo. Intentá nuevamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.title}>Recuperá tu contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresá tu correo y te enviamos un enlace para crear una nueva.
            </Text>
            <View style={styles.divider} />

            <View style={styles.form}>
              {/* Correo electrónico */}
              <Field Icon={Mail} label="Correo electrónico" error={errors.email}>
                <TextInput
                  style={styles.input}
                  placeholder="usuario@ejemplo.com"
                  placeholderTextColor={COLORS.text}
                  value={email}
                  onChangeText={(texto) => {
                    setEmail(texto);
                    setErrors({});
                    setSentTo('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  onSubmitEditing={handleReset}
                />
              </Field>

              {/* Aviso de éxito (visible también en web) */}
              {sentTo ? (
                <Text style={styles.successText}>
                  {MESSAGES.forgotPassword.confirmation}
                </Text>
              ) : null}

              {/* Error general (conexión, configuración, etc.) */}
              {errors.general ? (
                <Text style={styles.generalError}>{errors.general}</Text>
              ) : null}

              {/* Botón enviar */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  (loading || pressed) && styles.buttonPressed,
                ]}
                onPress={handleReset}
                disabled={loading}
                accessibilityRole="button"
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>
                      {sentTo ? 'Reenviar enlace' : 'Enviar enlace'}
                    </Text>
                    <ArrowRight size={22} color={COLORS.white} strokeWidth={2.25} />
                  </View>
                )}
              </Pressable>

              {/* Volver al login */}
              <Pressable
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginText}>
                  ¿Ya te acordaste?{' '}
                  <Text style={styles.loginHighlight}>Volvé a iniciar sesión</Text>
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
// Estilos (mismas medidas que Login)
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

  input: {
    fontSize: 17,
    color: COLORS.title,
    paddingVertical: 0,
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
  },

  successText: {
    color: COLORS.success,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: 12,
  },

  generalError: {
    color: COLORS.error,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
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
    marginTop: 26,
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
