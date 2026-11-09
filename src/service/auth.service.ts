import type { AuthRepositoryInterface } from '../interfaces/repository/auth-repository.interface.ts';
import { AuthRepository } from '../repository/auth.repository.ts';
import { AppError } from '../utils/app-error.ts';

import { loginSchema } from '../schemas/login.schema.ts';
import { registerSchema } from '../schemas/register.schema.ts';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(private authRepository: AuthRepositoryInterface = new AuthRepository()) {}

  async register(input: unknown) {
    const data = registerSchema.parse(input);

    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError('Este e-mail já está cadastrado.', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.authRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHash,
    });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async login(input: unknown) {
    const data = loginSchema.parse(input);

    const user = await this.authRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não configurado.');
    }

    const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '1d' });

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async me(userId: number) {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
  }
}
