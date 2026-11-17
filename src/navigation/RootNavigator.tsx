import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/tokens';
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';

const navTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.blue, text: colors.ink },
};

export function RootNavigator() {
  const { user } = useAuth();
  // Al cambiar de árbol (sesión iniciada / cerrada) el stack anterior se descarta por completo.
  return <NavigationContainer theme={navTheme}>{user ? <AppTabs /> : <AuthStack />}</NavigationContainer>;
}
