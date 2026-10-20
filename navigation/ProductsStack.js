import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navbarScreenOptions } from '../src/components/Navbar';
import ProductList from '../screens/Products/ProductList';
import ProductForm from '../screens/Products/ProductForm';

const Stack = createStackNavigator();

export default function ProductsStack() {
    return (
        <Stack.Navigator screenOptions={navbarScreenOptions}>
            <Stack.Screen name="ProductList" component={ProductList} />
            <Stack.Screen name="ProductForm" component={ProductForm} />
        </Stack.Navigator>
    );
}
