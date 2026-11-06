import { describe, expect, it } from 'vitest';
import { AuthService } from '../../service/auth.service.ts';
import { AuthRepositoryInMemory } from './auth-repository-in-memory.ts';

describe('AuthService - Register', () => {
  it('deve cadastrar um usuário com sucesso', async () => {
    const repository = new AuthRepositoryInMemory();
    const authService = new AuthService(repository);

    const user = await authService.register({
      name: 'João',
      email: 'joao@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('João');
    expect(user.email).toBe('joao@email.com');
    expect(user).not.toHaveProperty('password');
  });

  it('não deve cadastrar dois usuários com o mesmo e-mail', async () => {
    const repository = new AuthRepositoryInMemory();
    const authService = new AuthService(repository);

    await authService.register({
      name: 'João',
      email: 'joao@email.com',
      password: '123456',
    });

    await expect(
      authService.register({
        name: 'Maria',
        email: 'joao@email.com',
        password: '123456',
      }),
    ).rejects.toMatchObject({
      message: 'Este e-mail já está cadastrado.',
      statusCode: 409,
    });
  });

  it('não deve cadastrar usuário sem nome', async () => {
    const authService = new AuthService(new AuthRepositoryInMemory());

    await expect(
      authService.register({
        name: '',
        email: 'joao@email.com',
        password: '123456',
      }),
    ).rejects.toThrow('Nome é obrigatório.');
  });

  it('não deve cadastrar usuário com e-mail inválido', async () => {
    const authService = new AuthService(new AuthRepositoryInMemory());

    await expect(
      authService.register({
        name: 'João',
        email: 'email-invalido',
        password: '123456',
      }),
    ).rejects.toThrow('Informe um e-mail válido.');
  });

  it('não deve cadastrar usuário com senha menor que 4 caracteres', async () => {
    const authService = new AuthService(new AuthRepositoryInMemory());

    await expect(
      authService.register({
        name: 'João',
        email: 'joao@email.com',
        password: '123',
      }),
    ).rejects.toThrow('A senha deve ter pelo menos 4 caracteres.');
  });
});
