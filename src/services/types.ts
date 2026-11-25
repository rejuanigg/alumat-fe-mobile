export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  memberSince: string; // ISO
  photoUri: string | null;
};

export const CATEGORIES = ['Ventanas', 'Puertas', 'Persianas', 'Accesorios', 'Otros'] as const;
export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  imageUri: string | null;
  imageName: string | null;
  createdAt: string; // ISO
  /** Eliminado lógico: fecha (ISO) en que se eliminó, o null si está activo. */
  deletedAt: string | null;
};

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'deletedAt'>;

export class ServiceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}
