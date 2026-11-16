import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';

// ---------------------------------------------------------------------------
// Assets (PNG)
// ---------------------------------------------------------------------------
export const ASSETS = {
  logo: require('../assets/icon.png'),
  blobTopLeft: require('../assets/visual-login-elements/1.png'),
  // Misma imagen que la de arriba: se gira 180° en los estilos (blobBottomRight)
  blobBottomRight: require('../assets/visual-login-elements/1.png'),
  dots: require('../assets/visual-login-elements/2.png'),
};

// Proporción real (ancho / alto) de cada PNG, para que no queden con huecos
// ni desplazados de la esquina.
export const ratioOf = (asset) => {
  try {
    const s = Image.resolveAssetSource(asset);
    return s && s.width && s.height ? s.width / s.height : 1;
  } catch (e) {
    return 1;
  }
};

const RATIOS = {
  blobTopLeft: ratioOf(ASSETS.blobTopLeft),
  blobBottomRight: ratioOf(ASSETS.blobBottomRight),
  dots: ratioOf(ASSETS.dots),
};

// Ancho y alto explícitos: en web, una Image sin height toma el alto real del
// PNG (2000px) e ignora aspectRatio, y la decoración queda fuera de pantalla.
const sized = (width, ratio) => ({ width, height: width / ratio });

// ---------------------------------------------------------------------------
// Decoraciones de fondo. Van fuera del SafeAreaView para quedar pegadas a los
// bordes reales de la pantalla y nunca interceptan toques.
// - topOffset: alto de un header fijo; las piezas de arriba arrancan debajo.
// - dotsTop / dotsRight / dotsBottom / dotsLeft: fracción del alto / ancho de
//   la ventana para ubicar las grillas de puntos.
// ---------------------------------------------------------------------------
export default function ScreenDecorations({
  topOffset = 0,
  dotsTop = 0.06,
  dotsRight = 0.08,
  dotsBottom = 0.04,
  dotsLeft = 0.07,
}) {
  const { width, height } = useWindowDimensions();
  // Se calculan sobre un ancho máximo para que en web no se agranden demasiado
  const base = Math.min(width, 480);

  return (
    <View style={styles.decorations} pointerEvents="none">
      <Image
        source={ASSETS.blobTopLeft}
        style={[
          styles.blobTopLeft,
          { top: topOffset, ...sized(base * 0.36, RATIOS.blobTopLeft) },
        ]}
        resizeMode="contain"
      />
      <Image
        source={ASSETS.blobBottomRight}
        style={[
          styles.blobBottomRight,
          sized(base * 0.3, RATIOS.blobBottomRight),
        ]}
        resizeMode="contain"
      />
      <Image
        source={ASSETS.dots}
        style={[
          styles.dots,
          {
            top: topOffset + height * dotsTop,
            right: width * dotsRight,
            ...sized(base * 0.14, RATIOS.dots),
          },
        ]}
        resizeMode="contain"
      />
      <Image
        source={ASSETS.dots}
        style={[
          styles.dots,
          {
            bottom: height * dotsBottom,
            left: width * dotsLeft,
            ...sized(base * 0.14, RATIOS.dots),
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  decorations: {
    ...StyleSheet.absoluteFillObject,
    // Que ninguna pieza agrande el área scrolleable de la página en web
    overflow: 'hidden',
  },

  blobTopLeft: {
    position: 'absolute',
    left: 0,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    // Reutiliza la imagen de la esquina superior izquierda, girada
    transform: [{ rotate: '180deg' }],
  },
  dots: {
    position: 'absolute',
  },
});
