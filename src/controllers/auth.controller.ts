import type { NextFunction, Request, Response } from 'express';
import type { AuthRepositoryInterface } from '../interfaces/repository/auth-repository.interface.ts';
import { AuthRepository } from '../repository/auth.repository.ts';
import { AuthService } from '../service/auth.service.ts';
import { clearAuthCookie, setAuthCookie } from '../utils/auth-cookie.ts';

export class AuthController {
  private authService: AuthService;

  constructor(repository: AuthRepositoryInterface = new AuthRepository()) {
    this.authService = new AuthService(repository);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.register(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.authService.login(req.body);
      setAuthCookie(res, result.token);

      return res.status(200).json({
        message: 'Login realizado com sucesso.',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response) {
    clearAuthCookie(res);

    return res.status(200).json({
      message: 'Logout realizado com sucesso.',
    });
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.me(res.locals.userId);

      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }
}
