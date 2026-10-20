import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

// Se usa como header de los stacks post-login (ver navigation/)
export default function Navbar({ navigation }) {
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();

  return (
    <View style={[styles.navbar, { paddingTop: insets.top, height: 60 + insets.top }]}>
      {/* Volver (o espacio vacío para mantener el logo centrado) */}
      <View style={styles.side}>
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
            <FontAwesome name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <Image
        source={require('../../assets/isotipo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Perfil de usuario */}
      <View style={[styles.side, styles.right]}>
        <TouchableOpacity onPress={() => navigation.navigate('User')} hitSlop={10}>
          <Image
            source={require('../userIcon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const navbarScreenOptions = {
  header: (props) => <Navbar {...props} />,
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#0A72AB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  side: { width: 28 },
  right: { alignItems: 'flex-end' },
  logo: { width: 42, height: 42 },
  icon: { width: 28, height: 28 },
});
