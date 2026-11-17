import type { TextStyle } from 'react-native';

export const colors = {
  ink: '#0F2547',
  muted: '#5B6B85',
  blue: '#1D5FD1',
  link: '#1D4FB0',
  navy: '#0B2A4F',
  navySoft: '#B9CCF0',
  fill: '#EEF1F6',
  fillFilled: '#DCE8FB',
  bg: '#F4F6F9',
  surface: '#FFFFFF',
  white: '#FFFFFF',
  line: '#E3E8EF',
  tintBlue: '#E7EEFB',
  error: '#B3261E',
  errorBg: '#FBEDEC',
  success: '#14572A',
  successBg: '#E6F4EA',
  successCheck: '#2FA55A',
  amber: '#7A4B00',
  amberBg: '#FFF4DB',
  amberIllustration: '#E0A000',
  overlay: 'rgba(15,37,71,0.55)',
  transparent: 'transparent',
} as const;

export const fonts = {
  regular: 'Figtree_400Regular',
  medium: 'Figtree_500Medium',
  semibold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
  extrabold: 'Figtree_800ExtraBold',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  screen: 24,
} as const;

export const radii = {
  field: 8,
  button: 8,
  card: 10,
  list: 12,
  sheet: 12,
  round: 999,
} as const;

export const sizes = {
  designWidth: 390,
  field: 52,
  buttonLarge: 56,
  touch: 44,
  tabBar: 68,
  waveHeight: 40,
  waveOverlap: 39,
} as const;

/** Escala tipográfica. Títulos 800 con letterSpacing negativo según tamaño. */
export const type = {
  display: { fontFamily: fonts.extrabold, fontSize: 46, lineHeight: 48, letterSpacing: -1.5 },
  title40: { fontFamily: fonts.extrabold, fontSize: 40, lineHeight: 42, letterSpacing: -1.2 },
  title34: { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 37, letterSpacing: -1 },
  title28: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 31, letterSpacing: -0.6 },
  heading: { fontFamily: fonts.extrabold, fontSize: 20, lineHeight: 25, letterSpacing: -0.3 },
  bodyLarge: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 21 },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 17 },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 17 },
  button: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 20 },
  logo: { fontFamily: fonts.extrabold, fontSize: 18, letterSpacing: 1.3 },
} as const satisfies Record<string, TextStyle>;

export const theme = { colors, fonts, spacing, radii, sizes, type } as const;
