import { describe, expect, it } from 'vitest';
import { AuthService } from '../../service/auth.service.ts';
import { AuthRepositoryInMemory } from './auth-repository-in-memory.ts';

describe('AuthService - Me', () => {
  it('deve retornar os dados do usuário pelo ID', async () => {
    const repository = new AuthRepositoryInMemory();
    const authService = new AuthService(repository);

    const user = await authService.register({
      name: 'João',
      email: 'joao@email.com',
      password: '123456',
    });

    const result = await authService.me(user.id);

    expect(result.id).toBe(user.id);
    expect(result.name).toBe('João');
    expect(result.email).toBe('joao@email.com');
    expect(result).not.toHaveProperty('password');
  });

  it('não deve retornar usuário inexistente', async () => {
    const authService = new AuthService(new AuthRepositoryInMemory());

    await expect(authService.me(999)).rejects.toMatchObject({
      message: 'Usuário não encontrado.',
      statusCode: 404,
    });
  });
});
