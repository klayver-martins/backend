import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.ts';

export function createAuthRoutes(controller: AuthController = new AuthController()) {
  const authRoutes = Router();

  authRoutes.post('/register', (req, res, next) => controller.register(req, res, next));

  authRoutes.post('/login', (req, res, next) => controller.login(req, res, next));

  authRoutes.post('/logout', (req, res, next) => controller.logout(req, res));

  return authRoutes;
}

export const authRoutes = createAuthRoutes();
