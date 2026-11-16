import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, PackageOpen, ChevronRight } from 'lucide-react-native';

import { COLORS as BASE_COLORS } from '../../src/theme/colors';
import { TENANT } from '../../src/config/tenantConfig';
import { softShadow } from '../../src/theme/shadows';
import { MESSAGES } from '../../src/constants/messages';
import { subscribeToProducts } from '../../src/services/productService';
import { formatPrice } from '../../src/utils/format';
import ScreenDecorations from '../../src/components/ScreenDecorations';
import ErrorBanner from '../../src/components/auth/ErrorBanner';
import ProductImage from '../../src/components/products/ProductImage';

// ---------------------------------------------------------------------------
// Colores (paleta base + los propios de las tarjetas, igual que Home)
// ---------------------------------------------------------------------------
const COLORS = {
  ...BASE_COLORS,
  card: '#F6F6F0',
  cardBorder: '#E3E4D6',
  cardLabel: '#5B6578',
  badge: '#D6E8F1',
  badgeEmpty: '#F3DCDC',
  // Tonos accesibles sobre fondos claros
  text: TENANT.colors.text,
  error: TENANT.colors.error,
};

const T = MESSAGES.products;

// ---------------------------------------------------------------------------
// Tarjeta de producto
// ---------------------------------------------------------------------------
function ProductCard({ product, onPress }) {
  const inStock = product.stock > 0;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${product.category}, ${formatPrice(product.price)}, ${
        inStock ? `${product.stock} ${T.units}` : T.outOfStock
      }`}
      accessibilityHint={T.edit}
    >
      <ProductImage uri={product.imageUrl} size={84} />

      <View style={styles.cardBody}>
        <Text style={styles.cardCategory} numberOfLines={1}>
          {product.category.toUpperCase()}
        </Text>
        <Text style={styles.cardName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.cardPrice}>{formatPrice(product.price)}</Text>

        <View style={[styles.badge, !inStock && styles.badgeEmpty]}>
          <Text style={[styles.badgeText, !inStock && styles.badgeTextEmpty]}>
            {inStock ? `${T.inStock} · ${product.stock} ${T.units}` : T.outOfStock}
          </Text>
        </View>
      </View>

      <ChevronRight size={22} color={COLORS.text} strokeWidth={1.75} />
    </Pressable>
  );
}

export default function ProductList({ navigation }) {
  const insets = useSafeAreaInsets();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  // Cambia para volver a suscribirse al tocar "Reintentar"
  const [attempt, setAttempt] = useState(0);

  // Lista en tiempo real: se actualiza sola al crear, editar o eliminar
  useEffect(() => {
    setLoading(true);
    setLoadError(null);

    return subscribeToProducts(
      (items) => {
        setProducts(items);
        setLoading(false);
      },
      () => {
        setLoadError(MESSAGES.productErrors.load);
        setLoading(false);
      }
    );
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const header = (
    <View>
      <Text style={styles.title}>{T.title}</Text>
      <Text style={styles.subtitle}>{T.subtitle}</Text>

      <Pressable
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        onPress={() => navigation.navigate('ProductForm')}
        accessibilityRole="button"
      >
        <Plus size={20} color={COLORS.white} strokeWidth={2.25} />
        <Text style={styles.addButtonText}>{T.add}</Text>
      </Pressable>

      <ErrorBanner message={loadError} actionLabel={T.retry} onAction={retry} />
    </View>
  );

  const empty = loading ? (
    <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
  ) : loadError ? null : (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <PackageOpen size={40} color={COLORS.title} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>{T.empty}</Text>
      <Text style={styles.emptyHint}>{T.emptyHint}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenDecorations dotsTop={0.04} dotsRight={0.06} dotsBottom={0.04} dotsLeft={0.06} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductForm', { product: item })}
          />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 56 }]}
        showsVerticalScrollIndicator={false}
      />
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
    width: '100%',
    maxWidth: 568, // 520 de contenido + 24 de margen por lado, igual que Home
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
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

  pressed: {
    opacity: 0.85,
  },

  // Botón "Nuevo producto"
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    marginBottom: 20,
    ...softShadow(0.2),
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // Tarjeta
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 14,
    ...softShadow(0.06),
  },

  cardBody: {
    flex: 1,
  },

  cardCategory: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.cardLabel,
  },

  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.title,
    marginTop: 2,
  },

  cardPrice: {
    fontSize: 15,
    color: COLORS.text,
    marginTop: 2,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.badge,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 6,
  },
  badgeEmpty: {
    backgroundColor: COLORS.badgeEmpty,
  },

  badgeText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  badgeTextEmpty: {
    color: COLORS.error,
  },

  // Estados
  loader: {
    marginTop: 40,
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.title,
    textAlign: 'center',
  },

  emptyHint: {
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 4,
  },
});
