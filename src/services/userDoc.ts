import type { DocumentData } from 'firebase/firestore';

import type { User } from './types';

/** Forma del documento users/{uid} en Firestore. */
export type UserDoc = Omit<User, 'id'>;

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);

export function userFromDoc(id: string, data: DocumentData): User {
  return {
    id,
    firstName: str(data.firstName),
    lastName: str(data.lastName),
    email: str(data.email),
    phone: str(data.phone),
    role: str(data.role, 'Vendedor'),
    memberSince: str(data.memberSince, new Date().toISOString()),
    photoUri: typeof data.photoUri === 'string' ? data.photoUri : null,
  };
}
