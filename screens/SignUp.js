
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

export default function SignUp({ navigation }) {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // REGISTRAR USUARIO EN FIREBASE
  const handleSignUp = async () => {

    if (loading) return;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.'
      );
      return;
    }

    try {
      setLoading(true);

      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(credential.user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

      Alert.alert(
        'Registro exitoso',
        'Tu cuenta fue creada correctamente.'
      );

      // Firebase detecta la sesión y muestra Home.

    } catch (error) {

      let mensaje = 'No se pudo completar el registro.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          mensaje = 'Este correo ya está registrado.';
          break;

        case 'auth/invalid-email':
          mensaje = 'El correo electrónico no es válido.';
          break;

        case 'auth/weak-password':
          mensaje = 'La contraseña es demasiado débil.';
          break;

        case 'auth/network-request-failed':
          mensaje = 'Error de conexión. Intentá nuevamente.';
          break;

        case 'auth/invalid-api-key':
          mensaje = 'Error de configuración de Firebase.';
          break;
      }

      Alert.alert('Error', mensaje);

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        backgroundColor="#0A72AB"
        barStyle="light-content"
      />

      {/* BARRA SUPERIOR */}
      <View style={styles.header} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        {/* LOGO */}
        <Image
          source={require('../assets/isotipo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Registrarse</Text>

        {/* NOMBRE */}
        <Text style={styles.label}>Nombre</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          placeholderTextColor="#929292"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        {/* APELLIDO */}
        <Text style={styles.label}>Apellido</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingrese su apellido"
          placeholderTextColor="#929292"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

        {/* CORREO */}
        <Text style={styles.label}>Correo electrónico</Text>

        <TextInput
          style={styles.input}
          placeholder="usuario@gmail.com"
          placeholderTextColor="#929292"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* CONTRASEÑA */}
        <Text style={styles.label}>Contraseña</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Ingrese su contraseña"
            placeholderTextColor="#929292"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome
              name={showPassword ? 'eye-slash' : 'eye'}
              size={18}
              color="#706F8A"
            />
          </TouchableOpacity>
        </View>

        {/* CONFIRMAR CONTRASEÑA */}
        <Text style={styles.label}>Confirmar contraseña</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirme su contraseña"
            placeholderTextColor="#929292"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />

          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesome
              name={showConfirmPassword ? 'eye-slash' : 'eye'}
              size={18}
              color="#706F8A"
            />
          </TouchableOpacity>
        </View>

        {/* BOTÓN REGISTRARSE */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        {/* IR A LOGIN */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            ¿Ya tienes una cuenta?{' '}
            <Text style={styles.loginHighlight}>
              Inicia sesión
            </Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#E7E7D8',
  },

  header: {
    height: 25,
    backgroundColor: '#0A72AB',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 35,
    paddingTop: 25,
    paddingBottom: 35,
  },

  logo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 12,
  },

  title: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    color: '#4D5061',
    marginBottom: 22,
  },

  label: {
    fontSize: 13,
    color: '#706F8A',
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    height: 43,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#706F8A',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#4D5061',
    elevation: 2,
  },

  passwordContainer: {
    height: 43,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#706F8A',
    borderRadius: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: '#4D5061',
  },

  button: {
    backgroundColor: '#0A72AB',
    borderRadius: 6,
    height: 45,
    minWidth: 135,
    paddingHorizontal: 22,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  loginLink: {
    marginTop: 28,
    alignSelf: 'center',
  },

  loginText: {
    color: '#706F8A',
    fontSize: 13,
    textAlign: 'center',
  },

  loginHighlight: {
    color: '#0A72AB',
    fontWeight: 'bold',
  },

});
