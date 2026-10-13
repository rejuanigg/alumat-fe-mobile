import React from 'react';
import { Button, Text, View } from 'react-native';

export default function ProductDetail({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>TODO: detalle del producto</Text>
      <Button title="Editar" onPress={() => navigation.navigate('ProductForm')} />
    </View>
  );
}