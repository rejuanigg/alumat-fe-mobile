import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, sizes, spacing, type } from '../theme/tokens';
import { pickImage, type PickedImage } from '../utils/imagePicker';
import { Icon } from './Icon';

type Props = {
  label: string;
  value: PickedImage | null;
  onChange: (image: PickedImage | null) => void;
  error?: string;
};

const HEIGHT = 170;

export function ImagePickerField({ label, value, onChange, error }: Props) {
  const [pickError, setPickError] = useState<string | null>(null);
  const shownError = pickError ?? error;

  const choose = async () => {
    const result = await pickImage('product');
    if (result.status === 'ok') {
      setPickError(null);
      onChange(result.image);
    } else if (result.status === 'error') {
      setPickError(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[type.label, styles.label]}>{label}</Text>
      {value ? (
        <View style={styles.previewWrap}>
          <Image
            source={{ uri: value.uri }}
            style={styles.preview}
            resizeMode="cover"
            accessibilityLabel={`Vista previa: ${value.name}`}
          />
          <View style={styles.fileRow}>
            <Text style={[type.body, styles.fileName]} numberOfLines={1}>
              {value.name}
            </Text>
            <Pressable
              onPress={choose}
              accessibilityRole="button"
              accessibilityLabel="Cambiar imagen"
              style={styles.action}
              hitSlop={4}
            >
              <Text style={[type.body, styles.link]}>Cambiar</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setPickError(null);
                onChange(null);
              }}
              accessibilityRole="button"
              accessibilityLabel="Quitar imagen"
              style={styles.action}
              hitSlop={4}
            >
              <Text style={[type.body, styles.remove]}>Quitar</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={choose}
          accessibilityRole="button"
          accessibilityLabel="Subir imagen. PNG, JPG o WEBP, máximo 2 MB"
          style={({ pressed }) => [styles.drop, shownError ? styles.dropError : null, pressed && styles.pressed]}
        >
          <Icon name="image" color={shownError ? colors.error : colors.blue} size={30} />
          <Text style={[type.bodyStrong, { color: shownError ? colors.error : colors.link }]}>Subir imagen</Text>
          <Text style={[type.small, styles.muted]}>PNG, JPG o WEBP · máx. 2 MB</Text>
        </Pressable>
      )}
      {shownError ? (
        <Text style={styles.error} accessibilityLiveRegion="polite" accessibilityRole="alert">
          {shownError}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { color: colors.ink },
  drop: {
    height: HEIGHT,
    borderRadius: radii.field,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dropError: { backgroundColor: colors.errorBg },
  pressed: { opacity: 0.8 },
  muted: { color: colors.muted },
  previewWrap: { borderRadius: radii.field, overflow: 'hidden', backgroundColor: colors.fill },
  preview: { width: '100%', height: HEIGHT },
  fileRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.sm, gap: spacing.xxs },
  fileName: { flex: 1, color: colors.ink },
  action: { minHeight: sizes.touch, minWidth: sizes.touch, justifyContent: 'center', paddingHorizontal: spacing.xs },
  link: { color: colors.link, fontFamily: fonts.bold },
  remove: { color: colors.error, fontFamily: fonts.bold },
  error: { ...type.small, color: colors.error },
});
