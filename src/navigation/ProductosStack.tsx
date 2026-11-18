import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProductoForm } from '../screens/ProductoForm';
import { Productos } from '../screens/Productos';
import type { ProductosStackParamList } from './types';

const Stack = createNativeStackNavigator<ProductosStackParamList>();

export function ProductosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Productos" component={Productos} />
      <Stack.Screen name="ProductoForm" component={ProductoForm} />
    </Stack.Navigator>
  );
}
