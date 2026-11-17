import type { ReactNode, Ref } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewInstance,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme/tokens';

type Props = {
  header?: ReactNode;
  children: ReactNode;
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
  scrollRef?: Ref<ScrollViewInstance>;
  /** Suma el inset inferior (pantallas sin TabBar). */
  bottomInset?: boolean;
};

/** Contenedor para formularios: evita que el teclado tape el campo enfocado. */
export function FormScreen({
  header,
  children,
  background = colors.surface,
  contentStyle,
  scrollRef,
  bottomInset = true,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.grow}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        showsVerticalScrollIndicator={false}
      >
        {header}
        <View
          style={[
            styles.content,
            { paddingBottom: (bottomInset ? insets.bottom : 0) + spacing.xl },
            contentStyle,
          ]}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
});
