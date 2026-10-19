import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../../src/config/firebaseConfig';

export default function UserView({ navigation }) {
  const insets = useSafeAreaInsets();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');

  useFocusEffect(
    useCallback(() => {
      const actualizarDatos = async () => {
        const user = auth.currentUser;

        if (user) {
          await user.reload();
          setNombreCompleto(user.displayName || '');
          setCorreo(user.email || '');
        }
      };

      actualizarDatos().catch(() => {
        const user = auth.currentUser;
        setNombreCompleto(user?.displayName || '');
        setCorreo(user?.email || '');
      });
    }, [])
  );

  const partes = nombreCompleto.trim().split(/\s+/);
  const nombre = partes[0] || 'Sin registrar';
  const apellido = partes.slice(1).join(' ') || 'Sin registrar';

  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar style="light" />

      {/* Header azul: cubre la barra de estado */}
      <View
        style={[
          styles.header,
          { height: 75 + insets.top, paddingTop: insets.top },
        ]}
      >
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
        <Text style={styles.title}>MI PERFIL</Text>

        <View style={styles.avatar}>
          <FontAwesome name="user" size={65} color="#706F8A" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{nombre}</Text>

          <Text style={styles.label}>Apellido</Text>
          <Text style={styles.value}>{apellido}</Text>

          <Text style={styles.label}>Correo electrónico</Text>
          <Text style={styles.value}>{correo}</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('UserForm')}
        >
          <Text style={styles.editText}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7E7D8',
  },
  header: {
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
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 35,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4D5061',
    marginBottom: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4D5061',
    marginTop: 15,
    marginBottom: 7,
  },
  value: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    color: '#544F4D',
    fontSize: 16,
  },
  editButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#0A72AB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  editText: {
    color: '#0A72AB',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#C0392B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 18,
  },
  logoutText: {
    color: '#C0392B',
    fontWeight: 'bold',
    fontSize: 16,
  },
});