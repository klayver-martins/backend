import { prisma } from '../config/prisma.ts';
import type { AuthRepositoryInterface } from '../interfaces/repository/auth-repository.interface.ts';

export class AuthRepository implements AuthRepositoryInterface {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({ data });
  }

  async createRefreshToken(data: { tokenHash: string; userId: number; expiresAt: Date }) {
    await prisma.refreshToken.create({ data });
  }

  async findRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  async revokeRefreshToken(tokenHash: string, revokedAt: Date) {
    const result = await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt },
    });

    return result.count;
  }

  async revokeAllRefreshTokens(userId: number, revokedAt: Date) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt },
    });
  }
}
