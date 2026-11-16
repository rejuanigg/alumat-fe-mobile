import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';

// ---------------------------------------------------------------------------
// Piezas compartidas por las pantallas de acceso (Login, SignUp, ForgotPassword)
// ---------------------------------------------------------------------------

// Colores
export const COLORS = {
  // Debe coincidir con el fondo opaco de los PNG decorativos (#E7E7D8),
  // si no se nota el recuadro de cada imagen.
  background: '#E7E7D8',
  surface: '#F3F3EA',
  border: '#D6D7C4',
  circle: '#E4E5D3',
  title: '#3A4A5A',
  text: '#6B7A8A',
  primary: '#0873A8',
  error: '#E53935',
  success: '#2E7D32',
  white: '#FFFFFF',
};

// Assets (PNG)
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

// Sombra compatible con iOS, Android y web
export const softShadow = (opacity = 0.08) =>
  Platform.select({
    web: { boxShadow: `0px 4px 12px rgba(58, 74, 90, ${opacity})` },
    android: { elevation: 3 },
    default: {
      shadowColor: '#3A4A5A',
      shadowOpacity: opacity,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
  });

// ---------------------------------------------------------------------------
// Decoraciones de fondo: van fuera del SafeAreaView para quedar pegadas a los
// bordes reales de la pantalla. Nunca interceptan toques.
// ---------------------------------------------------------------------------
export function AuthDecorations() {
  const { width } = useWindowDimensions();
  // Se calculan sobre un ancho máximo para que en web no se agranden demasiado
  const base = Math.min(width, 480);

  return (
    <View style={styles.decorations} pointerEvents="none">
      <Image
        source={ASSETS.blobTopLeft}
        style={[
          styles.blobTopLeft,
          sized(base * 0.36, RATIOS.blobTopLeft),
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
          styles.dotsTopRight,
          sized(base * 0.14, RATIOS.dots),
        ]}
        resizeMode="contain"
      />
      <Image
        source={ASSETS.dots}
        style={[
          styles.dotsBottomLeft,
          sized(base * 0.14, RATIOS.dots),
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Campo reutilizable: píldora con ícono, label y contenido (TextInput).
// `compact` achica un poco la píldora para formularios largos (SignUp).
// ---------------------------------------------------------------------------
export function Field({ Icon, label, error, right, children, compact = false }) {
  return (
    <View style={[styles.fieldWrapper, compact && styles.fieldWrapperCompact]}>
      <View
        style={[
          styles.pill,
          compact && styles.pillCompact,
          error ? styles.pillError : null,
        ]}
      >
        <View style={[styles.iconCircle, compact && styles.iconCircleCompact]}>
          <Icon size={compact ? 20 : 22} color={COLORS.title} strokeWidth={1.75} />
        </View>

        <View style={styles.fieldBody}>
          <Text style={[styles.fieldLabel, compact && styles.fieldLabelCompact]}>
            {label}
          </Text>
          {children}
        </View>

        {right}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  decorations: {
    ...StyleSheet.absoluteFillObject,
    // Que ninguna pieza agrande el área scrolleable de la página en web
    overflow: 'hidden',
  },

  // Decoraciones
  blobTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    // Reutiliza la imagen de la esquina superior izquierda, girada
    transform: [{ rotate: '180deg' }],
  },
  dotsTopRight: {
    position: 'absolute',
    top: '6%',
    right: '8%',
  },
  dotsBottomLeft: {
    position: 'absolute',
    bottom: '4%',
    left: '7%',
  },

  // Campo
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldWrapperCompact: {
    marginBottom: 14,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 18,
    ...softShadow(0.06),
  },
  pillCompact: {
    paddingVertical: 9,
    paddingLeft: 12,
  },
  pillError: {
    borderColor: COLORS.error,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  fieldBody: {
    flex: 1,
  },

  fieldLabel: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 2,
  },
  fieldLabelCompact: {
    fontSize: 12,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 20,
  },
});
