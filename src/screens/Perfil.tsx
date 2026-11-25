import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Hero } from '../components/Hero';
import { ListRow } from '../components/ListRow';
import { useAuth } from '../context/AuthContext';
import type { AppTabsParamList, PerfilStackParamList } from '../navigation/types';
import { colors, radii, spacing, type } from '../theme/tokens';
import { formatMonthYear, initials } from '../utils/format';

type Props = CompositeScreenProps<
  NativeStackScreenProps<PerfilStackParamList, 'Perfil'>,
  BottomTabScreenProps<AppTabsParamList>
>;

const CARD_OVERLAP = 28;

export function Perfil({ navigation }: Props) {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Hero
        height={236}
        onBack={() => navigation.navigate('Inicio')}
        waveColor={colors.bg}
        bottomSpace={CARD_OVERLAP + spacing.xl}
      >
        <View style={styles.identity}>
          <Avatar initials={initials(user.firstName, user.lastName)} photoUri={user.photoUri} size={76} />
          <View style={styles.names}>
            <Text style={[type.title28, styles.name]} accessibilityRole="header">
              {`${user.firstName}\n${user.lastName}`}
            </Text>
            <Text style={[type.body, styles.role]}>{user.role}</Text>
          </View>
        </View>
      </Hero>
      <View style={styles.body}>
        <View style={styles.card}>
          <ListRow label="Correo" value={user.email} />
          <ListRow label="Teléfono" value={user.phone} />
          <ListRow label="Miembro desde" value={formatMonthYear(user.memberSince)} />
        </View>
        <Button title="Editar perfil" onPress={() => navigation.navigate('EditarPerfil')} />
        <Button title="Cerrar sesión" variant="destructiveSoft" onPress={() => void signOut()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: spacing.xl },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  names: { flex: 1, gap: 4 },
  name: { color: colors.white },
  role: { color: colors.navySoft },
  body: { paddingHorizontal: spacing.screen, marginTop: -CARD_OVERLAP, gap: spacing.sm },
  card: {
    backgroundColor: colors.line,
    gap: 1,
    borderRadius: radii.list,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
});
