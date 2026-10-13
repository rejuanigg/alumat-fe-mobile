import React from 'react';
import { Button, Text, View } from 'react-native';

export default function ProductList({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>TODO: listado de productos</Text>
      <Button title="Nuevo producto" onPress={() => navigation.navigate('ProductForm')} />
      <Button title="Ver detalle" onPress={() => navigation.navigate('ProductDetail')} />
    </View>
  );
}