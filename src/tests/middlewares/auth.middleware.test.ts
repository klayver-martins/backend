import cookieParser from 'cookie-parser';
import express from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';
import request from 'supertest';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { authMiddleware } from '../../middlewares/auth.middleware.ts';
import { errorMiddleware } from '../../middlewares/error.middleware.ts';

const JWT_SECRET = 'test-secret';

function createApp() {
  const app = express();

  app.use(cookieParser());

  app.get('/protected', authMiddleware, (_req, res) => {
    return res.status(200).json({
      userId: res.locals.userId,
    });
  });

  app.use(errorMiddleware);

  return app;
}

function createToken(payload: object = { sub: 1 }, expiresIn: SignOptions['expiresIn'] = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

describe('Auth Middleware', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('deve permitir acesso com token válido', async () => {
    vi.stubEnv('JWT_SECRET', JWT_SECRET);

    const token = createToken();

    const response = await request(createApp()).get('/protected').set('Cookie', `token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(1);
  });

  it('deve bloquear acesso sem token', async () => {
    vi.stubEnv('JWT_SECRET', JWT_SECRET);

    const response = await request(createApp()).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token não informado.');
  });

  it('deve rejeitar token expirado', async () => {
    vi.stubEnv('JWT_SECRET', JWT_SECRET);

    const token = createToken({ sub: 1 }, -1);

    const response = await request(createApp()).get('/protected').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido ou expirado.');
  });

  it('deve rejeitar token assinado com outro segredo', async () => {
    vi.stubEnv('JWT_SECRET', JWT_SECRET);

    const token = createToken();

    const invalidToken = jwt.sign({ sub: 1 }, 'outro-segredo');

    const response = await request(createApp())
      .get('/protected')
      .set('Cookie', `token=${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido ou expirado.');
  });

  it('deve rejeitar token sem sub numérico', async () => {
    vi.stubEnv('JWT_SECRET', JWT_SECRET);

    const token = createToken({ sub: '1' });

    const response = await request(createApp()).get('/protected').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido.');
  });

  it('deve retornar erro se JWT_SECRET não estiver configurado', async () => {
    vi.stubEnv('JWT_SECRET', '');

    const token = createToken();

    const response = await request(createApp()).get('/protected').set('Cookie', `token=${token}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('JWT_SECRET não configurado.');
  });
});
