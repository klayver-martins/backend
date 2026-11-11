import { createHash, randomBytes } from 'node:crypto';
import type { AuthRepositoryInterface } from '../interfaces/repository/auth-repository.interface.ts';
import { AuthRepository } from '../repository/auth.repository.ts';
import { AppError } from '../utils/app-error.ts';
import { loginSchema } from '../schemas/login.schema.ts';
import { registerSchema } from '../schemas/register.schema.ts';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL ?? '15m';
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 7);

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET não configurado.');
  return secret;
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function getRefreshTokenExpiration() {
  if (!Number.isInteger(REFRESH_TOKEN_TTL_DAYS) || REFRESH_TOKEN_TTL_DAYS <= 0) {
    throw new Error('REFRESH_TOKEN_TTL_DAYS deve ser um número inteiro positivo.');
  }
  return new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export class AuthService {
  constructor(private authRepository: AuthRepositoryInterface = new AuthRepository()) {}

  async register(input: unknown) {
    const data = registerSchema.parse(input);
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) throw new AppError('Este e-mail já está cadastrado.', 409);

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.authRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHash,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private createTokenPair(userId: number) {
    const accessToken = jwt.sign({ sub: userId }, getJwtSecret(), {
      expiresIn: ACCESS_TOKEN_TTL as SignOptions['expiresIn'],
    });
    const refreshToken = randomBytes(64).toString('hex');
    return { accessToken, refreshToken };
  }

  private async createSession(userId: number) {
    const tokens = this.createTokenPair(userId);
    await this.authRepository.createRefreshToken({
      tokenHash: hashToken(tokens.refreshToken),
      userId,
      expiresAt: getRefreshTokenExpiration(),
    });
    return tokens;
  }

  async login(input: unknown) {
    const data = loginSchema.parse(input);
    const user = await this.authRepository.findByEmail(data.email);

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    const session = await this.createSession(user.id);
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, ...session };
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw new AppError('Refresh token não informado.', 401);

    const tokenHash = hashToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!storedToken) throw new AppError('Refresh token inválido ou expirado.', 401);

    const now = new Date();

    if (storedToken.revokedAt) {
      // A tentativa de reutilizar um token já rotacionado invalida todas as sessões do usuário.
      await this.authRepository.revokeAllRefreshTokens(storedToken.userId, now);
      throw new AppError('Refresh token reutilizado. Faça login novamente.', 401);
    }

    if (storedToken.expiresAt <= now) {
      await this.authRepository.revokeRefreshToken(tokenHash, now);
      throw new AppError('Refresh token inválido ou expirado.', 401);
    }

    const tokens = this.createTokenPair(storedToken.userId);
    const rotated = await this.authRepository.rotateRefreshToken(tokenHash, now, {
      tokenHash: hashToken(tokens.refreshToken),
      userId: storedToken.userId,
      expiresAt: getRefreshTokenExpiration(),
    });

    if (!rotated) {
      await this.authRepository.revokeAllRefreshTokens(storedToken.userId, now);
      throw new AppError('Refresh token reutilizado. Faça login novamente.', 401);
    }

    return tokens;
  }

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return;
    await this.authRepository.revokeRefreshToken(hashToken(refreshToken), new Date());
  }

  async me(userId: number) {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new AppError('Usuário não encontrado.', 404);
    return user;
  }
}
