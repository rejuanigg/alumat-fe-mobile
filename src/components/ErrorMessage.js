import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { theme } from '../theme/theme';

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FDEDEC',
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginVertical: 6,
  },
  text: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.caption,
    textAlign: 'center',
  },
});