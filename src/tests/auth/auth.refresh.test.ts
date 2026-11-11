import { describe, expect, it, beforeEach } from 'vitest';
import { AuthService } from '../../service/auth.service.ts';
import { AuthRepositoryInMemory } from './auth-repository-in-memory.ts';

describe('AuthService - Refresh Token', () => {
  let repository: AuthRepositoryInMemory;
  let service: AuthService;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.ACCESS_TOKEN_TTL = '15m';
    process.env.REFRESH_TOKEN_TTL_DAYS = '7';
    repository = new AuthRepositoryInMemory();
    service = new AuthService(repository);
  });

  async function login() {
    await service.register({
      name: 'João',
      email: 'joao@email.com',
      password: '123456',
    });
    return service.login({ email: 'joao@email.com', password: '123456' });
  }

  it('deve emitir access token e refresh token no login', async () => {
    const result = await login();

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.refreshToken).not.toBe(result.accessToken);
    expect(repository.getRefreshTokens()).toHaveLength(1);
    expect(repository.getRefreshTokens()[0].tokenHash).not.toBe(result.refreshToken);
  });

  it('deve rotacionar o refresh token e invalidar o anterior', async () => {
    const firstSession = await login();
    const secondSession = await service.refresh(firstSession.refreshToken);

    expect(secondSession.accessToken).toEqual(expect.any(String));
    expect(secondSession.refreshToken).toEqual(expect.any(String));
    expect(secondSession.refreshToken).not.toBe(firstSession.refreshToken);

    await expect(service.refresh(firstSession.refreshToken)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Refresh token reutilizado. Faça login novamente.',
    });
    await expect(service.refresh(secondSession.refreshToken)).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('não deve renovar sem refresh token', async () => {
    await expect(service.refresh(undefined)).rejects.toMatchObject({ statusCode: 401 });
  });

  it('não deve renovar refresh token expirado', async () => {
    const session = await login();
    repository.getRefreshTokens()[0].expiresAt = new Date(Date.now() - 1_000);

    await expect(service.refresh(session.refreshToken)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Refresh token inválido ou expirado.',
    });
  });

  it('não deve renovar com refresh token desconhecido', async () => {
    await expect(service.refresh('token-inexistente')).rejects.toMatchObject({ statusCode: 401 });
  });

  it('deve revogar o refresh token no logout', async () => {
    const session = await login();

    await service.logout(session.refreshToken);

    await expect(service.refresh(session.refreshToken)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Refresh token reutilizado. Faça login novamente.',
    });
  });

  it('deve aceitar logout sem refresh token', async () => {
    await expect(service.logout(undefined)).resolves.toBeUndefined();
  });
});
