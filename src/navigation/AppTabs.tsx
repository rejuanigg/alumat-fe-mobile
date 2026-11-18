import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBar } from '../components/TabBar';
import { ProductsProvider } from '../context/ProductsContext';
import { Inicio } from '../screens/Inicio';
import { PerfilStack } from './PerfilStack';
import { ProductosStack } from './ProductosStack';
import type { AppTabsParamList } from './types';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <ProductsProvider>
      <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen name="Inicio" component={Inicio} />
        <Tab.Screen name="ProductosTab" component={ProductosStack} options={{ title: 'Productos' }} />
        <Tab.Screen name="PerfilTab" component={PerfilStack} options={{ title: 'Perfil' }} />
      </Tab.Navigator>
    </ProductsProvider>
  );
}
