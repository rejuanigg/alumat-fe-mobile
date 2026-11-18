import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ConfirmSheet } from '../components/ConfirmSheet';
import { Hero } from '../components/Hero';
import { HeroAction } from '../components/HeroAction';
import { Icon } from '../components/Icon';
import { IconButton } from '../components/IconButton';
import { ProductThumb } from '../components/ProductThumb';
import { isLowStock, useProducts } from '../context/ProductsContext';
import type { AppTabsParamList, ProductosStackParamList } from '../navigation/types';
import type { Product } from '../services/types';
import { colors, fonts, radii, sizes, spacing, type, webNoOutline } from '../theme/tokens';
import { formatNumber, formatPrice } from '../utils/format';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ProductosStackParamList, 'Productos'>,
  BottomTabScreenProps<AppTabsParamList>
>;

const SEARCH_OVERLAP = 26;

/** Quita acentos y pasa a minúsculas para buscar "persíana" ≈ "persiana". */
const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function Productos({ navigation }: Props) {
  const { products, loading, remove } = useProducts();
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    const list = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return q ? list.filter((p) => normalize(`${p.name} ${p.category}`).includes(q)) : list;
  }, [products, query]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await remove(toDelete.id);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const count = filtered.length;

  return (
    <View style={styles.root}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Hero
          height={188}
          title="Productos"
          titleStyle="title40"
          onBack={() => navigation.navigate('Inicio')}
          right={<HeroAction title="Nuevo" onPress={() => navigation.navigate('ProductoForm')} />}
          waveColor={colors.bg}
          bottomSpace={SEARCH_OVERLAP + spacing.xl}
        />
        <View style={styles.body}>
          <View style={styles.search}>
            <Icon name="search" color={colors.muted} size={20} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar por nombre o categoría"
              placeholderTextColor={colors.muted}
              selectionColor={colors.blue}
              cursorColor={colors.blue}
              accessibilityLabel="Buscar productos"
              returnKeyType="search"
              autoCorrect={false}
              style={[styles.searchInput, Platform.OS === 'web' ? webNoOutline : null]}
            />
            {query ? (
              <IconButton icon="plus" label="Borrar búsqueda" onPress={() => setQuery('')} color={colors.muted} style={styles.clear} />
            ) : null}
          </View>

          <Text style={[type.label, styles.count]} accessibilityLiveRegion="polite">
            {formatNumber(count)} {count === 1 ? 'producto' : 'productos'}
          </Text>

          {loading ? (
            <ActivityIndicator color={colors.blue} style={styles.loading} />
          ) : count === 0 ? (
            <View style={styles.empty}>
              <Icon name="search" color={colors.muted} size={32} />
              <Text style={[type.heading, styles.emptyTitle]}>No encontramos productos</Text>
              <Text style={[type.body, styles.muted]}>
                {query ? 'Probá con otro nombre o categoría.' : 'Cargá el primero con el botón “Nuevo”.'}
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((p) => (
                <Row
                  key={p.id}
                  product={p}
                  onEdit={() => navigation.navigate('ProductoForm', { id: p.id })}
                  onDelete={() => setToDelete(p)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={toDelete !== null}
        title="¿Eliminar este producto?"
        description={toDelete ? `“${toDelete.name}” se va a borrar del catálogo. Esta acción no se puede deshacer.` : undefined}
        confirmLabel="Sí, eliminar"
        loading={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
}

function Row({ product: p, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  const low = isLowStock(p);
  return (
    <View style={styles.row}>
      <ProductThumb category={p.category} imageUri={p.imageUri} width={60} height={60} />
      <View
        style={styles.rowText}
        accessible
        accessibilityLabel={`${p.name}. ${p.category}, stock ${p.stock}${low ? ', stock bajo' : ''}. ${formatPrice(p.price)}`}
      >
        <Text style={[type.bodyStrong, styles.name]} numberOfLines={2}>
          {p.name}
        </Text>
        <Text style={[type.small, low ? styles.low : styles.muted]}>
          {p.category} · Stock {formatNumber(p.stock)}
        </Text>
        <Text style={styles.price}>{formatPrice(p.price)}</Text>
      </View>
      <IconButton icon="edit" label={`Editar ${p.name}`} onPress={onEdit} color={colors.link} />
      <IconButton icon="trash" label={`Eliminar ${p.name}`} onPress={onDelete} color={colors.error} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xl, marginTop: -SEARCH_OVERLAP, gap: spacing.md },
  search: {
    height: sizes.field,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: 14,
    backgroundColor: colors.surface,
    borderRadius: radii.field,
  },
  searchInput: {
    flex: 1,
    alignSelf: 'stretch',
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  clear: { transform: [{ rotate: '45deg' }] },
  count: { color: colors.muted },
  loading: { marginTop: spacing.xl },
  list: { backgroundColor: colors.line, gap: 1, borderRadius: radii.card, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xxs,
  },
  rowText: { flex: 1, gap: 2 },
  name: { color: colors.ink },
  muted: { color: colors.muted },
  low: { color: colors.amber, fontFamily: fonts.semibold },
  price: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.ink },
  empty: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xxl, backgroundColor: colors.surface, borderRadius: radii.card },
  emptyTitle: { color: colors.ink },
});
