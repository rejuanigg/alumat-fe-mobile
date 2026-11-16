import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, User } from 'lucide-react-native';

import { COLORS as BASE_COLORS } from '../theme/colors';
import { ASSETS } from './ScreenDecorations';

const COLORS = {
  ...BASE_COLORS,
  header: '#0E6FA3',
};

const NAVBAR_HEIGHT = 56;

// Se usa como header de todas las pantallas post-login (ver navigation/)
export default function Navbar({ navigation }) {
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();

  return (
    <View
      style={[
        styles.navbar,
        { paddingTop: insets.top, height: NAVBAR_HEIGHT + insets.top },
      ]}
    >
      <StatusBar style="light" />

      {/* Izquierda: volver (si hay a dónde) + logo + marca */}
      <View style={styles.left}>
        {canGoBack && (
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={10}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <ArrowLeft size={24} color={COLORS.white} strokeWidth={2} />
          </Pressable>
        )}

        <Image source={ASSETS.logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brandText}>ALUMAT</Text>
      </View>

      {/* Derecha: perfil de usuario */}
      <Pressable
        onPress={() => navigation.navigate('User')}
        accessibilityRole="button"
        accessibilityLabel="Ver perfil"
        hitSlop={10}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <User size={26} color={COLORS.white} strokeWidth={1.75} />
      </Pressable>
    </View>
  );
}

export const navbarScreenOptions = {
  header: (props) => <Navbar {...props} />,
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.header,
    paddingHorizontal: 20,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  backButton: {
    marginRight: 4,
  },

  logo: {
    width: 28,
    height: 34,
  },

  brandText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.85,
  },
});
