import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthController } from '../../controllers/auth.controller.ts';
import { AuthRepositoryInMemory } from './auth-repository-in-memory.ts';

describe('AuthController', () => {
  let controller: AuthController;
  let res: ReturnType<typeof createResponse>;
  let next: ReturnType<typeof vi.fn>;

  function createResponse() {
    return {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
      locals: { userId: 1 },
    };
  }

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';

    const repository = new AuthRepositoryInMemory();

    controller = new AuthController(repository);
    res = createResponse();
    next = vi.fn();
  });

  it('deve registrar um usuário e retornar status 201', async () => {
    const req = {
      body: {
        name: 'João',
        email: 'joao@email.com',
        password: '123456',
      },
    } as Request;

    await controller.register(req, res as unknown as Response, next as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'João',
        email: 'joao@email.com',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('deve encaminhar erros do registro para o next', async () => {
    const req = {
      body: {
        name: '',
        email: 'joao@email.com',
        password: '123456',
      },
    } as Request;

    await controller.register(req, res as unknown as Response, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledOnce();
  });

  it('deve realizar login e retornar status 200', async () => {
    await controller.register(
      {
        body: {
          name: 'João',
          email: 'joao@email.com',
          password: '123456',
        },
      } as Request,
      res as unknown as Response,
      next as unknown as NextFunction,
    );

    res.status.mockClear();
    res.json.mockClear();

    const req = {
      body: {
        email: 'joao@email.com',
        password: '123456',
      },
    } as Request;

    await controller.login(req, res as unknown as Response, next as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Login realizado com sucesso.',
        user: expect.objectContaining({ email: 'joao@email.com' }),
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('deve encaminhar erros do login para o next', async () => {
    const req = {
      body: {
        email: 'inexistente@email.com',
        password: '123456',
      },
    } as Request;

    await controller.login(req, res as unknown as Response, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledOnce();
  });

  it('deve realizar logout e retornar status 200', async () => {
    await controller.logout({} as Request, res as unknown as Response);

    expect(res.clearCookie).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Logout realizado com sucesso.',
    });
  });

  it('deve retornar os dados do usuário autenticado', async () => {
    await controller.register(
      {
        body: {
          name: 'João',
          email: 'joao@email.com',
          password: '123456',
        },
      } as Request,
      res as unknown as Response,
      next as unknown as NextFunction,
    );

    const req = {} as Request;

    await controller.me(req, res as unknown as Response, next as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'João',
        email: 'joao@email.com',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
