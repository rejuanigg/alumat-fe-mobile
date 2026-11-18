import { Image, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import type { Category } from '../services/types';
import { colors, radii } from '../theme/tokens';

/** Colores por categoría cuando el producto no tiene imagen: [fondo, ilustración]. */
export const CATEGORY_COLORS: Record<Category, readonly [string, string]> = {
  Ventanas: [colors.fillFilled, colors.blue],
  Puertas: [colors.navy, colors.white],
  Persianas: [colors.amberBg, '#C98A00'],
  Accesorios: [colors.successBg, '#1B7A3A'],
  Otros: [colors.fill, colors.muted],
};

type Props = {
  category: Category;
  imageUri: string | null;
  width: number;
  height: number;
  radius?: number;
};

export function ProductThumb({ category, imageUri, width, height, radius = radii.field }: Props) {
  const [bg, fg] = CATEGORY_COLORS[category];
  const box = { width, height, borderRadius: radius };
  if (imageUri) {
    return <Image source={{ uri: imageUri }} style={box} resizeMode="cover" accessibilityIgnoresInvertColors />;
  }
  const s = Math.min(width, height) * 0.5;
  return (
    <View style={[styles.base, box, { backgroundColor: bg }]}>
      <Svg width={s} height={s} viewBox="0 0 24 24">
        <Rect x={3} y={3} width={8} height={18} rx={1} fill={fg} opacity={0.9} />
        <Rect x={13} y={3} width={8} height={11} rx={1} fill={fg} opacity={0.55} />
        <Rect x={13} y={16} width={8} height={5} rx={1} fill={fg} opacity={0.3} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});
