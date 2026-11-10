import { beforeEach, describe, expect, it } from 'vitest';

import { ProductService } from '../../service/product.service.ts';
import { ProductRepositoryInMemory } from './product-repository-in-memory.ts';

describe('ProductService', () => {
  let service: ProductService;

  const userId = 1;

  beforeEach(() => {
    const repository = new ProductRepositoryInMemory();
    service = new ProductService(repository);
  });

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      const product = await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
        },
        userId,
      );

      expect(product).toEqual(
        expect.objectContaining({
          id: 1,
          code: 'PROD-001',
          description: 'Notebook',
          status: true,
          photo: null,
          userId,
        }),
      );
    });

    it('deve criar produto com status informado', async () => {
      const product = await service.create(
        {
          code: 'PROD-002',
          description: 'Mouse',
          status: false,
        },
        userId,
      );

      expect(product.status).toBe(false);
    });

    it('deve rejeitar código vazio', async () => {
      await expect(
        service.create(
          {
            code: '',
            description: 'Notebook',
          },
          userId,
        ),
      ).rejects.toThrow('Código do produto');
    });

    it('deve rejeitar descrição vazia', async () => {
      await expect(
        service.create(
          {
            code: 'PROD-001',
            description: '',
          },
          userId,
        ),
      ).rejects.toThrow('Descrição do produto');
    });

    it('deve rejeitar status inválido', async () => {
      await expect(
        service.create(
          {
            code: 'PROD-001',
            description: 'Notebook',
            status: 'ativo',
          },
          userId,
        ),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('deve listar somente os produtos do usuário', async () => {
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

      const products = await service.findAll(1);

      expect(products).toHaveLength(1);
      expect(products[0].userId).toBe(1);
      expect(products[0].code).toBe('PROD-001');
    });

    it('deve retornar lista vazia quando usuário não possui produtos', async () => {
      const products = await service.findAll(userId);

      expect(products).toEqual([]);
    });
  });

  describe('findDashboard', () => {
    it('deve retornar o total de produtos ativos e inativos do usuário', async () => {
      await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
          status: true,
        },
        userId,
      );

      await service.create(
        {
          code: 'PROD-002',
          description: 'Mouse',
          status: true,
        },
        userId,
      );

      await service.create(
        {
          code: 'PROD-003',
          description: 'Teclado',
          status: false,
        },
        userId,
      );

      await service.create(
        {
          code: 'PROD-004',
          description: 'Monitor',
          status: true,
        },
        2,
      );

      const dashboard = await service.findDashboard(userId);

      expect(dashboard).toEqual({
        totalProducts: 3,
        activeProducts: 2,
        inactiveProducts: 1,
      });
    });

    it('deve retornar zero quando o usuário não possui produtos', async () => {
      const dashboard = await service.findDashboard(userId);

      expect(dashboard).toEqual({
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
      });
    });

    it('deve retornar zero para produtos inativos quando todos estão ativos', async () => {
      await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
          status: true,
        },
        userId,
      );

      const dashboard = await service.findDashboard(userId);

      expect(dashboard).toEqual({
        totalProducts: 1,
        activeProducts: 1,
        inactiveProducts: 0,
      });
    });

    it('deve retornar zero para produtos ativos quando todos estão inativos', async () => {
      await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
          status: false,
        },
        userId,
      );

      const dashboard = await service.findDashboard(userId);

      expect(dashboard).toEqual({
        totalProducts: 1,
        activeProducts: 0,
        inactiveProducts: 1,
      });
    });
  });

  describe('findById', () => {
    it('deve buscar um produto pelo ID', async () => {
      const created = await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
        },
        userId,
      );

      const product = await service.findById(created.id, userId);

      expect(product.id).toBe(created.id);
      expect(product.code).toBe('PROD-001');
    });

    it('deve rejeitar ID inválido', async () => {
      await expect(service.findById(0, userId)).rejects.toThrow('ID do produto inválido.');
    });

    it('deve rejeitar produto inexistente', async () => {
      await expect(service.findById(999, userId)).rejects.toThrow('Produto não encontrado.');
    });

    it('não deve permitir buscar produto de outro usuário', async () => {
      const created = await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
        },
        2,
      );

      await expect(service.findById(created.id, 1)).rejects.toThrow('Produto não encontrado.');
    });
  });

  describe('update', () => {
    it('deve atualizar os dados do produto', async () => {
      const created = await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
        },
        userId,
      );

      const updated = await service.update(
        created.id,
        {
          code: 'PROD-002',
          description: 'Notebook Gamer',
          status: false,
        },
        userId,
      );

      expect(updated).toEqual(
        expect.objectContaining({
          code: 'PROD-002',
          description: 'Notebook Gamer',
          status: false,
        }),
      );
    });

    it('deve permitir atualização parcial', async () => {
      const created = await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
        },
        userId,
      );

      const updated = await service.update(
        created.id,
        {
          description: 'Notebook atualizado',
        },
        userId,
      );

      expect(updated.code).toBe('PROD-001');
      expect(updated.description).toBe('Notebook atualizado');
    });

    it('deve rejeitar atualização com código vazio', async () => {
      const created = await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
        },
        userId,
      );

      await expect(service.update(created.id, { code: '' }, userId)).rejects.toThrow(
        'Código do produto',
      );
    });

    it('deve rejeitar atualização de produto inexistente', async () => {
      await expect(service.update(999, { description: 'Novo nome' }, userId)).rejects.toThrow(
        'Produto não encontrado.',
      );
    });
  });

  describe('delete', () => {
    it('deve excluir um produto com sucesso', async () => {
      const created = await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
        },
        userId,
      );

      const result = await service.delete(created.id, userId);

      expect(result).toBe(true);

      await expect(service.findById(created.id, userId)).rejects.toThrow('Produto não encontrado.');
    });

    it('deve rejeitar exclusão de produto inexistente', async () => {
      await expect(service.delete(999, userId)).rejects.toThrow('Produto não encontrado.');
    });

    it('não deve permitir excluir produto de outro usuário', async () => {
      const created = await service.create(
        {
          code: 'PROD-001',
          description: 'Notebook',
        },
        2,
      );

      await expect(service.delete(created.id, 1)).rejects.toThrow('Produto não encontrado.');
    });
  });
});
