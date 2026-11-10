import { Router } from 'express';

import { ProductController } from '../controllers/product.controller.ts';
import { authMiddleware } from '../middlewares/auth.middleware.ts';
import { upload } from '../middlewares/upload.middleware.ts';

export function createProductRoutes(controller: ProductController = new ProductController()) {
  const productRoutes = Router();

  // Protege todas as rotas de produtos
  productRoutes.use(authMiddleware);

  productRoutes.post('/', upload.single('photo'), (req, res, next) =>
    controller.create(req, res, next),
  );

  productRoutes.get('/', (req, res, next) => controller.findAll(req, res, next));

  productRoutes.get('/dashboard', (req, res, next) => controller.findAllDashboard(req, res, next));

  productRoutes.get('/:id', (req, res, next) => controller.findById(req, res, next));

  productRoutes.put('/:id', upload.single('photo'), (req, res, next) =>
    controller.update(req, res, next),
  );

  productRoutes.delete('/:id', (req, res, next) => controller.delete(req, res, next));

  return productRoutes;
}

export const productRoutes = createProductRoutes();
