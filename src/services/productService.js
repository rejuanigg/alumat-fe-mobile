import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../config/firebaseConfig';
import { TENANT } from '../config/tenantConfig';
import { withTimeout } from './withTimeout';

// ---------------------------------------------------------------------------
// Única capa que habla con Firestore para los productos (colección `products`).
// Las escrituras devuelven siempre un resultado: { ok: true } o
// { ok: false, category }. Las pantallas nunca ven códigos de Firebase.
//
// Documento:
//   name, category, description: string
//   price: number   stock: number (entero)
//   imageUrl: string | null  → hoy siempre null; la UI muestra un fondo listo
//                              para la imagen (ver ProductImage)
//   createdAt, updatedAt: Timestamp   createdBy, updatedBy: uid
// ---------------------------------------------------------------------------

const COLLECTION = 'products';

export const PRODUCT_ERROR = {
  PERMISSION_DENIED: 'permission-denied',
  NETWORK: 'network',
  NOT_FOUND: 'not-found',
  NOT_CONFIGURED: 'not-configured',
  UNKNOWN: 'unknown',
};

const FIRESTORE_ERROR_MAP = {
  'permission-denied': PRODUCT_ERROR.PERMISSION_DENIED,
  unauthenticated: PRODUCT_ERROR.PERMISSION_DENIED,
  unavailable: PRODUCT_ERROR.NETWORK,
  'deadline-exceeded': PRODUCT_ERROR.NETWORK,
  timeout: PRODUCT_ERROR.NETWORK,
  'not-found': PRODUCT_ERROR.NOT_FOUND,
};

const mapFirestoreError = (code) => FIRESTORE_ERROR_MAP[code] || PRODUCT_ERROR.UNKNOWN;

// Solo datos planos (sin Timestamps): se pueden pasar como parámetro de
// navegación sin advertencias de serialización.
const toProduct = (snapshot) => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name ?? '',
    category: data.category ?? '',
    description: data.description ?? '',
    price: typeof data.price === 'number' ? data.price : 0,
    stock: typeof data.stock === 'number' ? data.stock : 0,
    imageUrl: data.imageUrl ?? null,
  };
};

// Ejecuta una escritura y la traduce a { ok } / { ok: false, category }
const runWrite = async (label, write) => {
  if (!db) return { ok: false, category: PRODUCT_ERROR.NOT_CONFIGURED };

  try {
    const result = await withTimeout(write(), TENANT.authTimeoutMs);
    return { ok: true, id: result?.id };
  } catch (error) {
    if (__DEV__) console.warn(`[productService] ${label} falló:`, error?.code);
    return { ok: false, category: mapFirestoreError(error?.code) };
  }
};

// Escucha la lista en tiempo real (más nuevos primero).
// Devuelve la función para dejar de escuchar.
export function subscribeToProducts(onChange, onError) {
  if (!db) {
    onError(PRODUCT_ERROR.NOT_CONFIGURED);
    return () => {};
  }

  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => onChange(snapshot.docs.map(toProduct)),
    (error) => {
      if (__DEV__) console.warn('[productService] suscripción falló:', error?.code);
      onError(mapFirestoreError(error?.code));
    }
  );
}

// `values` llega validado y normalizado (validateProductForm)
export function createProduct(values) {
  const uid = auth?.currentUser?.uid ?? null;

  return runWrite('createProduct', () =>
    addDoc(collection(db, COLLECTION), {
      ...values,
      imageUrl: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: uid,
      updatedBy: uid,
    })
  );
}

export function updateProduct(id, values) {
  return runWrite('updateProduct', () =>
    updateDoc(doc(db, COLLECTION, id), {
      ...values,
      updatedAt: serverTimestamp(),
      updatedBy: auth?.currentUser?.uid ?? null,
    })
  );
}

export function deleteProduct(id) {
  return runWrite('deleteProduct', () => deleteDoc(doc(db, COLLECTION, id)));
}
