import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, type } from '../theme/tokens';

/** Pantalla temporal mientras se implementan las demás (etapa 1). */
export function Placeholder() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  return (
    <View style={styles.wrap}>
      <Text style={[type.title28, styles.text]}>{route.name}</Text>
      <Text style={[type.body, styles.muted]}>Pantalla en construcción.</Text>
      {user ? (
        <Button title="Cerrar sesión" variant="destructiveSoft" onPress={signOut} />
      ) : (
        <Button title="Volver" variant="secondary" onPress={() => navigation.goBack()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: spacing.screen, gap: spacing.md, backgroundColor: colors.bg },
  text: { color: colors.ink },
  muted: { color: colors.muted },
});
