import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Save, Plus, Trash2 } from 'lucide-react-native';

import { TENANT } from '../../src/config/tenantConfig';
import { MESSAGES } from '../../src/constants/messages';
import { PRODUCT_LIMITS } from '../../src/validation/productValidation';
import useProductForm from '../../src/hooks/useProductForm';
import ScreenDecorations from '../../src/components/ScreenDecorations';
import ErrorBanner from '../../src/components/auth/ErrorBanner';
import PrimaryButton from '../../src/components/auth/PrimaryButton';
import ProductField from '../../src/components/products/ProductField';
import ProductImage from '../../src/components/products/ProductImage';

const COLORS = TENANT.colors;
const T = MESSAGES.products;

export default function ProductForm({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const product = route.params?.product;

  const {
    isEditing,
    values,
    errors,
    requestError,
    saving,
    deleting,
    onChange,
    onSubmit,
    onDelete,
  } = useProductForm(product, () => navigation.goBack());

  // Confirmación en la misma pantalla (Alert con botones no funciona en web)
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const busy = saving || deleting;

  return (
    <View style={styles.screen}>
      <ScreenDecorations dotsTop={0.04} dotsRight={0.06} dotsBottom={0.04} dotsLeft={0.06} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 56 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <Text style={styles.title}>{isEditing ? T.editTitle : T.createTitle}</Text>
            <Text style={styles.subtitle}>{T.subtitle}</Text>

            {/* Fondo listo para la foto: se rellena cuando el producto tenga imageUrl */}
            <ProductImage
              uri={product?.imageUrl}
              label={T.imagePlaceholder}
              style={styles.image}
            />

            <ProductField
              label={T.nameLabel}
              placeholder={T.namePlaceholder}
              value={values.name}
              onChangeText={onChange('name')}
              error={errors.name}
              maxLength={PRODUCT_LIMITS.name}
              autoCapitalize="sentences"
               returnKeyType="next"
            />

            <ProductField
              label={T.categoryLabel}
              placeholder={T.categoryPlaceholder}
              value={values.category}
              onChangeText={onChange('category')}
              error={errors.category}
              maxLength={PRODUCT_LIMITS.category}
              autoCapitalize="sentences"
            />

            <ProductField
              label={T.descriptionLabel}
              placeholder={T.descriptionPlaceholder}
              value={values.description}
              onChangeText={onChange('description')}
              error={errors.description}
              maxLength={PRODUCT_LIMITS.description}
              multiline
            />

            <View style={styles.row}>
              <ProductField
                style={styles.flex}
                label={T.priceLabel}
                placeholder={T.pricePlaceholder}
                value={values.price}
                onChangeText={onChange('price')}
                error={errors.price}
                keyboardType="decimal-pad"
              />
              <ProductField
                style={styles.flex}
                label={T.stockLabel}
                placeholder={T.stockPlaceholder}
                value={values.stock}
                onChangeText={onChange('stock')}
                error={errors.stock}
                keyboardType="number-pad"
              />
            </View>

            <ErrorBanner message={requestError} />

            <PrimaryButton
              title={isEditing ? T.save : T.create}
              loadingTitle={T.saving}
              loading={saving}
              disabled={deleting}
              onPress={onSubmit}
              Icon={isEditing ? Save : Plus}
            />

            {/* Eliminar (solo al editar), con confirmación en dos pasos */}
            {isEditing ? (
              confirmingDelete ? (
                <View style={styles.confirmBox} accessibilityLiveRegion="polite">
                  <Text style={styles.confirmText}>{T.deleteConfirm}</Text>
                  <View style={styles.confirmActions}>
                    <Pressable
                      style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
                      onPress={() => setConfirmingDelete(false)}
                      disabled={busy}
                      accessibilityRole="button"
                    >
                      <Text style={styles.cancelText}>{T.deleteCancel}</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.dangerButton,
                        (pressed || busy) && styles.pressed,
                      ]}
                      onPress={onDelete}
                      disabled={busy}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: busy, busy: deleting }}
                    >
                      {deleting ? <ActivityIndicator color={COLORS.white} /> : null}
                      <Text style={styles.dangerText}>
                        {deleting ? T.deleting : T.deleteConfirmAction}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [styles.deleteLink, pressed && styles.pressed]}
                  onPress={() => setConfirmingDelete(true)}
                  disabled={busy}
                  accessibilityRole="button"
                >
                  <Trash2 size={20} color={COLORS.error} strokeWidth={1.75} />
                  <Text style={styles.deleteLinkText}>{T.delete}</Text>
                </Pressable>
              )
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  inner: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.title,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    lineHeight: 25,
    color: COLORS.text,
    marginBottom: 20,
  },

  image: {
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  pressed: {
    opacity: 0.85,
  },

  // Eliminar
  deleteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 12,
    marginTop: 20,
  },

  deleteLinkText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '600',
  },

  confirmBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.error,
    padding: 16,
    marginTop: 24,
  },

  confirmText: {
    color: COLORS.title,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 14,
  },

  confirmActions: {
    flexDirection: 'row',
    gap: 12,
  },

  outlineButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: COLORS.title,
    fontSize: 15,
    fontWeight: '600',
  },

  dangerButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dangerText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
