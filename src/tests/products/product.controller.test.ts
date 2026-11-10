import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductController } from '../../controllers/product.controller.ts';
import { ProductService } from '../../service/product.service.ts';
import { ProductRepositoryInMemory } from './product-repository-in-memory.ts';

describe('ProductController', () => {
  let controller: ProductController;
  let res: ReturnType<typeof createResponse>;
  let next: ReturnType<typeof vi.fn>;

  function createResponse() {
    return {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      locals: {
        userId: 1,
      },
    };
  }

  beforeEach(() => {
    const repository = new ProductRepositoryInMemory();
    const service = new ProductService(repository);

    controller = new ProductController(service);

    res = createResponse();
    next = vi.fn();
  });

  it('deve criar um produto e retornar status 201', async () => {
    const req = {
      body: {
        code: 'PROD-001',
        description: 'Notebook',
      },
    } as unknown as Request;

    await controller.create(req, res as unknown as Response, next as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'PROD-001',
        description: 'Notebook',
        userId: 1,
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('deve encaminhar erros da criação para o next', async () => {
    const req = {
      body: {
        code: '',
        description: 'Notebook',
      },
    } as unknown as Request;

    await controller.create(req, res as unknown as Response, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledOnce();
  });

  it('deve listar os produtos do usuário e retornar status 200', async () => {
    const repository = new ProductRepositoryInMemory();
    const service = new ProductService(repository);

    await service.create(
      {
        code: 'PROD-001',
        description: 'Notebook',
      },
      1,
    );

    await service.create(
      {
        code: 'PROD-002',
        description: 'Mouse',
      },
      2,
    );

    controller = new ProductController(service);

    await controller.findAll(
      {} as Request,
      res as unknown as Response,
      next as unknown as NextFunction,
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        code: 'PROD-001',
        userId: 1,
      }),
    ]);
    expect(next).not.toHaveBeenCalled();
  });

  describe('findAllDashboard', () => {
    it('deve retornar os dados do dashboard e status 200', async () => {
      const repository = new ProductRepositoryInMemory();
      const service = new ProductService(repository);

      await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
          status: true,
        },
        1,
      );

      await service.create(
        {
          code: 'PROD-002',
          description: 'Mouse',
          status: false,
        },
        1,
      );

      await service.create(
        {
          code: 'PROD-003',
          description: 'Teclado',
          status: true,
        },
        2,
      );

      controller = new ProductController(service);

      await controller.findAllDashboard(
        {} as Request,
        res as unknown as Response,
        next as unknown as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        totalProducts: 2,
        activeProducts: 1,
        inactiveProducts: 1,
      });

      expect(next).not.toHaveBeenCalled();
    });

    it('deve encaminhar erros do dashboard para o next', async () => {
      const service = {
        findDashboard: vi.fn().mockRejectedValue(new Error('Erro ao buscar dashboard.')),
      };

      controller = new ProductController(service as unknown as ProductService);

      await controller.findAllDashboard(
        {} as Request,
        res as unknown as Response,
        next as unknown as NextFunction,
      );

      expect(next).toHaveBeenCalledOnce();
    });
  });

  it('deve buscar um produto pelo ID e retornar status 200', async () => {
    const repository = new ProductRepositoryInMemory();
    const service = new ProductService(repository);

    const product = await service.create(
      {
        code: 'PROD-001',
        description: 'Notebook',
      },
      1,
    );

    controller = new ProductController(service);

    const req = {
      params: {
        id: String(product.id),
      },
    } as unknown as Request;

    await controller.findById(req, res as unknown as Response, next as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: product.id,
        code: 'PROD-001',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('deve encaminhar erro ao buscar produto inexistente', async () => {
    const req = {
      params: {
        id: '999',
      },
    } as unknown as Request;

    await controller.findById(req, res as unknown as Response, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledOnce();
  });

  it('deve atualizar um produto e retornar status 200', async () => {
    const repository = new ProductRepositoryInMemory();
    const service = new ProductService(repository);

    const product = await service.create(
      {
        code: 'PROD-001',
        description: 'Notebook',
      },
      1,
    );

    controller = new ProductController(service);

    const req = {
      params: {
        id: String(product.id),
      },
      body: {
        description: 'Notebook Gamer',
      },
    } as unknown as Request;

    await controller.update(req, res as unknown as Response, next as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'PROD-001',
        description: 'Notebook Gamer',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('deve excluir um produto e retornar status 204', async () => {
    const repository = new ProductRepositoryInMemory();
    const service = new ProductService(repository);

    const product = await service.create(
      {
        code: 'PROD-001',
        description: 'Notebook',
      },
      1,
    );

    controller = new ProductController(service);

    const req = {
      params: {
        id: String(product.id),
      },
    } as unknown as Request;

    await controller.delete(req, res as unknown as Response, next as unknown as NextFunction);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('deve encaminhar erro ao excluir produto inexistente', async () => {
    const req = {
      params: {
        id: '999',
      },
    } as unknown as Request;

    await controller.delete(req, res as unknown as Response, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledOnce();
  });
});
