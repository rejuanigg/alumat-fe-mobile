import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, sizes, type } from '../theme/tokens';
import { Icon } from './Icon';

type Props = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
};

export function Checkbox({ label, checked, onChange, error }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => onChange(!checked)}
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked }}
        style={styles.row}
        hitSlop={4}
      >
        <View
          style={[
            styles.box,
            checked && styles.boxChecked,
            !checked && error ? styles.boxError : null,
          ]}
        >
          {checked ? <Icon name="check" size={16} color={colors.white} strokeWidth={3} /> : null}
        </View>
        <Text style={[type.body, styles.label]}>{label}</Text>
      </Pressable>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: sizes.touch },
  box: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.blue },
  boxError: { backgroundColor: colors.errorBg },
  label: { color: colors.ink, flexShrink: 1 },
  error: { ...type.small, color: colors.error },
});
