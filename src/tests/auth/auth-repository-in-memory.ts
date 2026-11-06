import type { User } from '../../../generated/prisma/client.ts';
import type {
  AuthRepositoryInterface,
  PublicUser,
} from '../../interfaces/repository/auth-repository.interface.ts';

export class AuthRepositoryInMemory implements AuthRepositoryInterface {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) ?? null;
  }

  async findById(id: number): Promise<PublicUser | null> {
    const user = this.users.find(user => user.id === id);

    if (!user) {
      return null;
    }

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
}
