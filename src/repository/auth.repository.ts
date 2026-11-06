import { prisma } from '../config/prisma.ts';
import type { AuthRepositoryInterface } from '../interfaces/repository/auth-repository.interface.ts';

export class AuthRepository implements AuthRepositoryInterface {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data,
    });
  }
}
