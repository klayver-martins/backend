import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../utils/app-error.ts';
import { clearAuthCookies, getRefreshCookie, setAuthCookies } from '../../../utils/auth-cookie.ts';
import type { AuthRepositoryInterface } from '../interfaces/auth-repository.interface.ts';
import { AuthRepository } from '../repositories/auth.repository.ts';
import { AuthService } from '../services/auth.service.ts';

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

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(200).json({
        message: 'Login realizado com sucesso.',
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body?.refreshToken ?? getRefreshCookie(req);

      const tokens = await this.authService.refresh(refreshToken);

      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      return res.status(200).json({
        message: 'Sessão renovada com sucesso.',
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 401) {
        clearAuthCookies(res);
      }

      return next(error);
    }
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.body?.refreshToken ?? getRefreshCookie(req);

    await this.authService.logout(refreshToken);

    clearAuthCookies(res);

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
