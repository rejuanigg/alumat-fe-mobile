import { createContext, use, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import { productService } from '../services/productService';
import type { Product, ProductInput } from '../services/types';

type State = { products: Product[]; loading: boolean };

type Action =
  | { type: 'loaded'; products: Product[] }
  | { type: 'upserted'; product: Product }
  | { type: 'removed'; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded':
      return { products: action.products, loading: false };
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
  update: (id: string, input: ProductInput) => Promise<Product>;
  remove: (id: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { products: [], loading: true });

  useEffect(() => {
    let active = true;
    void productService.list().then((products) => {
      if (active) dispatch({ type: 'loaded', products });
    });
    return () => {
      active = false;
    };
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
        const product = await productService.update(id, input);
        dispatch({ type: 'upserted', product });
        return product;
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
