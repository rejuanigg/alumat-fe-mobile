import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, sizes } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

const TABS: Record<string, { label: string; icon: IconName }> = {
  Inicio: { label: 'Inicio', icon: 'home' },
  ProductosTab: { label: 'Productos', icon: 'box' },
  PerfilTab: { label: 'Perfil', icon: 'user' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // En Android la barra quedaría sobre el teclado: la ocultamos mientras está abierto.
  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (keyboardOpen) return null;

  return (
    <View style={[styles.bar, { height: sizes.tabBar + insets.bottom, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const focused = state.index === index;
        const color = focused ? colors.blue : colors.muted;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            aria-selected={focused}
            style={styles.tab}
          >
            <Icon name={tab.icon} color={color} size={24} strokeWidth={focused ? 2.4 : 1.8} />
            <Text style={[styles.label, { color, fontFamily: focused ? fonts.bold : fonts.medium }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: colors.surface },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: sizes.touch },
  label: { fontSize: 12, lineHeight: 15 },
});
