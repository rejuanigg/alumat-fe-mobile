import { createContext, use, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import { productService } from '../services/productService';
import type { Product, ProductInput } from '../services/types';

/** `all` incluye los eliminados lógicamente; se separan en el valor del contexto. */
type State = { all: Product[]; loading: boolean; error: string | null };

type Action =
  | { type: 'loaded'; products: Product[] }
  | { type: 'failed'; message: string }
  | { type: 'upserted'; product: Product };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded':
      return { all: action.products, loading: false, error: null };
    case 'failed':
      return { ...state, loading: false, error: action.message };
    case 'upserted': {
      const exists = state.all.some((p) => p.id === action.product.id);
      return {
        ...state,
        all: exists
          ? state.all.map((p) => (p.id === action.product.id ? action.product : p))
          : [...state.all, action.product],
      };
    }
  }
}

type ProductsContextValue = {
  /** Productos activos (los que se muestran en el catálogo). */
  products: Product[];
  /** Productos eliminados lógicamente, que todavía se pueden recuperar. */
  deleted: Product[];
  loading: boolean;
  error: string | null;
  create: (input: ProductInput) => Promise<Product>;
  update: (id: string, input: ProductInput) => Promise<void>;
  /** Eliminado lógico: el producto pasa a "eliminados" y se puede recuperar. */
  remove: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

/** Catálogo sincronizado en tiempo real con Firestore (colección `products`). */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { all: [], loading: true, error: null });

  useEffect(() => {
    // Si falla la carga inicial de ejemplos, igual escuchamos la colección.
    void productService.ensureSeed().catch(() => undefined);
    return productService.subscribe(
      (products) => dispatch({ type: 'loaded', products }),
      (message) => dispatch({ type: 'failed', message }),
    );
  }, []);

  const value = useMemo<ProductsContextValue>(() => {
    const setDeletedAt = (id: string, deletedAt: string | null) => {
      const current = state.all.find((p) => p.id === id);
      if (current) dispatch({ type: 'upserted', product: { ...current, deletedAt } });
    };
    return {
      products: state.all.filter((p) => p.deletedAt === null),
      deleted: state.all.filter((p) => p.deletedAt !== null),
      loading: state.loading,
      error: state.error,
      create: async (input) => {
        const product = await productService.create(input);
        dispatch({ type: 'upserted', product });
        return product;
      },
      update: async (id, input) => {
        await productService.update(id, input);
        const current = state.all.find((p) => p.id === id);
        if (current) dispatch({ type: 'upserted', product: { ...current, ...input } });
      },
      remove: async (id) => {
        setDeletedAt(id, await productService.remove(id));
      },
      restore: async (id) => {
        await productService.restore(id);
        setDeletedAt(id, null);
      },
    };
  }, [state]);

  return <ProductsContext value={value}>{children}</ProductsContext>;
}

export function useProducts(): ProductsContextValue {
  const ctx = use(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider');
  return ctx;
}

export const LOW_STOCK = 5;
export const isLowStock = (p: Product) => p.stock <= LOW_STOCK;
