import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { ImageIcon } from 'lucide-react-native';

import { COLORS } from '../../theme/colors';

// ---------------------------------------------------------------------------
// Imagen del producto. Mientras no haya imagen (`uri` vacío) muestra un fondo
// de la paleta con un ícono, del mismo tamaño que tendrá la foto: cuando se
// cargue `imageUrl` en Firestore, se rellena sin cambiar el diseño.
// - size: lado del cuadrado (lista). Sin size ocupa el ancho disponible con
//   proporción 16:9 (formulario).
// - label: texto opcional debajo del ícono (solo en el formato grande)
// ---------------------------------------------------------------------------
export default function ProductImage({ uri, size, label, style }) {
  const frame = size
    ? { width: size, height: size, borderRadius: 20 }
    : { width: '100%', aspectRatio: 16 / 9, borderRadius: 28 };

  return (
    <ImageBackground
      source={uri ? { uri } : null}
      resizeMode="cover"
      style={[styles.frame, frame, style]}
      imageStyle={{ borderRadius: frame.borderRadius }}
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      {uri ? null : (
        <View style={styles.placeholder}>
          <ImageIcon
            size={size ? size * 0.38 : 44}
            color={COLORS.text}
            strokeWidth={1.5}
          />
          {label && !size ? <Text style={styles.label}>{label}</Text> : null}
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: COLORS.circle,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  label: {
    fontSize: 14,
    color: COLORS.text,
  },
});
