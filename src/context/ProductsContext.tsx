import { createContext, use, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import { productService } from '../services/productService';
import type { Product, ProductInput } from '../services/types';

type State = { products: Product[]; loading: boolean; error: string | null };

type Action =
  | { type: 'loaded'; products: Product[] }
  | { type: 'failed'; message: string }
  | { type: 'upserted'; product: Product }
  | { type: 'removed'; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded':
      return { products: action.products, loading: false, error: null };
    case 'failed':
      return { ...state, loading: false, error: action.message };
    case 'upserted': {
      const exists = state.products.some((p) => p.id === action.product.id);
      return {
        ...state,
        products: exists
          ? state.products.map((p) => (p.id === action.product.id ? action.product : p))
          : [...state.products, action.product],
      };
    }
    case 'removed':
      return { ...state, products: state.products.filter((p) => p.id !== action.id) };
  }
}

type ProductsContextValue = State & {
  create: (input: ProductInput) => Promise<Product>;
  update: (id: string, input: ProductInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

/** Catálogo sincronizado en tiempo real con Firestore (colección `products`). */
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { products: [], loading: true, error: null });

  useEffect(() => {
    // Si falla la carga inicial de ejemplos, igual escuchamos la colección.
    void productService.ensureSeed().catch(() => undefined);
    return productService.subscribe(
      (products) => dispatch({ type: 'loaded', products }),
      (message) => dispatch({ type: 'failed', message }),
    );
  }, []);

  const value = useMemo<ProductsContextValue>(
    () => ({
      ...state,
      create: async (input) => {
        const product = await productService.create(input);
        dispatch({ type: 'upserted', product });
        return product;
      },
      update: async (id, input) => {
        await productService.update(id, input);
        const current = state.products.find((p) => p.id === id);
        if (current) dispatch({ type: 'upserted', product: { ...current, ...input } });
      },
      remove: async (id) => {
        await productService.remove(id);
        dispatch({ type: 'removed', id });
      },
    }),
    [state],
  );

  return <ProductsContext value={value}>{children}</ProductsContext>;
}

export function useProducts(): ProductsContextValue {
  const ctx = use(ProductsContext);
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider');
  return ctx;
}

export const LOW_STOCK = 5;
export const isLowStock = (p: Product) => p.stock <= LOW_STOCK;
