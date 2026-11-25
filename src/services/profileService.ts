import { verifyBeforeUpdateEmail } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

import { auth, firestore } from './firebase';
import { toServiceError } from './firebaseErrors';
import { ServiceError, type User } from './types';

export type ProfileInput = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone' | 'photoUri'>;

export type ProfileUpdateResult = {
  user: User;
  /** Correo nuevo pendiente de confirmar (Firebase envió un enlace de verificación). */
  pendingEmail: string | null;
};

export const profileService = {
  async update(current: User, input: ProfileInput): Promise<ProfileUpdateResult> {
    const fbUser = auth.currentUser;
    if (!fbUser || fbUser.uid !== current.id) {
      throw new ServiceError('not_signed_in', 'Tu sesión venció. Volvé a iniciar sesión.');
    }
    try {
      const email = input.email.trim().toLowerCase();
      let pendingEmail: string | null = null;
      // El correo de la cuenta solo cambia cuando la persona confirma el enlace que le llega.
      if (email !== (fbUser.email ?? '').toLowerCase()) {
        await verifyBeforeUpdateEmail(fbUser, email);
        pendingEmail = email;
      }
      const changes = {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        phone: input.phone.trim(),
        photoUri: input.photoUri,
      };
      await updateDoc(doc(firestore, 'users', current.id), changes);
      return { user: { ...current, ...changes }, pendingEmail };
    } catch (e) {
      throw toServiceError(e, 'No pudimos guardar los cambios. Probá de nuevo.');
    }
  },
};
