import type { NextFunction, Request, Response } from 'express';

import { ProductService } from '../service/product.service.ts';

export class ProductController {
  constructor(private productService: ProductService = new ProductService()) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productService.create(
        {
          code: req.body.code,
          description: req.body.description,
          status: req.body.status,
          photo: req.file ? `uploads/${req.file.filename}` : undefined,
        },
        res.locals.userId,
      );

      return res.status(201).json(product);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productService.findAll(res.locals.userId);

      return res.status(200).json(products);
    } catch (error) {
      return next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const product = await this.productService.findById(id, res.locals.userId);

      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const product = await this.productService.update(
        id,
        {
          code: req.body.code,
          description: req.body.description,
          status: req.body.status,
          photo: req.file ? `uploads/${req.file.filename}` : undefined,
        },
        res.locals.userId,
      );

      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await this.productService.delete(id, res.locals.userId);

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async findAllDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboard = await this.productService.findDashboard(res.locals.userId);

      return res.status(200).json(dashboard);
    } catch (error) {
      return next(error);
    }
  }
}
