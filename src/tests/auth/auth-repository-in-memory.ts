import type { User } from '../../../generated/prisma/client.ts';
import type {
  AuthRepositoryInterface,
  PublicUser,
  RefreshTokenRecord,
} from '../../interfaces/repository/auth-repository.interface.ts';

export class AuthRepositoryInMemory implements AuthRepositoryInterface {
  private users: User[] = [];
  private refreshTokens: RefreshTokenRecord[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) ?? null;
  }

  async findById(id: number): Promise<PublicUser | null> {
    const user = this.users.find(user => user.id === id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(data: { name: string; email: string; password: string }): Promise<User> {
    const user: User = {
      id: this.users.length + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async createRefreshToken(data: { tokenHash: string; userId: number; expiresAt: Date }) {
    this.refreshTokens.push({
      id: this.refreshTokens.length + 1,
      ...data,
      revokedAt: null,
      createdAt: new Date(),
    });
  }

  async findRefreshTokenByHash(tokenHash: string) {
    return this.refreshTokens.find(token => token.tokenHash === tokenHash) ?? null;
  }

  async revokeRefreshToken(tokenHash: string, revokedAt: Date) {
    const token = this.refreshTokens.find(item => item.tokenHash === tokenHash && !item.revokedAt);
    if (!token) return 0;
    token.revokedAt = revokedAt;
    return 1;
  }

  async revokeAllRefreshTokens(userId: number, revokedAt: Date) {
    for (const token of this.refreshTokens) {
      if (token.userId === userId && !token.revokedAt) token.revokedAt = revokedAt;
    }
  }
}
