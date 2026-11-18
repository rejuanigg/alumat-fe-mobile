import type { Product, User } from './types';

/** Simula la latencia de red de una API real. */
export const delay = (ms = 350) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

type StoredUser = User & { password: string };

/** "Base de datos" en memoria. Se pierde al recargar la app. */
export const db: {
  users: StoredUser[];
  products: Product[];
  rememberedEmail: string | null;
  resetCodes: Map<string, string>;
} = {
  users: [
    {
      id: 'u1',
      firstName: 'Romina',
      lastName: 'Flores',
      email: 'romina@alumat.com',
      phone: '+54 9 11 5555 5555',
      role: 'Administradora',
      memberSince: '2024-03-15T12:00:00.000Z',
      photoUri: null,
      password: 'Alumat2024',
    },
  ],
  products: [
    p('p1', 'Ventana corrediza 120 × 100', 'Ventanas', 185000, 12, 5),
    p('p2', 'Puerta balcón 2 hojas', 'Puertas', 342500, 6, 4),
    p('p3', 'Ventana oscilobatiente', 'Ventanas', 227900, 4, 3),
    p('p4', 'Persiana de enrollar PVC', 'Persianas', 78000, 25, 2),
    p('p5', 'Mosquitero corredizo', 'Accesorios', 41500, 18, 1),
  ],
  rememberedEmail: null,
  resetCodes: new Map(),
};

function p(
  id: string,
  name: string,
  category: Product['category'],
  price: number,
  stock: number,
  daysAgo: number,
): Product {
  return {
    id,
    name,
    category,
    price,
    stock,
    description: '',
    imageUri: null,
    imageName: null,
    createdAt: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
  };
}

export function toPublicUser({ password: _password, ...user }: StoredUser): User {
  return user;
}
