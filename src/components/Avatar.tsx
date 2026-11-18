import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme/tokens';

type Props = {
  initials: string;
  photoUri?: string | null;
  size: number;
  background?: string;
  color?: string;
};

export function Avatar({ initials, photoUri, size, background = colors.white, color = colors.navy }: Props) {
  const shape = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={[styles.base, shape, { backgroundColor: background }]}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={shape} accessibilityIgnoresInvertColors />
      ) : (
        <Text style={[styles.text, { color, fontSize: Math.round(size * 0.36) }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  text: { fontFamily: fonts.extrabold, letterSpacing: 0.5 },
});
