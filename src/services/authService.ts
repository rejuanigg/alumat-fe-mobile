import { db, delay, newId, toPublicUser } from './db';
import { ServiceError, type User } from './types';

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

/** Código fijo de la implementación en memoria (una API real lo enviaría por correo). */
export const DEMO_RESET_CODE = '123456';

const normalize = (email: string) => email.trim().toLowerCase();

export const authService = {
  async login(email: string, password: string, remember: boolean): Promise<User> {
    await delay();
    const user = db.users.find((u) => u.email === normalize(email));
    if (!user || user.password !== password) {
      throw new ServiceError('invalid_credentials', 'El correo o la contraseña no son correctos.');
    }
    db.rememberedEmail = remember ? user.email : null;
    return toPublicUser(user);
  },

  async getRememberedEmail(): Promise<string | null> {
    return db.rememberedEmail;
  },

  async register(input: RegisterInput): Promise<User> {
    await delay();
    const email = normalize(input.email);
    if (db.users.some((u) => u.email === email)) {
      throw new ServiceError('email_taken', 'Ya existe una cuenta con ese correo.');
    }
    const user = {
      id: newId(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      phone: input.phone.trim(),
      role: 'Vendedor',
      memberSince: new Date().toISOString(),
      photoUri: null,
      password: input.password,
    };
    db.users.push(user);
    return toPublicUser(user);
  },

  /** Envía el código de recuperación. No revela si el correo existe. */
  async requestPasswordReset(email: string): Promise<void> {
    await delay();
    db.resetCodes.set(normalize(email), DEMO_RESET_CODE);
  },

  async verifyResetCode(email: string, code: string): Promise<void> {
    await delay();
    if (db.resetCodes.get(normalize(email)) !== code) {
      throw new ServiceError('invalid_code', 'El código no es correcto o venció.');
    }
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await delay();
    const key = normalize(email);
    if (db.resetCodes.get(key) !== code) {
      throw new ServiceError('invalid_code', 'El código no es correcto o venció.');
    }
    const user = db.users.find((u) => u.email === key);
    if (user) user.password = newPassword;
    db.resetCodes.delete(key);
  },
};
