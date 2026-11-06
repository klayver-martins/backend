import { describe, expect, it } from 'vitest';
import { AuthService } from '../../service/auth.service.ts';
import { AuthRepositoryInMemory } from './auth-repository-in-memory.ts';

describe('AuthService - Login', () => {
  it('deve realizar login com sucesso', async () => {
    const repository = new AuthRepositoryInMemory();
    const authService = new AuthService(repository);

    await authService.register({
      name: 'João',
      email: 'joao@email.com',
      password: '123456',
    });

    const result = await authService.login({
      email: 'joao@email.com',
      password: '123456',
    });

    expect(result.user.email).toBe('joao@email.com');
    expect(result.user).not.toHaveProperty('password');
    expect(result.token).toBeTruthy();
  });

  it('não deve realizar login com e-mail inexistente', async () => {
    const authService = new AuthService(new AuthRepositoryInMemory());

    await expect(
      authService.login({
        email: 'naoexiste@email.com',
        password: '123456',
      }),
    ).rejects.toMatchObject({
      message: 'E-mail ou senha inválidos.',
      statusCode: 401,
    });
  });

  it('não deve realizar login com senha incorreta', async () => {
    const repository = new AuthRepositoryInMemory();
    const authService = new AuthService(repository);

    await authService.register({
      name: 'João',
      email: 'joao@email.com',
      password: '123456',
    });

    await expect(
      authService.login({
        email: 'joao@email.com',
        password: 'senhaerrada',
      }),
    ).rejects.toMatchObject({
      message: 'E-mail ou senha inválidos.',
      statusCode: 401,
    });
  });

  it('não deve realizar login com e-mail inválido', async () => {
    const authService = new AuthService(new AuthRepositoryInMemory());

    await expect(
      authService.login({
        email: 'email-invalido',
        password: '123456',
      }),
    ).rejects.toThrow('Informe um e-mail válido.');
  });

  it('não deve realizar login sem senha', async () => {
    const authService = new AuthService(new AuthRepositoryInMemory());

    await expect(
      authService.login({
        email: 'joao@email.com',
        password: '',
      }),
    ).rejects.toThrow('Senha é obrigatória.');
  });
});
