import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';

export default function ProductForm({ route, navigation }) {
  // Verificamos si pasamos un producto por parámetro (Modo Edición)
  const product = route.params?.product;
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
      });
    }
  }, [product]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{isEditing ? 'EDITAR PRODUCTOS' : 'PRODUCTOS'}</Text>
        <View style={styles.separator} />
        <Text style={styles.subtitle}>
          Crea, edita y gestiona los productos de la empresa ALUMAT
        </Text>
      </View>

      <View style={styles.formContainer}>
        {/* Aquí puedes reemplazar por tu <CustomInput> */}
        <Text style={styles.label}>Nombre del producto</Text>
        <TextInput 
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Ej: Vidrio templado 6mm"
        />

        <Text style={styles.label}>Categorías</Text>
        <TextInput 
          style={styles.input}
          value={formData.category}
          onChangeText={(text) => handleChange('category', text)}
          placeholder="Seleccionar categoría..."
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Descripción del producto..."
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput 
          style={styles.input}
          value={formData.price}
          onChangeText={(text) => handleChange('price', text)}
          placeholder="$ 0,00"
          keyboardType="numeric"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    textTransform: 'uppercase',
  },
  separator: {
    height: 2,
    backgroundColor: '#CCC',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
});