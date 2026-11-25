import { FirebaseError } from 'firebase/app';

import { ServiceError } from './types';

const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
  'auth/wrong-password': 'El correo o la contraseña no son correctos.',
  'auth/user-not-found': 'El correo o la contraseña no son correctos.',
  'auth/invalid-email': 'Ingresá un correo válido. Ej: nombre@empresa.com',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
  'auth/weak-password': 'La contraseña es demasiado débil.',
  'auth/password-does-not-meet-requirements': 'La contraseña no cumple los requisitos de seguridad.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo.',
  'auth/network-request-failed': 'No hay conexión. Revisá tu internet y probá de nuevo.',
  'auth/requires-recent-login': 'Por seguridad, cerrá sesión y volvé a ingresar para cambiar el correo.',
  'auth/operation-not-allowed': 'El ingreso con correo y contraseña no está habilitado en Firebase.',
  'permission-denied': 'Firestore rechazó la operación. Revisá que estén publicadas las reglas de firestore.rules.',
  unavailable: 'No hay conexión con el servidor. Probá de nuevo en unos segundos.',
};

/** Convierte un error de Firebase en un ServiceError con mensaje en español. */
export function toServiceError(error: unknown, fallback: string): ServiceError {
  if (error instanceof ServiceError) return error;
  if (error instanceof FirebaseError) {
    return new ServiceError(error.code, MESSAGES[error.code] ?? fallback);
  }
  return new ServiceError('unknown', fallback);
}
