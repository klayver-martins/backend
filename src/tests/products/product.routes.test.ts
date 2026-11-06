import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';

import { beforeEach, describe, expect, it } from 'vitest';

import { ProductController } from '../../controllers/product.controller.ts';
import { errorMiddleware } from '../../middlewares/error.middleware.ts';
import { createProductRoutes } from '../../routes/product.routes.ts';
import { ProductService } from '../../service/product.service.ts';

import { ProductRepositoryInMemory } from './product-repository-in-memory.ts';

const JWT_SECRET = 'test-secret';

process.env.JWT_SECRET = JWT_SECRET;

function createAuthCookie(userId = 1) {
  const token = jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return `token=${token}`;
}

function createTestApp() {
  const repository = new ProductRepositoryInMemory();

  const service = new ProductService(repository);
  const controller = new ProductController(service);

  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use('/products', createProductRoutes(controller));

  app.use(errorMiddleware);

  return { app, repository };
}

describe('Product Routes', () => {
  let app: ReturnType<typeof createTestApp>['app'];
  let repository: ProductRepositoryInMemory;

  beforeEach(() => {
    const setup = createTestApp();

    app = setup.app;
    repository = setup.repository;
  });

  it('deve bloquear acesso sem token', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token não informado.');
  });

  it('deve bloquear acesso com token inválido', async () => {
    const response = await request(app).get('/products').set('Cookie', 'token=token-invalido');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido ou expirado.');
  });

  it('deve listar somente os produtos do usuário autenticado', async () => {
    await repository.create(
      {
        code: 'PROD-001',
        description: 'Produto do usuário 1',
        status: true,
      },
      1,
    );

    await repository.create(
      {
        code: 'PROD-002',
        description: 'Produto do usuário 2',
        status: true,
      },
      2,
    );

    const response = await request(app).get('/products').set('Cookie', createAuthCookie(1));

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].code).toBe('PROD-001');
  });

  it('deve cadastrar um produto', async () => {
    const response = await request(app).post('/products').set('Cookie', createAuthCookie()).send({
      code: 'PROD-001',
      description: 'Produto de teste',
    });

    expect(response.status).toBe(201);
    expect(response.body.code).toBe('PROD-001');
    expect(response.body.description).toBe('Produto de teste');
    expect(response.body.status).toBe(true);
    expect(response.body.userId).toBe(1);
  });

  it('deve buscar um produto pelo ID', async () => {
    const product = await repository.create(
      {
        code: 'PROD-001',
        description: 'Produto de teste',
        status: true,
      },
      1,
    );

    const response = await request(app)
      .get(`/products/${product.id}`)
      .set('Cookie', createAuthCookie());

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(product.id);
    expect(response.body.code).toBe('PROD-001');
  });

  it('deve retornar 404 ao buscar produto inexistente', async () => {
    const response = await request(app).get('/products/999').set('Cookie', createAuthCookie());

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Produto não encontrado.');
  });

  it('deve atualizar um produto', async () => {
    const product = await repository.create(
      {
        code: 'PROD-001',
        description: 'Descrição antiga',
        status: true,
      },
      1,
    );

    const response = await request(app)
      .put(`/products/${product.id}`)
      .set('Cookie', createAuthCookie())
      .send({
        description: 'Descrição atualizada',
      });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe('Descrição atualizada');
  });

  it('deve excluir um produto', async () => {
    const product = await repository.create(
      {
        code: 'PROD-001',
        description: 'Produto de teste',
        status: true,
      },
      1,
    );

    const response = await request(app)
      .delete(`/products/${product.id}`)
      .set('Cookie', createAuthCookie());

    expect(response.status).toBe(204);

    const deletedProduct = await repository.findById(product.id, 1);

    expect(deletedProduct).toBeNull();
  });

  it('não deve permitir acessar produto de outro usuário', async () => {
    const product = await repository.create(
      {
        code: 'PROD-001',
        description: 'Produto de outro usuário',
        status: true,
      },
      2,
    );

    const response = await request(app)
      .get(`/products/${product.id}`)
      .set('Cookie', createAuthCookie(1));

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Produto não encontrado.');
  });
});
