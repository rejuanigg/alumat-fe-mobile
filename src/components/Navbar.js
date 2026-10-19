import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Image
        source={require('../../assets/isotipo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: '#0A72AB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 42,
    height: 42,
  },
});