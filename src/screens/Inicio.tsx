import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '../components/Avatar';
import { Hero } from '../components/Hero';
import { Icon, type IconName } from '../components/Icon';
import { Logo } from '../components/Logo';
import { ProductThumb } from '../components/ProductThumb';
import { TextLink } from '../components/TextLink';
import { useAuth } from '../context/AuthContext';
import { isLowStock, useProducts } from '../context/ProductsContext';
import type { AppTabsParamList } from '../navigation/types';
import { colors, fonts, radii, spacing, type } from '../theme/tokens';
import { formatNumber, formatPrice, initials } from '../utils/format';

type Props = BottomTabScreenProps<AppTabsParamList, 'Inicio'>;

const STRIP_OVERLAP = 44;

export function Inicio({ navigation }: Props) {
  const { user } = useAuth();
  const { products } = useProducts();
  if (!user) return null;

  const lowStock = products.filter(isLowStock).length;
  const categories = new Set(products.map((p) => p.category)).size;
  const latest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  const goProducts = () => navigation.navigate('ProductosTab', { screen: 'Productos' });
  const goNew = () => navigation.navigate('ProductosTab', { screen: 'ProductoForm', initial: false });
  const goProfile = () => navigation.navigate('PerfilTab', { screen: 'Perfil' });
  const goEdit = (id: string) =>
    navigation.navigate('ProductosTab', { screen: 'ProductoForm', params: { id }, initial: false });

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Hero
        height={262}
        left={
          <View style={styles.logo}>
            <Logo inverted />
          </View>
        }
        right={
          <Pressable
            onPress={goProfile}
            accessibilityRole="button"
            accessibilityLabel="Ir a mi perfil"
            hitSlop={4}
          >
            <Avatar initials={initials(user.firstName, user.lastName)} photoUri={user.photoUri} size={44} />
          </Pressable>
        }
        waveColor={colors.bg}
        bottomSpace={STRIP_OVERLAP + spacing.xl}
      >
        <Text style={[type.bodyLarge, styles.greeting]}>Buen día,</Text>
        <Text style={[type.display, styles.name]} accessibilityRole="header" numberOfLines={1} adjustsFontSizeToFit>
          {user.firstName}
        </Text>
      </Hero>

      <View style={styles.body}>
        <View style={styles.strip}>
          <Stat value={products.length} label="Productos" />
          <Stat value={lowStock} label="Stock bajo" tone="amber" />
          <Stat value={categories} label="Categorías" />
        </View>

        <View style={styles.grid}>
          <Tile
            title={'Nuevo\nproducto'}
            subtitle="Cargá uno al catálogo"
            icon="plus"
            onPress={goNew}
            bg={colors.blue}
            fg={colors.white}
            tall
          />
          <View style={styles.gridCol}>
            <Tile title="Catálogo" icon="box" onPress={goProducts} bg={colors.surface} fg={colors.ink} />
            <Tile title="Mi perfil" icon="user" onPress={goProfile} bg={colors.tintBlue} fg={colors.link} />
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={[type.heading, styles.sectionTitle]} accessibilityRole="header">
            Últimos cargados
          </Text>
          <TextLink title="Ver todos" onPress={goProducts} align="right" />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        accessibilityLabel="Últimos productos cargados"
      >
        {latest.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => goEdit(p.id)}
            accessibilityRole="button"
            accessibilityLabel={`${p.name}, ${formatPrice(p.price)}`}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <ProductThumb category={p.category} imageUri={p.imageUri} width={150} height={104} radius={0} />
            <View style={styles.cardBody}>
              <Text style={[type.label, styles.cardName]} numberOfLines={2}>
                {p.name}
              </Text>
              <Text style={[type.bodyStrong, styles.cardPrice]}>{formatPrice(p.price)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

function Stat({ value, label, tone }: { value: number; label: string; tone?: 'amber' }) {
  const amber = tone === 'amber';
  return (
    <View
      style={[styles.stat, amber && styles.statAmber]}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={[styles.statValue, amber && styles.amberText]}>{formatNumber(value)}</Text>
      <Text style={[type.small, styles.statLabel, amber && styles.amberText]}>{label}</Text>
    </View>
  );
}

type TileProps = {
  title: string;
  subtitle?: string;
  icon: IconName;
  onPress: () => void;
  bg: string;
  fg: string;
  tall?: boolean;
};

function Tile({ title, subtitle, icon, onPress, bg, fg, tall }: TileProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title.replace('\n', ' ')}
      style={({ pressed }) => [styles.tile, tall && styles.tileTall, { backgroundColor: bg }, pressed && styles.pressed]}
    >
      <Icon name={icon} color={fg} size={tall ? 30 : 24} strokeWidth={2.2} />
      <View style={styles.tileText}>
        <Text style={[tall ? type.title28 : type.heading, { color: fg }]}>{title}</Text>
        {subtitle ? <Text style={[type.small, { color: fg, opacity: 0.85 }]}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: spacing.xl },
  logo: { paddingLeft: spacing.md - spacing.xs, minHeight: 44, justifyContent: 'center' },
  greeting: { color: colors.navySoft, fontFamily: fonts.semibold },
  name: { color: colors.white },
  body: { paddingHorizontal: spacing.screen, gap: spacing.lg, marginTop: -STRIP_OVERLAP },
  strip: {
    flexDirection: 'row',
    gap: 1,
    backgroundColor: colors.line,
    borderRadius: radii.list,
    overflow: 'hidden',
  },
  stat: { flex: 1, backgroundColor: colors.surface, paddingVertical: 14, paddingHorizontal: spacing.sm, gap: 2 },
  statAmber: { backgroundColor: colors.amberBg },
  statValue: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 32, letterSpacing: -0.8, color: colors.ink },
  statLabel: { color: colors.muted },
  amberText: { color: colors.amber },
  grid: { flexDirection: 'row', gap: spacing.sm },
  gridCol: { flex: 1, gap: spacing.sm },
  tile: { flex: 1, minHeight: 104, borderRadius: radii.list, padding: spacing.md, justifyContent: 'space-between' },
  tileTall: { minHeight: 220 },
  tileText: { gap: 2 },
  pressed: { opacity: 0.85 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: colors.ink },
  carousel: { paddingHorizontal: spacing.screen, gap: spacing.sm },
  card: { width: 150, borderRadius: radii.list, backgroundColor: colors.surface, overflow: 'hidden' },
  cardBody: { padding: spacing.sm, gap: 4 },
  cardName: { color: colors.ink, minHeight: 34 },
  cardPrice: { color: colors.ink },
});
