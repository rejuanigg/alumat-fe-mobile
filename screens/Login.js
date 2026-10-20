import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { auth } from '../src/config/firebaseConfig';
import CustomInput from '../src/components/CustomInput';
import CustomButton from '../src/components/CustomButton';

export default function Login({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validar correo
  const validarCorreo = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  // Iniciar sesión
  const handleLogin = async () => {
    if (loading) return;

    const nuevosErrores = {};

    if (!email.trim()) {
      nuevosErrores.email = 'Este campo es obligatorio.';
    }

    if (!password) {
      nuevosErrores.password = 'Este campo es obligatorio.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    const correo = email.trim().toLowerCase();

    if (!validarCorreo(correo)) {
      setErrors({
        email: 'Correo electrónico con formato inválido.',
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, correo, password);
      // Firebase inicia la sesión si los datos están bien
    } catch (error) {
      console.error('Error de login:', error.code);

      let mensaje = 'No se pudo iniciar sesión.';

      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          mensaje = 'Correo o contraseña incorrectos.';
          break;

        case 'auth/invalid-email':
          mensaje = 'Correo electrónico inválido.';
          break;

        case 'auth/network-request-failed':
          mensaje = 'Error de conexión. Intentá nuevamente.';
          break;

        case 'auth/too-many-requests':
          mensaje = 'Demasiados intentos. Intentá más tarde.';
          break;

        default:
          mensaje = 'No se pudo iniciar sesión. Intentá nuevamente.';
      }

      setErrors({ password: mensaje });
    } finally {
      setLoading(false);
    }
  };

  // Recuperar contraseña
  const recuperarPassword = async () => {
    const correo = email.trim().toLowerCase();

    if (!correo) {
      Alert.alert(
        'Recuperar contraseña',
        'Ingresá primero tu correo electrónico.'
      );
      return;
    }

    if (!validarCorreo(correo)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Correo electrónico con formato inválido.',
      }));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, correo);

      Alert.alert(
        'Recuperar contraseña',
        'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.'
      );
    } catch (error) {
      console.error('Error de recuperación:', error.code);

      Alert.alert(
        'Error',
        'No se pudo procesar la solicitud. Intentá nuevamente.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
      <StatusBar style="light" />

      {/* Franja azul: cubre la barra de estado */}
      <View style={{ backgroundColor: '#006DA8', height: insets.top }} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Isotipo de ALUMAT */}
        <Image
          source={require('../assets/isotipo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Título */}
        <Text style={styles.title}>Inicia Sesión</Text>

        <View style={styles.form}>
          {/* Correo electrónico */}
          <Text style={styles.label}>Correo electrónico</Text>

          <View style={errors.email ? styles.inputError : null}>
            <CustomInput
              placeholder="user@gmail.com"
              value={email}
              onChangeText={(texto) => {
                setEmail(texto);
                setErrors((prev) => ({ ...prev, email: '' }));
              }}
              keyboardType="email-address"
            />
          </View>

          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          {/* Contraseña */}
          <Text style={styles.label}>Contraseña</Text>

          <View style={styles.passwordRow}>
            <View
              style={[
                styles.passwordInput,
                errors.password ? styles.inputError : null,
              ]}
            >
              <CustomInput
                placeholder="********"
                value={password}
                onChangeText={(texto) => {
                  setPassword(texto);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                secureTextEntry={!showPassword}
              />
            </View>

            {/* Mostrar u ocultar contraseña */}
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={18}
                color="#706F8A"
              />
            </TouchableOpacity>
          </View>

          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          {/* Botón entrar */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={loading ? 'Ingresando...' : 'Entrar'}
              onPress={handleLogin}
            />
          </View>

          {/* Registrarse */}
          <TouchableOpacity
            style={styles.registerContainer}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.registerLink}>creá una.</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos del Login
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E7E7D8',
  },

  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 30,
  },

  logo: {
    width: 85,
    height: 100,
    marginBottom: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4D5061',
    marginBottom: 22,
  },

  form: {
    width: '100%',
    maxWidth: 360,
  },

  label: {
    fontSize: 13,
    color: '#706F8A',
    marginTop: 10,
    marginBottom: 2,
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
  },

  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 10,
  },

  inputError: {
    borderColor: '#FF3333',
    borderWidth: 1,
    borderRadius: 8,
  },

  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: 3,
  },

  buttonContainer: {
    width: 145,
    alignSelf: 'center',
    marginTop: 25,
  },

  forgotContainer: {
    marginTop: 18,
    alignItems: 'flex-start',
  },

  forgotText: {
    fontSize: 13,
    color: '#706F8A',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  registerContainer: {
    marginTop: 22,
    alignItems: 'flex-start',
  },

  registerText: {
    fontSize: 13,
    color: '#706F8A',
  },

  registerLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});