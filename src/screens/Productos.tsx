import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ScrollViewInstance,
} from 'react-native';

import { Banner } from '../components/Banner';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { Hero } from '../components/Hero';
import { HeroAction } from '../components/HeroAction';
import { Icon } from '../components/Icon';
import { IconButton } from '../components/IconButton';
import { ProductThumb } from '../components/ProductThumb';
import { isLowStock, useProducts } from '../context/ProductsContext';
import type { AppTabsParamList, ProductosStackParamList } from '../navigation/types';
import { ServiceError, type Product } from '../services/types';
import { colors, fonts, radii, sizes, spacing, type, webNoOutline } from '../theme/tokens';
import { formatNumber, formatPrice } from '../utils/format';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ProductosStackParamList, 'Productos'>,
  BottomTabScreenProps<AppTabsParamList>
>;

const SEARCH_OVERLAP = 26;

/** Quita acentos y pasa a minúsculas para buscar "persíana" ≈ "persiana". */
const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function Productos({ navigation, route }: Props) {
  const { products, deleted, loading, remove, restore } = useProducts();
  const [query, setQuery] = useState('');
  const [view, setView] = useState<Listado>('active');
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  // `undo`: producto recién eliminado que se puede recuperar desde el mismo aviso.
  const [banner, setBanner] = useState<{ kind: 'success' | 'error'; message: string; undo?: Product } | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const shownNotice = useRef<string | null>(null);

  // Aviso que deja el formulario al crear o editar un producto.
  const notice = route.params?.notice;
  useEffect(() => {
    if (!notice || shownNotice.current === notice.key) return;
    shownNotice.current = notice.key;
    setView('active');
    setBanner({
      kind: 'success',
      message:
        notice.kind === 'created'
          ? `“${notice.name}” se creó correctamente.`
          : `Los cambios en “${notice.name}” se guardaron correctamente.`,
    });
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    // Limpiamos el parámetro para que el aviso no reaparezca al volver a esta pantalla.
    navigation.setParams({ notice: undefined });
  }, [notice, navigation]);

  const showingDeleted = view === 'deleted';

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    const list = showingDeleted
      ? [...deleted].sort((a, b) => (b.deletedAt ?? '').localeCompare(a.deletedAt ?? ''))
      : [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return q ? list.filter((p) => normalize(`${p.name} ${p.category}`).includes(q)) : list;
  }, [products, deleted, showingDeleted, query]);

  const errorMessage = (e: unknown, fallback: string) => (e instanceof ServiceError ? e.message : fallback);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setBanner(null);
    try {
      await remove(toDelete.id);
      setBanner({
        kind: 'success',
        message: `“${toDelete.name}” se eliminó. Podés recuperarlo ahora o más tarde desde Eliminados.`,
        undo: toDelete,
      });
      setToDelete(null);
    } catch (e) {
      setBanner({ kind: 'error', message: errorMessage(e, 'No pudimos eliminar el producto. Probá de nuevo.') });
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const restoreProduct = async (p: Product) => {
    if (restoringId !== null) return;
    setRestoringId(p.id);
    setBanner(null);
    try {
      await restore(p.id);
      setBanner({ kind: 'success', message: `“${p.name}” volvió al catálogo.` });
    } catch (e) {
      setBanner({ kind: 'error', message: errorMessage(e, 'No pudimos recuperar el producto. Probá de nuevo.') });
    } finally {
      setRestoringId(null);
    }
  };

  const undo = banner?.undo;
  const undoAction = undo
    ? {
        label: 'Recuperar',
        accessibilityLabel: `Recuperar ${undo.name}`,
        loading: restoringId === undo.id,
        onPress: () => void restoreProduct(undo),
      }
    : undefined;

  const changeView = (next: Listado) => {
    setView(next);
    setBanner(null);
  };

  const count = filtered.length;

  return (
    <View style={styles.root}>
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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

          <View style={styles.tabs} accessibilityRole="tablist">
            <Tab label={`Activos (${formatNumber(products.length)})`} selected={!showingDeleted} onPress={() => changeView('active')} />
            <Tab label={`Eliminados (${formatNumber(deleted.length)})`} selected={showingDeleted} onPress={() => changeView('deleted')} />
          </View>

          {banner ? (
            <Banner
              kind={banner.kind}
              message={banner.message}
              action={undoAction}
            />
          ) : null}

          <Text style={[type.label, styles.count]} accessibilityLiveRegion="polite">
            {formatNumber(count)} {count === 1 ? 'producto' : 'productos'}
            {showingDeleted ? (count === 1 ? ' eliminado' : ' eliminados') : ''}
          </Text>

          {loading ? (
            <ActivityIndicator color={colors.blue} style={styles.loading} />
          ) : count === 0 ? (
            <View style={styles.empty}>
              <Icon name="search" color={colors.muted} size={32} />
              <Text style={[type.heading, styles.emptyTitle]}>
                {showingDeleted && !query ? 'No hay productos eliminados' : 'No encontramos productos'}
              </Text>
              <Text style={[type.body, styles.muted]}>
                {query
                  ? 'Probá con otro nombre o categoría.'
                  : showingDeleted
                    ? 'Los productos que elimines van a aparecer acá para que puedas recuperarlos.'
                    : 'Cargá el primero con el botón “Nuevo”.'}
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {filtered.map((p) =>
                showingDeleted ? (
                  <Row key={p.id} product={p}>
                    {restoringId === p.id ? (
                      <ActivityIndicator color={colors.link} style={styles.rowSpinner} />
                    ) : (
                      <IconButton
                        icon="restore"
                        label={`Recuperar ${p.name}`}
                        onPress={() => void restoreProduct(p)}
                        color={colors.link}
                      />
                    )}
                  </Row>
                ) : (
                  <Row key={p.id} product={p}>
                    <IconButton
                      icon="edit"
                      label={`Editar ${p.name}`}
                      onPress={() => navigation.navigate('ProductoForm', { id: p.id })}
                      color={colors.link}
                    />
                    <IconButton icon="trash" label={`Eliminar ${p.name}`} onPress={() => setToDelete(p)} color={colors.error} />
                  </Row>
                ),
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={toDelete !== null}
        title="¿Eliminar este producto?"
        description={
          toDelete
            ? `“${toDelete.name}” va a dejar de aparecer en el catálogo. Podés recuperarlo cuando quieras desde la pestaña Eliminados.`
            : undefined
        }
        confirmLabel="Sí, eliminar"
        loading={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
}

/** Qué listado se muestra: productos activos o eliminados (recuperables). */
type Listado = 'active' | 'deleted';

function Tab({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      style={[styles.tab, selected ? styles.tabSelected : null]}
    >
      <Text style={[type.label, selected ? styles.tabTextSelected : styles.muted]}>{label}</Text>
    </Pressable>
  );
}

function Row({ product: p, children }: { product: Product; children: ReactNode }) {
  const low = isLowStock(p);
  const deleted = p.deletedAt !== null;
  return (
    <View style={styles.row}>
      <ProductThumb category={p.category} imageUri={p.imageUri} width={60} height={60} />
      <View
        style={styles.rowText}
        accessible
        accessibilityLabel={`${p.name}. ${p.category}, stock ${p.stock}${low && !deleted ? ', stock bajo' : ''}. ${formatPrice(p.price)}${deleted ? '. Eliminado' : ''}`}
      >
        <Text style={[type.bodyStrong, styles.name]} numberOfLines={2}>
          {p.name}
        </Text>
        <Text style={[type.small, low && !deleted ? styles.low : styles.muted]}>
          {p.category} · Stock {formatNumber(p.stock)}
        </Text>
        <Text style={styles.price}>{formatPrice(p.price)}</Text>
      </View>
      {children}
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
  tabs: { flexDirection: 'row', gap: spacing.xs },
  tab: {
    minHeight: sizes.touch,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.field,
    backgroundColor: colors.surface,
  },
  tabSelected: { backgroundColor: colors.navy },
  tabTextSelected: { color: colors.white },
  rowSpinner: { width: sizes.touch, height: sizes.touch },
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
