import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, spacing, type } from '../theme/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

/** Hoja inferior sobre overlay. Tocar el overlay o el botón atrás la cierra. */
export function BottomSheet({ visible, onClose, title, description, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" />
        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
          accessibilityViewIsModal
        >
          <View style={styles.handle} />
          <Text style={[type.heading, styles.title]} accessibilityRole="header">
            {title}
          </Text>
          {description ? <Text style={[type.body, styles.description]}>{description}</Text> : null}
          <View style={styles.body}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginBottom: spacing.sm,
  },
  title: { color: colors.ink },
  description: { color: colors.muted },
  body: { marginTop: spacing.md, gap: spacing.sm },
});
