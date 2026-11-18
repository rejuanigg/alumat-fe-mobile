import { useState, type ReactNode, type Ref } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputInstance,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radii, sizes, type, webNoOutline } from '../theme/tokens';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'placeholderTextColor' | 'selectionColor'> & {
  label: string;
  error?: string;
  ref?: Ref<TextInputInstance>;
  containerStyle?: StyleProp<ViewStyle>;
  /** Elemento a la derecha dentro del campo (ej. botón ojo). */
  trailing?: ReactNode;
  /** Ayuda debajo del campo cuando no hay error (ej. contador). */
  hint?: string;
};

export function TextField({
  label,
  error,
  ref,
  containerStyle,
  trailing,
  hint,
  multiline,
  onFocus,
  onBlur,
  numberOfLines,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const lines = numberOfLines ?? 4;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label} nativeID={`${label}-label`}>
        {label}
      </Text>
      <View
        style={[
          styles.box,
          multiline && { height: undefined, minHeight: lines * 22 + 28, alignItems: 'flex-start' },
          hasError && styles.boxError,
          focused && styles.boxFocused,
        ]}
      >
        <TextInput
          ref={ref}
          {...inputProps}
          multiline={multiline}
          numberOfLines={multiline ? lines : 1}
          accessibilityLabel={label}
          accessibilityLabelledBy={`${label}-label`}
          accessibilityHint={error}
          aria-invalid={hasError}
          placeholderTextColor={colors.muted}
          selectionColor={colors.blue}
          cursorColor={colors.blue}
          underlineColorAndroid={colors.transparent}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, multiline ? styles.inputMultiline : styles.inputSingle]}
        />
        {trailing}
      </View>
      {hasError ? (
        <Text style={styles.error} accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { ...type.label, color: colors.ink },
  box: {
    height: sizes.field,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.fill,
    borderRadius: radii.field,
    // Contorno invisible de 2 px para que el foco no mueva el layout.
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  boxFocused: { borderColor: colors.blue },
  boxError: { backgroundColor: colors.errorBg },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingHorizontal: 14,
    margin: 0,
    // En Android quita el padding de fuente que desplaza el texto respecto del placeholder.
    includeFontPadding: false,
    ...Platform.select({ web: webNoOutline, default: {} }),
  },
  inputSingle: {
    paddingVertical: 0,
    textAlignVertical: 'center',
    // iOS desplaza el texto en inputs de una línea si se fija lineHeight; Android lo necesita para no cortar.
    ...Platform.select({ android: { lineHeight: 22 }, default: {} }),
  },
  inputMultiline: {
    paddingTop: 12,
    paddingBottom: 12,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  error: { ...type.small, color: colors.error },
  hint: { ...type.small, color: colors.muted },
});

