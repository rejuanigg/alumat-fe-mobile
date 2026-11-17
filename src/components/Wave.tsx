import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, sizes } from '../theme/tokens';

type Props = {
  color?: string;
};

/** Curva de 390×40 que se superpone 39 px sobre el borde inferior del hero. */
export function Wave({ color = colors.surface }: Props) {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Svg width="100%" height={sizes.waveHeight} viewBox="0 0 390 40" preserveAspectRatio="none">
        <Path d="M0 26 C 70 -6, 130 -6, 195 18 S 330 46, 390 8 V40 H0 Z" fill={color} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -(sizes.waveHeight - sizes.waveOverlap),
    height: sizes.waveHeight,
  },
});
