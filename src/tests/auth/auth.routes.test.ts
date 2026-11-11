import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthController } from '../../controllers/auth.controller.ts';
import { createAuthRoutes } from '../../routes/auth.routes.ts';
import { AuthRepositoryInMemory } from './auth-repository-in-memory.ts';

describe('AuthRoutes', () => {
  let app: Express;
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    const controller = new AuthController(new AuthRepositoryInMemory());
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', createAuthRoutes(controller));
  });

  it('deve cadastrar usuário sem retornar senha', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'João', email: 'joao@email.com', password: '123456',
    });
    expect(response.status).toBe(201);
    expect(response.body.password).toBeUndefined();
  });

  it('login envia cookies HTTP-only sem expor tokens no JSON', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'João', email: 'joao@email.com', password: '123456',
    });
    const response = await request(app).post('/api/auth/login').send({
      email: 'joao@email.com', password: '123456',
    });
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('accessToken');
    expect(response.body).not.toHaveProperty('refreshToken');
    const cookies = response.headers['set-cookie'] as unknown as string[];
    expect(cookies).toHaveLength(2);
    expect(cookies.some(cookie => cookie.startsWith('token=') && /HttpOnly/i.test(cookie))).toBe(true);
    expect(cookies.some(cookie => cookie.startsWith('refresh_token=') && /HttpOnly/i.test(cookie))).toBe(true);
  });

  it('renova a sessão e troca os cookies', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send({
      name: 'João', email: 'joao@email.com', password: '123456',
    });
    await agent.post('/api/auth/login').send({ email: 'joao@email.com', password: '123456' });
    const response = await agent.post('/api/auth/refresh');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Sessão renovada com sucesso.');
    expect(response.headers['set-cookie']).toHaveLength(2);
  });

  it('rejeita refresh sem cookie', async () => {
    const response = await request(app).post('/api/auth/refresh');
    expect(response.status).toBe(401);
  });

  it('logout limpa os dois cookies', async () => {
    const response = await request(app).post('/api/auth/logout');
    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toHaveLength(2);
  });

  it('retorna 404 para rota inexistente', async () => {
    const response = await request(app).get('/api/auth/invalid');
    expect(response.status).toBe(404);
  });
});
