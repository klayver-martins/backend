import type { ProductRepositoryInterface } from '../interfaces/repository/product-repository.interface.ts';

import { ProductRepository } from '../repository/product.repository.ts';
import {
  productCreateSchema,
  productIdSchema,
  productUpdateSchema,
  type ProductUpdateInput,
} from '../schemas/product.schema.ts';

import { AppError } from '../utils/app-error.ts';
import { deletePhoto } from '../utils/delete-photo.ts';

export class ProductService {
  constructor(private productRepository: ProductRepositoryInterface = new ProductRepository()) {}

  async create(input: unknown, userId: number) {
    const data = productCreateSchema.parse(input);

    return this.productRepository.create(
      {
        code: data.code,
        description: data.description,
        status: data.status,
        photo: data.photo,
      },
      userId,
    );
  }

  async findAll(userId: number) {
    return this.productRepository.findAll(userId);
  }

  async findById(id: number, userId: number) {
    const productId = productIdSchema.parse(id);

    const product = await this.productRepository.findById(productId, userId);

    if (!product) {
      throw new AppError('Produto não encontrado.', 404);
    }

    return product;
  }

  async update(id: number, input: unknown, userId: number) {
    const productId = productIdSchema.parse(id);

    const parsedData = productUpdateSchema.parse(input);

    // Remove propriedades que chegaram como undefined.
    const data = Object.fromEntries(
      Object.entries(parsedData).filter(([, value]) => value !== undefined),
    ) as ProductUpdateInput;

    const product = await this.findById(productId, userId);

    const updatedProduct = await this.productRepository.update(productId, userId, data);

    if (!updatedProduct) {
      throw new AppError('Produto não encontrado.', 404);
    }

    // Exclui a foto antiga somente depois de atualizar o produto.
    if (data.photo !== undefined && product.photo) {
      await deletePhoto(product.photo);
    }

    return updatedProduct;
  }

  async delete(id: number, userId: number) {
    const product = await this.findById(id, userId);

    const deleted = await this.productRepository.delete(id, userId);

    if (!deleted) {
      throw new AppError('Produto não encontrado.', 404);
    }

    // Exclui a foto do Blob depois de excluir o produto.
    await deletePhoto(product.photo);

    return true;
  }

  async findDashboard(userId: number) {
    const result = await this.productRepository.findDashboard(userId);

    const activeProducts = result.find(item => item.status === true)?._count._all ?? 0;

    const inactiveProducts = result.find(item => item.status === false)?._count._all ?? 0;

    return {
      totalProducts: activeProducts + inactiveProducts,
      activeProducts,
      inactiveProducts,
    };
  }
}
