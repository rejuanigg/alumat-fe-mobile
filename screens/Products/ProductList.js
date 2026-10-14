import Navbar from '../../src/components/Navbar';
import React from 'react';
import { Text, View , FlatList, TouchableOpacity, } from 'react-native';
import styles from './Productosliststylle';

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
    <View style={styles.container}>
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
    )
  }
