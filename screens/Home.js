import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FileText,
  Package,
  ShoppingCart,
  Archive,
  LogOut,
} from 'lucide-react-native';
import { signOut } from 'firebase/auth';

import { auth } from '../src/config/firebaseConfig';
import { COLORS as BASE_COLORS } from '../src/theme/colors';
import { softShadow } from '../src/theme/shadows';
import ScreenDecorations from '../src/components/ScreenDecorations';

// ---------------------------------------------------------------------------
// Colores (paleta base + los propios de Home)
// ---------------------------------------------------------------------------
const COLORS = {
  ...BASE_COLORS,
  card: '#F6F6F0',
  cardBorder: '#E3E4D6',
  cardLabel: '#5B6578',
  badge: '#D6E8F1',
  iconBox: '#E6EAEA',
};

// ---------------------------------------------------------------------------
// Tarjetas de resumen: DATOS DE EJEMPLO.
// TODO: reemplazar `value` (y `status` si corresponde) por consultas reales
// (por ejemplo, conteos desde Firestore) cuando existan las colecciones.
// Se pueden cargar en un useEffect y guardar en un estado con esta misma forma.
// `route` es null cuando todavía no existe la pantalla en Navigation.js.
// ---------------------------------------------------------------------------
const SUMMARY_CARDS = [
  {
    key: 'boletas',
    label: 'MIS BOLETAS',
    value: 2,
    status: 'Activo',
    description: 'Pendientes en gestión',
    Icon: FileText,
    route: null, // TODO: no existe una ruta de boletas en Navigation.js
  },
  {
    key: 'productos',
    label: 'PRODUCTOS',
    value: 3,
    status: 'Activo',
    description: 'En proceso de creación',
    Icon: Package,
    route: 'Products',
  },
  {
    key: 'pedidos',
    label: 'PEDIDOS',
    value: 1,
    status: 'Activo',
    description: 'En preparación',
    Icon: ShoppingCart,
    route: null, // TODO: no existe una ruta de pedidos en Navigation.js
  },
  {
    key: 'inventario',
    label: 'INVENTARIO',
    value: 4,
    status: 'Activo',
    description: 'Producto en stock bajo',
    Icon: Archive,
    route: null, // TODO: no existe una ruta de inventario en Navigation.js
  },
];

// Primer nombre del usuario para el saludo ("Nombre Apellido" → "Nombre").
// Si no hay displayName, usa la parte del correo antes de la @.
const getFirstName = (user) => {
  const fromName = user?.displayName?.trim().split(/\s+/)[0];
  if (fromName) return fromName;

  const fromEmail = user?.email?.split('@')[0];
  if (fromEmail) return fromEmail.charAt(0).toUpperCase() + fromEmail.slice(1);

  return '';
};

// ---------------------------------------------------------------------------
// Tarjeta de resumen
// ---------------------------------------------------------------------------
function SummaryCard({ label, value, status, description, Icon, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}, ${description}`}
    >
      <View style={styles.cardText}>
        <Text style={styles.cardLabel}>{label}</Text>

        <View style={styles.cardValueRow}>
          <Text style={styles.cardValue}>{value}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{status}</Text>
          </View>
        </View>

        <Text style={styles.cardDescription}>{description}</Text>
      </View>

      <View style={styles.cardIconBox}>
        <Icon size={34} color={COLORS.title} strokeWidth={1.75} />
      </View>
    </Pressable>
  );
}

export default function Home({ navigation }) {
  const insets = useSafeAreaInsets();

  const [logoutError, setLogoutError] = useState('');

  const firstName = getFirstName(auth?.currentUser);
  const greeting = firstName ? `¡Hola, ${firstName}!` : '¡Hola!';

  // Cerrar sesión: la app reacciona con onAuthStateChanged y vuelve al Login
  const handleLogOut = async () => {
    if (!auth) return;

    setLogoutError('');
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error.code);
      setLogoutError('No se pudo cerrar sesión. Intentá nuevamente.');
    }
  };

  const handleCardPress = (card) => {
    if (card.route) {
      navigation.navigate(card.route);
    }
    // TODO: las tarjetas sin `route` no navegan hasta que exista su pantalla
  };

  return (
    <View style={styles.screen}>
      {/* Decoraciones de fondo: debajo del contenido (el Navbar queda fuera de esta vista) */}
      <ScreenDecorations
        dotsTop={0.04}
        dotsRight={0.06}
        dotsBottom={0.04}
        dotsLeft={0.06}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 56 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          {/* Saludo */}
          <Text style={styles.title}>{greeting}</Text>
          <Text style={styles.subtitle}>Aquí está tu resumen de la jornada actual</Text>

          {/* Tarjetas de resumen */}
          {SUMMARY_CARDS.map((card) => (
            <SummaryCard
              key={card.key}
              label={card.label}
              value={card.value}
              status={card.status}
              description={card.description}
              Icon={card.Icon}
              onPress={() => handleCardPress(card)}
            />
          ))}

          {/* Cerrar sesión */}
          <Pressable
            style={({ pressed }) => [styles.logout, pressed && styles.cardPressed]}
            onPress={handleLogOut}
            accessibilityRole="button"
          >
            <LogOut size={22} color={COLORS.text} strokeWidth={1.75} />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>

          {logoutError ? <Text style={styles.errorText}>{logoutError}</Text> : null}
        </View>
      </ScrollView>
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

  // Contenido
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
    marginBottom: 28,
  },

  // Tarjeta
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 20,
    marginBottom: 16,
    ...softShadow(0.06),
  },

  cardPressed: {
    opacity: 0.85,
  },

  cardText: {
    flex: 1,
  },

  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.cardLabel,
  },

  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 2,
  },

  cardValue: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.title,
  },

  badge: {
    backgroundColor: COLORS.badge,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },

  badgeText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  cardDescription: {
    fontSize: 16,
    color: COLORS.text,
  },

  cardIconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.iconBox,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  // Cerrar sesión
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 10,
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  logoutText: {
    fontSize: 18,
    color: COLORS.text,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
});
