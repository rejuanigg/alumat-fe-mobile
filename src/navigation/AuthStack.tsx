import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Login } from '../screens/auth/Login';
import { Placeholder } from '../screens/Placeholder';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registro" component={Placeholder} />
      <Stack.Screen name="Olvide" component={Placeholder} />
      <Stack.Screen name="Codigo" component={Placeholder} />
      <Stack.Screen name="Nueva" component={Placeholder} />
      <Stack.Screen name="Listo" component={Placeholder} />
    </Stack.Navigator>
  );
}
