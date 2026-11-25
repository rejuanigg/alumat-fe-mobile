import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

/** Configuración tomada de `.env` (variables EXPO_PUBLIC_FIREBASE_*). */
export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);
if (missing.length > 0) {
  throw new Error(`Falta configurar Firebase en .env (${missing.join(', ')}). Ver README.`);
}

const isFirstInit = getApps().length === 0;
export const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

/**
 * En el teléfono la sesión se guarda con AsyncStorage para que sobreviva al cerrar la app;
 * en web Firebase usa el almacenamiento del navegador.
 */
function createAuth(): Auth {
  if (Platform.OS === 'web' || !isFirstInit) return getAuth(app);
  return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
}

export const auth = createAuth();
auth.languageCode = 'es'; // correos de Firebase (recuperación, verificación) en español

export const firestore = getFirestore(app);
