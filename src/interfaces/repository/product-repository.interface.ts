import type { Product } from '../../../generated/prisma/client.ts';
import type { CreateProductData, UpdateProductData } from '../Product.ts';

export interface ProductRepositoryInterface {
  create(data: CreateProductData, userId: number): Promise<Product>;

  findAll(userId: number): Promise<Product[]>;

  findById(id: number, userId: number): Promise<Product | null>;

  update(id: number, userId: number, data: UpdateProductData): Promise<Product | null>;

  delete(id: number, userId: number): Promise<boolean>;
}
