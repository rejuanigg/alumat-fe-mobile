import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Codigo } from '../screens/auth/Codigo';
import { Listo } from '../screens/auth/Listo';
import { Login } from '../screens/auth/Login';
import { Nueva } from '../screens/auth/Nueva';
import { Olvide } from '../screens/auth/Olvide';
import { Registro } from '../screens/auth/Registro';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registro" component={Registro} />
      <Stack.Screen name="Olvide" component={Olvide} />
      <Stack.Screen name="Codigo" component={Codigo} />
      <Stack.Screen name="Nueva" component={Nueva} />
      <Stack.Screen name="Listo" component={Listo} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
