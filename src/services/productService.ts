import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  writeBatch,
  type DocumentData,
} from 'firebase/firestore';

import { firestore } from './firebase';
import { toServiceError } from './firebaseErrors';
import { CATEGORIES, type Category, type Product, type ProductInput } from './types';

const products = collection(firestore, 'products');

const SAMPLE: ProductInput[] = [
  sample('Ventana corrediza 120 × 100', 'Ventanas', 185000, 12),
  sample('Puerta balcón 2 hojas', 'Puertas', 342500, 6),
  sample('Ventana oscilobatiente', 'Ventanas', 227900, 4),
  sample('Persiana de enrollar PVC', 'Persianas', 78000, 25),
  sample('Mosquitero corredizo', 'Accesorios', 41500, 18),
];

function sample(name: string, category: Category, price: number, stock: number): ProductInput {
  return { name, category, price, stock, description: '', imageUri: null, imageName: null };
}

function fromDoc(id: string, d: DocumentData): Product {
  const category = (CATEGORIES as readonly string[]).includes(d.category) ? (d.category as Category) : 'Otros';
  return {
    id,
    name: typeof d.name === 'string' ? d.name : '',
    category,
    price: typeof d.price === 'number' ? d.price : 0,
    stock: typeof d.stock === 'number' ? d.stock : 0,
    description: typeof d.description === 'string' ? d.description : '',
    imageUri: typeof d.imageUri === 'string' ? d.imageUri : null,
    imageName: typeof d.imageName === 'string' ? d.imageName : null,
    createdAt: typeof d.createdAt === 'string' ? d.createdAt : new Date(0).toISOString(),
  };
}

export const productService = {
  /** Escucha el catálogo en tiempo real. Devuelve la función para dejar de escuchar. */
  subscribe(onChange: (products: Product[]) => void, onError: (message: string) => void): () => void {
    return onSnapshot(
      products,
      (snap) => onChange(snap.docs.map((d) => fromDoc(d.id, d.data()))),
      (e) => onError(toServiceError(e, 'No pudimos cargar los productos.').message),
    );
  },

  /** Carga los productos de ejemplo la primera vez (queda marcado en meta/seed). */
  async ensureSeed(): Promise<void> {
    const flag = doc(firestore, 'meta', 'seed');
    if ((await getDoc(flag)).exists()) return;
    const batch = writeBatch(firestore);
    const now = Date.now();
    SAMPLE.forEach((p, i) => {
      batch.set(doc(products), { ...p, createdAt: new Date(now - (i + 1) * 86_400_000).toISOString() });
    });
    batch.set(flag, { at: new Date(now).toISOString() });
    await batch.commit();
  },

  async create(input: ProductInput): Promise<Product> {
    try {
      const createdAt = new Date().toISOString();
      const ref = await addDoc(products, { ...input, createdAt });
      return { ...input, id: ref.id, createdAt };
    } catch (e) {
      throw toServiceError(e, 'No pudimos guardar el producto. Probá de nuevo.');
    }
  },

  async update(id: string, input: ProductInput): Promise<void> {
    try {
      await updateDoc(doc(products, id), { ...input });
    } catch (e) {
      throw toServiceError(e, 'No pudimos guardar el producto. Probá de nuevo.');
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await deleteDoc(doc(products, id));
    } catch (e) {
      throw toServiceError(e, 'No pudimos eliminar el producto. Probá de nuevo.');
    }
  },
};
