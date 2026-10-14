
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductList from '../screens/Products/ProductList';
import ProductForm from '../screens/Products/ProductForm';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductList" component={ProductList} options={{ title: 'Productos' }} />
      <Stack.Screen name="ProductForm" component={ProductForm} options={{ title: 'Producto' }} />
    </Stack.Navigator>
  );
}