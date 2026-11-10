import { prisma } from '../config/prisma.ts';
import type { CreateProductData, UpdateProductData } from '../interfaces/Product.ts';
import type { ProductRepositoryInterface } from '../interfaces/repository/product-repository.interface.ts';

export class ProductRepository implements ProductRepositoryInterface {
  async create(data: CreateProductData, userId: number) {
    return prisma.product.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return prisma.product.findMany({
      where: { userId },
      orderBy: [{ status: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: number, userId: number) {
    return prisma.product.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async update(id: number, userId: number, data: UpdateProductData) {
    const result = await prisma.product.updateMany({
      where: {
        id,
        userId,
      },
      data,
    });

    if (result.count === 0) {
      return null;
    }

    return this.findById(id, userId);
  }

  async delete(id: number, userId: number) {
    const result = await prisma.product.deleteMany({
      where: {
        id,
        userId,
      },
    });

    return result.count > 0;
  }

  async findDashboard(userId: number) {
    return prisma.product.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        _all: true,
      },
    });
  }
}
