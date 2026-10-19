import Navbar from '../src/components/Navbar';
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
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import CustomCard from '../src/components/CustomCard';

export default function Home({ navigation }) {

  // cerrar sesion
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

  // Ir a productos
  const irAProductos = () => {
    navigation.navigate('Products');
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>

      <StatusBar
        style="light"
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

        {/*bienvenida*/}
        <Text style={styles.welcome}>
          ¡Hola!
        </Text>

        <Text style={styles.subtitle}>
          Aquí está el resumen de tu jornada actual
        </Text>

        {/*tarjetas*/}
        <View style={styles.cardsContainer}>

          {/*mis boletas*/}
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

          {/*productos-boton funcional*/}
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

          {/*pedidos*/}
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

          {/*inventario*/}
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

        {/*cerrar sesion*/}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: '#E7E7D8',
  },

  header: {
    backgroundColor: '#0A72AB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
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

  //tarjetas normales
  card: {
    width: '48%',
    minHeight: 150,
    padding: 12,
    marginVertical: 7,
  },

  //contenedor del boton productos
  cardButton: {
    width: '48%',
    marginVertical: 7,
  },

  //tarjeta productos
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




