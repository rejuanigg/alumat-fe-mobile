
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import CustomCard from '../src/components/CustomCard';

export default function Home({ navigation }) {

  // CERRAR SESION
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      // Firebase detecta el cierre de sesión
    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema al cerrar sesión.'
      );
    }
  };

  // IR A PRODUCTOS
  const irAProductos = () => {
    navigation.navigate('Products');
  };

  return (
    <View style={styles.screen}>

      <StatusBar
        backgroundColor="#0A72AB"
        barStyle="light-content"
      />

      
      {/* ENCABEZADO AZUL */}
     <View style={styles.header}>
  <Image
    source={require('../assets/isotipo.png')}
    style={styles.logo}
    resizeMode="contain"
  />

  <TouchableOpacity
    onPress={() => navigation.navigate('User')}
    accessibilityLabel="Ver mi perfil"
  >
    <FontAwesome
      name="user-circle"
      size={28}
      color="#FFFFFF"
    />
  </TouchableOpacity>
</View>


      <ScrollView
        contentContainerStyle={styles.content}
      >

        {/* BIENVENIDA */}
        <Text style={styles.welcome}>
          ¡Hola!
        </Text>

        <Text style={styles.subtitle}>
          Aquí está el resumen de tu jornada actual
        </Text>

        {/* TARJETAS */}
        <View style={styles.cardsContainer}>

          {/* MIS BOLETAS */}
          <CustomCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Mis boletas
              </Text>

              <FontAwesome
                name="file-text-o"
                size={24}
                color="#0A72AB"
              />
            </View>

            <Text style={styles.cardNumber}>2</Text>

            <Text style={styles.cardDescription}>
              Pendientes en gestión
            </Text>
          </CustomCard>

          {/* PRODUCTOS - BOTON FUNCIONAL */}
          <TouchableOpacity
            style={styles.cardButton}
            activeOpacity={0.8}
            onPress={irAProductos}
          >
            <CustomCard style={styles.cardTouchable}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  Productos
                </Text>

                <FontAwesome
                  name="cube"
                  size={24}
                  color="#0A72AB"
                />
              </View>

              <Text style={styles.cardNumber}>3</Text>

              <Text style={styles.cardDescription}>
                En proceso de creación
              </Text>
            </CustomCard>
          </TouchableOpacity>

          {/* PEDIDOS */}
          <CustomCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Pedidos
              </Text>

              <FontAwesome
                name="shopping-cart"
                size={24}
                color="#0A72AB"
              />
            </View>

            <Text style={styles.cardNumber}>1</Text>

            <Text style={styles.cardDescription}>
              En preparación
            </Text>
          </CustomCard>

          {/* INVENTARIO */}
          <CustomCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Inventario
              </Text>

              <FontAwesome
                name="archive"
                size={24}
                color="#0A72AB"
              />
            </View>

            <Text style={styles.cardNumber}>4</Text>

            <Text style={styles.cardDescription}>
              Productos con stock bajo
            </Text>
          </CustomCard>

        </View>

        {/* CERRAR SESION */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogOut}
        >
          <FontAwesome
            name="sign-out"
            size={18}
            color="#706F8A"
          />

          <Text style={styles.logoutText}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  screen: {
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
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 30,
  },

  welcome: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4D5061',
  },

  subtitle: {
    fontSize: 13,
    color: '#706F8A',
    marginTop: 8,
    marginBottom: 30,
  },

  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },

  // TARJETAS NORMALES
  card: {
    width: '48%',
    minHeight: 150,
    padding: 12,
    marginVertical: 7,
  },

  // CONTENEDOR DEL BOTON PRODUCTOS
  cardButton: {
    width: '48%',
    marginVertical: 7,
  },

  // TARJETA PRODUCTOS
  cardTouchable: {
    width: '100%',
    minHeight: 150,
    padding: 12,
    marginVertical: 0,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4D5061',
    flexShrink: 1,
  },

  cardNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0A72AB',
    marginTop: 15,
  },

  cardDescription: {
    fontSize: 11,
    color: '#706F8A',
    marginTop: 5,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
    gap: 10,
  },

  logoutText: {
    color: '#706F8A',
    fontSize: 14,
  },

});




