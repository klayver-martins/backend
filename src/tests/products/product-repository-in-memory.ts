import type { Product } from '../../../generated/prisma/client.ts';
import type { CreateProductData, UpdateProductData } from '../../interfaces/Product.ts';

export class ProductRepositoryInMemory {
  private products: Product[] = [];
  private nextId = 1;

  async create(data: CreateProductData, userId: number): Promise<Product> {
    const existingProduct = this.products.find(
      product => product.userId === userId && product.code === data.code,
    );

    if (existingProduct) {
      throw new Error('Código do produto já cadastrado.');
    }

    const product: Product = {
      id: this.nextId++,
      code: data.code,
      description: data.description,
      status: data.status,
      photo: data.photo ?? null,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.push(product);

    return product;
  }

  async findAll(userId: number): Promise<Product[]> {
    return this.products
      .filter(product => product.userId === userId)
      .sort(
        (a, b) =>
          Number(b.status) - Number(a.status) || b.createdAt.getTime() - a.createdAt.getTime(),
      );
  }

  async findById(id: number, userId: number): Promise<Product | null> {
    return this.products.find(product => product.id === id && product.userId === userId) ?? null;
  }

  async update(id: number, userId: number, data: UpdateProductData): Promise<Product | null> {
    const product = await this.findById(id, userId);

    if (!product) {
      return null;
    }

    if (data.code !== undefined) {
      const duplicate = this.products.find(
        item => item.id !== id && item.userId === userId && item.code === data.code,
      );

      if (duplicate) {
        throw new Error('Código do produto já cadastrado.');
      }
    }

    Object.assign(product, data, { updatedAt: new Date() });

    return product;
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const index = this.products.findIndex(
      product => product.id === id && product.userId === userId,
    );

    if (index === -1) {
      return false;
    }

    this.products.splice(index, 1);

    return true;
  }
}
