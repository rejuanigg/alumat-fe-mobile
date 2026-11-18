import { useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View, type TextInputInstance } from 'react-native';

import { colors, fonts, radii, type, webNoOutline } from '../theme/tokens';

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  onComplete?: (value: string) => void;
};

/**
 * Casillas OTP: avance automático al escribir, retroceso al borrar
 * y pegado del código completo en cualquier casilla.
 */
export function OtpInput({ value, onChange, length = 6, error, onComplete }: Props) {
  const refs = useRef<(TextInputInstance | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setAt = (index: number, text: string) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length > 1) {
      // Pegado (o autocompletado SMS): se reparte desde la casilla actual.
      const next = (value.slice(0, index) + clean).slice(0, length);
      onChange(next);
      refs.current[Math.min(next.length, length - 1)]?.focus();
      if (next.length === length) onComplete?.(next);
      return;
    }
    const arr = [...digits];
    arr[index] = clean;
    const next = arr.join('').slice(0, length);
    onChange(next);
    if (clean && index < length - 1) refs.current[index + 1]?.focus();
    if (clean && next.length === length) onComplete?.(next);
  };

  const onKey = (index: number, key: string) => {
    if (key !== 'Backspace' || digits[index]) return;
    if (index > 0) {
      const arr = [...digits];
      arr[index - 1] = '';
      onChange(arr.join(''));
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChangeText={(t) => setAt(i, d && t.length === 2 ? t.replace(d, '') || t : t)}
            onKeyPress={(e) => onKey(i, e.nativeEvent.key)}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused((f) => (f === i ? null : f))}
            keyboardType="number-pad"
            inputMode="numeric"
            textContentType={i === 0 ? 'oneTimeCode' : 'none'}
            autoComplete={i === 0 ? 'sms-otp' : 'off'}
            selectTextOnFocus
            selectionColor={colors.blue}
            cursorColor={colors.blue}
            accessibilityLabel={`Dígito ${i + 1} de ${length}`}
            style={[
              styles.cell,
              d ? styles.cellFilled : null,
              error && !d ? styles.cellError : null,
              focused === i ? styles.cellFocused : null,
              Platform.OS === 'web' ? webNoOutline : null,
            ]}
          />
        ))}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  cell: {
    width: 48,
    height: 58,
    flexShrink: 1,
    borderRadius: radii.field,
    backgroundColor: colors.fill,
    borderWidth: 2,
    borderColor: colors.transparent,
    textAlign: 'center',
    color: colors.ink,
    fontFamily: fonts.extrabold,
    fontSize: 24,
    padding: 0,
    includeFontPadding: false,
  },
  cellFilled: { backgroundColor: colors.fillFilled },
  cellError: { backgroundColor: colors.errorBg },
  cellFocused: { borderColor: colors.blue },
  error: { ...type.small, color: colors.error },
});
