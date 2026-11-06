import express, { type Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { AuthController } from '../../controllers/auth.controller.ts';
import { createAuthRoutes } from '../../routes/auth.routes.ts';
import { AuthRepositoryInMemory } from './auth-repository-in-memory.ts';

describe('AuthRoutes', () => {
  let app: Express;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';

    const repository = new AuthRepositoryInMemory();
    const controller = new AuthController(repository);

    app = express();

    app.use(express.json());
    app.use('/api/auth', createAuthRoutes(controller));
  });

  it('POST /api/auth/register - deve cadastrar um usuário', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'João',
      email: 'joao@email.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'João',
        email: 'joao@email.com',
      }),
    );

    expect(response.body.password).toBeUndefined();
  });

  it('POST /api/auth/login - deve realizar login', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'João',
      email: 'joao@email.com',
      password: '123456',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'joao@email.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login realizado com sucesso.');
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('POST /api/auth/logout - deve realizar logout', async () => {
    const response = await request(app).post('/api/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Logout realizado com sucesso.',
    });
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('GET /api/auth/invalid - deve retornar 404 para uma rota inexistente', async () => {
    const response = await request(app).get('/api/auth/invalid');

    expect(response.status).toBe(404);
  });
});
