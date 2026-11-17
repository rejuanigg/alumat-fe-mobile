import { StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { colors, sizes } from '../theme/tokens';

type Props = {
  width: number;
  height: number;
  /** Escala de los paños (Listo usa paños más grandes). */
  scale?: number;
};

/**
 * Cinco rectángulos que evocan paños de ventana, anclados a la mitad derecha del hero.
 * Las coordenadas están pensadas para 390 px de ancho; en pantallas más anchas o angostas
 * se desplazan para quedar siempre alineados a la derecha.
 */
export function Panes({ width, height, scale = 1 }: Props) {
  const h = height;
  const a = 0.62 * h;
  const w = sizes.designWidth;
  const s = scale;
  // Desplazamiento para mantener los paños pegados al borde derecho.
  const dx = width - w * s;
  return (
    <Svg pointerEvents="none" width={width} height={h} style={StyleSheet.absoluteFill}>
      <Rect x={dx + 214 * s} y={-20} width={84 * s} height={a} fill={colors.blue} opacity={0.55} />
      <Rect x={dx + 302 * s} y={-20} width={84 * s} height={a} fill={colors.blue} opacity={0.3} />
      <Rect x={dx + 214 * s} y={a - 16} width={84 * s} height={0.6 * h} fill={colors.blue} opacity={0.18} />
      <Rect x={dx + 302 * s} y={a - 16} width={84 * s} height={0.6 * h} fill={colors.white} opacity={0.1} />
      <Rect x={dx + 172 * s} y={30} width={38 * s} height={0.4 * h} fill={colors.white} opacity={0.07} />
    </Svg>
  );
}
