import React from 'react';
import { Text, View , FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar'


const mockProducts = [
  { id: '1', name: 'Vidrio templado 6mm', category: 'Vidrio', price: '90000', stock: false, description: 'Este vidrio es templado con un grosor de 6mm' },
  { id: '2', name: 'Vidrio templado 5x5', category: 'Vidrio', price: '45000', stock: false, description: 'Vidrio templado de 5x5' },
];

export default function ProductList({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>Categoría: {item.category}</Text>
        <View style={styles.cardActions}>
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>{item.stock ? 'EN STOCK' : 'SIN STOCK'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('ProductForm', { product: item })}
          >
            <Text style={styles.editButtonText}>Editar {'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
      <StatusBar
        style="light"
      />
    <View style={[styles.container, { paddingTop: 10 }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>PRODUCTOS</Text>
        <View style={styles.separator} />
        <Text style={styles.subtitle}>
          Crea, edita y gestiona los productos de la empresa ALUMAT
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('ProductForm')}
        >
          <Text style={styles.addButtonText}>+ Nuevo producto</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  screen: {
    flex: 1,
    backgroundColor: '#F3F2E7',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F2E7', 
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  separator: {
    height: 2,
    backgroundColor: '#CCC',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#1C75B9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#EEE',
    borderRadius: 5,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockBadge: {
    backgroundColor: '#D32F2F',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  stockText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#1C75B9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
});
