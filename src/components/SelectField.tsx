import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, sizes, type } from '../theme/tokens';
import { BottomSheet } from './BottomSheet';
import { Icon } from './Icon';

type Props<T extends string> = {
  label: string;
  value: T | '';
  options: readonly T[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  onClose?: () => void;
};

/** Selector: campo con aspecto de TextField que abre una hoja inferior con las opciones. */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Elegí una opción',
  error,
  onClose,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
    onClose?.();
  };
  return (
    <View style={styles.container}>
      <Text style={[type.label, styles.label]}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || 'sin elegir'}`}
        accessibilityHint="Abre la lista de opciones"
        style={[styles.box, error ? styles.boxError : null]}
      >
        <Text style={[type.bodyLarge, { color: value ? colors.ink : colors.muted }]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Icon name="chevronDown" color={colors.muted} size={20} />
      </Pressable>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      <BottomSheet visible={open} onClose={close} title={label}>
        <View style={styles.list}>
          {options.map((option) => {
            const selected = option === value;
            return (
              <Pressable
                key={option}
                onPress={() => {
                  onChange(option);
                  setOpen(false);
                }}
                accessibilityRole="radio"
                aria-selected={selected}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text style={[type.bodyLarge, { color: selected ? colors.link : colors.ink }]}>{option}</Text>
                {selected ? <Icon name="check" color={colors.blue} size={20} strokeWidth={2.4} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { color: colors.ink },
  box: {
    height: sizes.field,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.fill,
    borderRadius: radii.field,
    paddingHorizontal: 16,
  },
  boxError: { backgroundColor: colors.errorBg },
  error: { ...type.small, color: colors.error },
  list: { backgroundColor: colors.line, gap: 1, borderRadius: radii.card, overflow: 'hidden' },
  option: {
    minHeight: sizes.field,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },
  optionSelected: { backgroundColor: colors.tintBlue },
});
