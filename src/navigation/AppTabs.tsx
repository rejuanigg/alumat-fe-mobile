import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Placeholder } from '../screens/Placeholder';
import type { AppTabsParamList } from './types';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={Placeholder} />
    </Tab.Navigator>
  );
}
