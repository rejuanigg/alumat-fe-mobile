import { Platform } from 'react-native';

// Sombra compatible con iOS, Android y web
export const softShadow = (opacity = 0.08) =>
  Platform.select({
    web: { boxShadow: `0px 4px 12px rgba(58, 74, 90, ${opacity})` },
    android: { elevation: 3 },
    default: {
      shadowColor: '#3A4A5A',
      shadowOpacity: opacity,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
  });
