import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../config/firebaseConfig';
import { TENANT } from '../config/tenantConfig';
import { withTimeout } from './withTimeout';

// ---------------------------------------------------------------------------
// Única capa que habla con Firebase Auth.
// Devuelve siempre un resultado: { ok: true } o { ok: false, category }.
// Las pantallas nunca ven códigos ni mensajes internos de Firebase.
// ---------------------------------------------------------------------------

export const AUTH_ERROR = {
  INVALID_CREDENTIALS: 'invalid-credentials',
  NETWORK: 'network',
  TOO_MANY_REQUESTS: 'too-many-requests',
  SERVICE_UNAVAILABLE: 'service-unavailable',
  NOT_CONFIGURED: 'not-configured',
  UNKNOWN: 'unknown',
};

// Correo inexistente, contraseña incorrecta y cuenta deshabilitada se agrupan
// en la misma categoría para no revelar qué cuentas existen.
const FIREBASE_ERROR_MAP = {
  'auth/invalid-credential': AUTH_ERROR.INVALID_CREDENTIALS,
  'auth/invalid-login-credentials': AUTH_ERROR.INVALID_CREDENTIALS,
  'auth/wrong-password': AUTH_ERROR.INVALID_CREDENTIALS,
  'auth/user-not-found': AUTH_ERROR.INVALID_CREDENTIALS,
  'auth/invalid-email': AUTH_ERROR.INVALID_CREDENTIALS,
  'auth/missing-password': AUTH_ERROR.INVALID_CREDENTIALS,
  'auth/user-disabled': AUTH_ERROR.INVALID_CREDENTIALS,

  'auth/network-request-failed': AUTH_ERROR.NETWORK,
  'auth/timeout': AUTH_ERROR.NETWORK,

  'auth/too-many-requests': AUTH_ERROR.TOO_MANY_REQUESTS,

  'auth/internal-error': AUTH_ERROR.SERVICE_UNAVAILABLE,
  'auth/operation-not-allowed': AUTH_ERROR.SERVICE_UNAVAILABLE,
  'auth/invalid-api-key': AUTH_ERROR.SERVICE_UNAVAILABLE,
  'auth/app-not-authorized': AUTH_ERROR.SERVICE_UNAVAILABLE,
};

export const mapFirebaseError = (code) =>
  FIREBASE_ERROR_MAP[code] || AUTH_ERROR.UNKNOWN;

// `email` llega normalizado y `password` exactamente como se escribió
export async function signIn(email, password) {
  // auth es null si Firebase no está configurado (faltan variables EXPO_PUBLIC_*)
  if (!auth) {
    if (__DEV__) console.warn('[authService] Firebase no está configurado.');
    return { ok: false, category: AUTH_ERROR.NOT_CONFIGURED };
  }

  try {
    await withTimeout(
      signInWithEmailAndPassword(auth, email, password),
      TENANT.authTimeoutMs,
      'auth/timeout'
    );
    // La navegación la resuelve onAuthStateChanged (navigation/Navigation.js)
    return { ok: true };
  } catch (error) {
    // Solo el código, nunca las credenciales
    if (__DEV__) console.warn('[authService] signIn falló:', error?.code);
    return { ok: false, category: mapFirebaseError(error?.code) };
  }
}
