import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, type } from '../theme/tokens';

type Props = {
  /** Sobre navy el texto se muestra en blanco; el isotipo conserva sus colores. */
  inverted?: boolean;
  size?: number;
};

export function Logo({ inverted = false, size = 26 }: Props) {
  return (
    <View style={styles.row} accessible accessibilityRole="image" accessibilityLabel="ALUMAT">
      <Image
        source={require('../../assets/icon.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      <Text style={[type.logo, { color: inverted ? colors.white : colors.navy, fontSize: size * 0.7 }]}>
        ALUMAT
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
