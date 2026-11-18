import { db, delay, toPublicUser } from './db';
import { ServiceError, type User } from './types';

export type ProfileInput = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone' | 'photoUri'>;

export const profileService = {
  async update(userId: string, input: ProfileInput): Promise<User> {
    await delay();
    const email = input.email.trim().toLowerCase();
    if (db.users.some((u) => u.email === email && u.id !== userId)) {
      throw new ServiceError('email_taken', 'Ya existe una cuenta con ese correo.');
    }
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new ServiceError('not_found', 'No encontramos tu usuario.');
    Object.assign(user, {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      phone: input.phone.trim(),
      photoUri: input.photoUri,
    });
    return toPublicUser(user);
  },
};
