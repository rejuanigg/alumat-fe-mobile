import { db, delay, newId } from './db';
import { ServiceError, type Product, type ProductInput } from './types';

export const productService = {
  async list(): Promise<Product[]> {
    await delay(200);
    return [...db.products];
  },

  async create(input: ProductInput): Promise<Product> {
    await delay();
    const product: Product = { ...input, id: newId(), createdAt: new Date().toISOString() };
    db.products.push(product);
    return product;
  },

  async update(id: string, input: ProductInput): Promise<Product> {
    await delay();
    const index = db.products.findIndex((p) => p.id === id);
    const current = db.products[index];
    if (!current) throw new ServiceError('not_found', 'El producto no existe.');
    const updated: Product = { ...current, ...input };
    db.products[index] = updated;
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay(250);
    db.products = db.products.filter((p) => p.id !== id);
  },
};
