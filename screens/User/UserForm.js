
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../src/config/firebaseConfig';

export default function UserForm({ navigation }) {
  const user = auth.currentUser;
  const nombreCompleto = user?.displayName?.trim() || '';
  const partes = nombreCompleto.split(/\s+/);

  const [nombre, setNombre] = useState(partes[0] || '');
  const [apellido, setApellido] = useState(partes.slice(1).join(' ') || '');
  const [guardando, setGuardando] = useState(false);

  const guardarCambios = async () => {
    if (!nombre.trim() || !apellido.trim()) {
      Alert.alert('Error', 'El nombre y el apellido son obligatorios.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'No se encontró un usuario con sesión iniciada.');
      return;
    }

    try {
      setGuardando(true);

      await updateProfile(user, {
        displayName: `${nombre.trim()} ${apellido.trim()}`,
      });

      Alert.alert('Éxito', 'Tu perfil se actualizó correctamente.', [
        {
          text: 'Aceptar',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#0A72AB"
        barStyle="light-content"
      />

      {/* NAVBAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Image
          source={require('../../assets/isotipo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>EDITAR PERFIL</Text>

        {/* AVATAR */}
        <View style={styles.avatar}>
          <FontAwesome name="user-o" size={65} color="#272727" />
        </View>

        {/* NOMBRE */}
        <Text style={styles.label}>Editar Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ingrese su nombre"
          autoCapitalize="words"
        />

        {/* APELLIDO */}
        <Text style={styles.label}>Editar Apellido</Text>
        <TextInput
          style={styles.input}
          value={apellido}
          onChangeText={setApellido}
          placeholder="Ingrese su apellido"
          autoCapitalize="words"
        />

        {/* GUARDAR CAMBIOS */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={guardarCambios}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#0A72AB" />
          ) : (
            <Text style={styles.saveText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7E7D8',
  },
  header: {
    height: 75,
    backgroundColor: '#0A72AB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  logo: {
    width: 55,
    height: 55,
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 28,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#272727',
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    color: '#272727',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    height: 45,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#544F4D',
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#0A72AB',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 45,
  },
  saveText: {
    color: '#0A72AB',
    fontSize: 15,
  },
});

