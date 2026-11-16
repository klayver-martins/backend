import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.ts';
import { AuthController } from '../modules/auth/controllers/auth.controller.ts';

const userRoutes = Router();
const controller = new AuthController();

userRoutes.get('/me', authMiddleware, (req, res, next) => controller.me(req, res, next));

export { userRoutes };
