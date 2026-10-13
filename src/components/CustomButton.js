import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export default function CustomButton({ title, onPress, type = 'primary' }) {
  return (
    <TouchableOpacity 
      style={[styles.button, type === 'secondary' ? styles.secondary : styles.primary]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, type === 'secondary' ? styles.textSecondary : styles.textPrimary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48, borderRadius: theme.borderRadius.md, justifyContent: 'center', alignItems: 'center', marginVertical: 8, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, elevation: 3
  },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary },
  text: { fontSize: theme.typography.sizes.body, fontWeight: theme.typography.weights.bold },
  textPrimary: { color: '#FFF' },
  textSecondary: { color: theme.colors.primary },
});