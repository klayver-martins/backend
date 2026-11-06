import fs from 'node:fs/promises';
import path from 'node:path';

import type { ProductInput } from '../interfaces/Product.ts';
import type { ProductRepositoryInterface } from '../interfaces/repository/product-repository.interface.ts';

import { ProductRepository } from '../repository/product.repository.ts';
import { AppError } from '../utils/app-error.ts';
import { validateRequiredString, validateStatus } from '../utils/validations.ts';

export class ProductService {
  constructor(private productRepository: ProductRepositoryInterface = new ProductRepository()) {}

  private async deletePhoto(photo: string | null) {
    if (!photo) return;

    const photoPath = path.resolve(process.cwd(), 'src', photo);

    try {
      await fs.unlink(photoPath);
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
        throw error;
      }
    }
  }

  async create(input: ProductInput, userId: number) {
    const code = validateRequiredString(input.code, 'Código do produto');

    const description = validateRequiredString(input.description, 'Descrição do produto');

    const status = input.status === undefined ? true : validateStatus(input.status);

    return this.productRepository.create(
      {
        code,
        description,
        status,
        photo: input.photo,
      },
      userId,
    );
  }

  async findAll(userId: number) {
    return this.productRepository.findAll(userId);
  }

  async findById(id: number, userId: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('ID do produto inválido.');
    }

    const product = await this.productRepository.findById(id, userId);

    if (!product) {
      throw new AppError('Produto não encontrado.', 404);
    }

    return product;
  }

  async update(id: number, input: ProductInput, userId: number) {
    const product = await this.findById(id, userId);

    const data: {
      code?: string;
      description?: string;
      status?: boolean;
      photo?: string;
    } = {};

    if (input.code !== undefined) {
      data.code = validateRequiredString(input.code, 'Código do produto');
    }

    if (input.description !== undefined) {
      data.description = validateRequiredString(input.description, 'Descrição do produto');
    }

    if (input.status !== undefined) {
      data.status = validateStatus(input.status);
    }

    if (input.photo !== undefined) {
      data.photo = input.photo;
    }

    const updatedProduct = await this.productRepository.update(id, userId, data);

    if (!updatedProduct) {
      throw new AppError('Produto não encontrado.', 404);
    }

    // Remove a foto antiga somente após atualizar o produto.
    if (input.photo !== undefined && product.photo) {
      await this.deletePhoto(product.photo);
    }

    return updatedProduct;
  }

  async delete(id: number, userId: number) {
    const product = await this.findById(id, userId);

    const deleted = await this.productRepository.delete(id, userId);

    if (!deleted) {
      throw new AppError('Produto não encontrado.', 404);
    }

    await this.deletePhoto(product.photo);

    return true;
  }
}
