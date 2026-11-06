import type { AuthRepositoryInterface } from '../interfaces/repository/auth-repository.interface.ts';
import type { LoginInput, UserInput } from '../interfaces/User.ts';
import { AuthRepository } from '../repository/auth.repository.ts';
import { AppError } from '../utils/app-error.ts';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(private authRepository: AuthRepositoryInterface = new AuthRepository()) {}

  private validateEmail(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new AppError('E-mail é obrigatório.');
    }

    const email = value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new AppError('Informe um e-mail válido.');
    }

    return email;
  }

  async register(input: UserInput) {
    if (typeof input.name !== 'string' || !input.name.trim()) {
      throw new AppError('Nome é obrigatório.');
    }

    const name = input.name.trim();

    if (typeof input.password !== 'string' || !input.password) {
      throw new AppError('Senha é obrigatória.');
    }

    if (input.password.length < 4) {
      throw new AppError('A senha deve ter pelo menos 4 caracteres.');
    }

    const email = this.validateEmail(input.email);

    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError('Este e-mail já está cadastrado.', 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.authRepository.create({
      name,
      email,
      password: passwordHash,
    });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async login(input: LoginInput) {
    const email = this.validateEmail(input.email);

    if (typeof input.password !== 'string' || !input.password) {
      throw new AppError('Senha é obrigatória.');
    }

    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);

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
