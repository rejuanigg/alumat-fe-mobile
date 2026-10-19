import Navbar from '../../src/components/Navbar';
import React from 'react';
import { Text, View } from 'react-native';

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={{ padding: 16 }}>
      <Text>TODO: formulario crear/editar producto</Text>
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7E7D8',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textTransform: 'uppercase',
  },
  separator: {
    height: 2,
    backgroundColor: '#CCC',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
});