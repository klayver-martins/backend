import type { User } from '../../../generated/prisma/client.ts';

export type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'updatedAt'>;

export type RefreshTokenRecord = {
  id: number;
  tokenHash: string;
  userId: number;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};

export interface AuthRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<PublicUser | null>;
  create(data: { name: string; email: string; password: string }): Promise<User>;
  createRefreshToken(data: { tokenHash: string; userId: number; expiresAt: Date }): Promise<void>;
  findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  revokeRefreshToken(tokenHash: string, revokedAt: Date): Promise<number>;
  rotateRefreshToken(oldTokenHash: string, revokedAt: Date, newToken: { tokenHash: string; userId: number; expiresAt: Date }): Promise<boolean>;
  revokeAllRefreshTokens(userId: number, revokedAt: Date): Promise<void>;
}
