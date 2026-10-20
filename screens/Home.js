import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>

      <StatusBar
        style="light"
      />

      <ScrollView
        contentContainerStyle={styles.content}
      >

        {/*bienvenida*/}
        <Text style={styles.welcome}>
          ¡Hola Tomas!
        </Text>

        <Text style={styles.subtitle}>
          Aquí está tu resumen de tu jornada actual
        </Text>

        {/*tarjetas*/}
        <View style={styles.cardsContainer}>

          {/*mis boletas*/}
          <CustomCard style={styles.card}>
            <View style={styles.cardMainContent}>
              <View style={styles.cardTextGroup}>
                <Text style={styles.cardTitle}>MIS BOLETAS</Text>
                <View style={styles.countAndTag}>
                  <Text style={styles.cardNumber}>2</Text>
                  <View style={styles.statusTagContainer}>
                    <Text style={styles.statusTagText}>Activo</Text>
                  </View>
                </View>
                <Text style={styles.cardDescription}>Pendientes en gestión</Text>
              </View>
              <View style={styles.cardIconBox}>
                <FontAwesome name="file-text-o" size={24} color="#0A72AB" />
              </View>
            </View>
          </CustomCard>

          {/*productos-boton funcional*/}
          <TouchableOpacity
            style={styles.cardButton}
            activeOpacity={0.8}
            onPress={irAProductos}
          >
            <CustomCard style={styles.cardTouchable}>
              <View style={styles.cardMainContent}>
                <View style={styles.cardTextGroup}>
                  <Text style={styles.cardTitle}>PRODUCTOS</Text>
                  <View style={styles.countAndTag}>
                    <Text style={styles.cardNumber}>3</Text>
                    <View style={styles.statusTagContainer}>
                      <Text style={styles.statusTagText}>Activo</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDescription}>En proceso de creación</Text>
                </View>
                <View style={styles.cardIconBox}>
                  <FontAwesome name="cube" size={24} color="#0A72AB" />
                </View>
              </View>
            </CustomCard>
          </TouchableOpacity>

          {/*pedidos*/}
          <CustomCard style={styles.card}>
            <View style={styles.cardMainContent}>
              <View style={styles.cardTextGroup}>
                <Text style={styles.cardTitle}>PEDIDOS</Text>
                <View style={styles.countAndTag}>
                  <Text style={styles.cardNumber}>1</Text>
                  <View style={styles.statusTagContainer}>
                    <Text style={styles.statusTagText}>Activo</Text>
                  </View>
                </View>
                <Text style={styles.cardDescription}>En preparación</Text>
              </View>
              <View style={styles.cardIconBox}>
                <FontAwesome name="shopping-cart" size={24} color="#0A72AB" />
              </View>
            </View>
          </CustomCard>

          {/*inventario*/}
          <CustomCard style={styles.card}>
            <View style={styles.cardMainContent}>
              <View style={styles.cardTextGroup}>
                <Text style={styles.cardTitle}>INVENTARIO</Text>
                <View style={styles.countAndTag}>
                  <Text style={styles.cardNumber}>4</Text>
                  <View style={styles.statusTagContainer}>
                    <Text style={styles.statusTagText}>Activo</Text>
                  </View>
                </View>
                <Text style={styles.cardDescription}>Producto en stock bajo</Text>
              </View>
              <View style={styles.cardIconBox}>
                <FontAwesome name="archive" size={24} color="#0A72AB" />
              </View>
            </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
  },

  logo: {
    width: 55,
    height: 55,
  },

  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIconButton: {
    marginLeft: 18,
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
    width: '100%',
  },

  card: {
    width: '100%',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
  },

  cardButton: {
    width: '100%',
    marginVertical: 6,
  },

  cardTouchable: {
    width: '100%',
    padding: 16,
    marginVertical: 0,
    borderRadius: 12,
  },

  cardMainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTextGroup: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#706F8A',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  countAndTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginRight: 10,
  },

  statusTagContainer: {
    backgroundColor: '#D6EAF3',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  statusTagText: {
    color: '#0A72AB',
    fontSize: 10,
    fontWeight: 'bold',
  },

  cardDescription: {
    fontSize: 12,
    color: '#706F8A',
  },

  cardIconBox: {
    backgroundColor: '#E2EFF6',
    borderRadius: 10,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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


