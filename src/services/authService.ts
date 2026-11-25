import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  initializeAuth,
  inMemoryPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

import { auth, firebaseConfig, firestore } from './firebase';
import { toServiceError } from './firebaseErrors';
import type { User } from './types';
import { userFromDoc, type UserDoc } from './userDoc';

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

const REMEMBER_KEY = 'alumat.remember';
const REMEMBERED_EMAIL_KEY = 'alumat.rememberedEmail';
const DEFAULT_ROLE = 'Vendedor';

const normalize = (email: string) => email.trim().toLowerCase();

/** Lee el perfil de Firestore (users/{uid}); si no existe lo crea a partir de la cuenta de Auth. */
async function loadProfile(fbUser: FirebaseUser): Promise<User> {
  const ref = doc(firestore, 'users', fbUser.uid);
  const snap = await getDoc(ref);
  const email = fbUser.email ?? '';
  if (!snap.exists()) {
    const data: UserDoc = {
      firstName: email.split('@')[0] ?? '',
      lastName: '',
      email,
      phone: '',
      role: DEFAULT_ROLE,
      memberSince: fbUser.metadata.creationTime
        ? new Date(fbUser.metadata.creationTime).toISOString()
        : new Date().toISOString(),
      photoUri: null,
    };
    await setDoc(ref, data);
    return userFromDoc(fbUser.uid, data);
  }
  const user = userFromDoc(fbUser.uid, snap.data());
  // Si confirmó un cambio de correo (verifyBeforeUpdateEmail), lo reflejamos en el perfil.
  if (email && user.email !== email) {
    await updateDoc(ref, { email });
    return { ...user, email };
  }
  return user;
}

/**
 * El registro usa una instancia secundaria de Firebase con sesión en memoria:
 * así crear la cuenta no inicia sesión en la app (el flujo es Registro → Listo → Login).
 */
function registrationApp() {
  const name = 'registro';
  const existing = getApps().find((a) => a.name === name);
  if (existing) return { app: existing, auth: getAuth(existing) };
  const app = initializeApp(firebaseConfig, name);
  return { app, auth: initializeAuth(app, { persistence: inMemoryPersistence }) };
}

export const authService = {
  async login(email: string, password: string, remember: boolean): Promise<User> {
    try {
      const cred = await signInWithEmailAndPassword(auth, normalize(email), password);
      await AsyncStorage.multiSet([
        [REMEMBER_KEY, remember ? '1' : '0'],
        [REMEMBERED_EMAIL_KEY, remember ? normalize(email) : ''],
      ]);
      return await loadProfile(cred.user);
    } catch (e) {
      throw toServiceError(e, 'No pudimos iniciar sesión. Probá de nuevo.');
    }
  },

  /**
   * Al abrir la app: si hay una sesión guardada y la persona marcó "Recordarme",
   * la retoma; si no la marcó, la cierra.
   */
  async restoreSession(): Promise<User | null> {
    await auth.authStateReady();
    const current = auth.currentUser;
    if (!current) return null;
    if ((await AsyncStorage.getItem(REMEMBER_KEY)) !== '1') {
      await signOut(auth);
      return null;
    }
    try {
      return await loadProfile(current);
    } catch {
      return null;
    }
  },

  /** Avisa cuando Firebase cierra la sesión (p. ej. cuenta deshabilitada o token revocado). */
  onSignedOut(callback: () => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      if (!user) callback();
    });
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async getRememberedEmail(): Promise<string | null> {
    return (await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY)) || null;
  },

  async register(input: RegisterInput): Promise<void> {
    const { app, auth: regAuth } = registrationApp();
    const email = normalize(input.email);
    let created: FirebaseUser | null = null;
    try {
      const cred = await createUserWithEmailAndPassword(regAuth, email, input.password);
      created = cred.user;
      const data: UserDoc = {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email,
        phone: input.phone.trim(),
        role: DEFAULT_ROLE,
        memberSince: new Date().toISOString(),
        photoUri: null,
      };
      await setDoc(doc(getFirestore(app), 'users', created.uid), data);
    } catch (e) {
      // Si la cuenta se creó pero no se pudo guardar el perfil, la borramos para que
      // el correo no quede tomado y se pueda volver a intentar.
      if (created) await deleteUser(created).catch(() => undefined);
      throw toServiceError(e, 'No pudimos crear la cuenta. Probá de nuevo.');
    } finally {
      await signOut(regAuth);
    }
  },

  /**
   * Firebase envía un correo real con un enlace para elegir la contraseña nueva.
   * Si el correo no tiene cuenta no se informa (para no revelar qué correos están registrados).
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, normalize(email));
    } catch (e) {
      const err = toServiceError(e, 'No pudimos enviar el correo. Probá de nuevo.');
      if (err.code === 'auth/user-not-found') return;
      throw err;
    }
  },
};
