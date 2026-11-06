import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.ts';
import { authMiddleware } from '../middlewares/auth.middleware.ts';

const userRoutes = Router();
const controller = new AuthController();

userRoutes.get('/me', authMiddleware, (req, res, next) => controller.me(req, res, next));

export { userRoutes };
