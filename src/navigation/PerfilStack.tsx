import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EditarPerfil } from '../screens/EditarPerfil';
import { Perfil } from '../screens/Perfil';
import type { PerfilStackParamList } from './types';

const Stack = createNativeStackNavigator<PerfilStackParamList>();

export function PerfilStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
    </Stack.Navigator>
  );
}
