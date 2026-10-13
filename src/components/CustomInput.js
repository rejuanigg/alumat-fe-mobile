import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { theme } from '../theme/theme';

export default function CustomInput({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginVertical: 8 },
  input: {
    height: 48,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMain,
  },
});