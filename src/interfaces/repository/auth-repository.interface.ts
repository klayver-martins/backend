import type { User } from '../../../generated/prisma/client.ts';

export type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'updatedAt'>;

export interface AuthRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;

  findById(id: number): Promise<PublicUser | null>;

  create(data: { name: string; email: string; password: string }): Promise<User>;
}
