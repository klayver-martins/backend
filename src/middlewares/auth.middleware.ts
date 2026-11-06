import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AppError } from '../utils/app-error.ts';
import { getAuthCookie } from '../utils/auth-cookie.ts';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = getAuthCookie(req);

  if (!token) {
    return next(new AppError('Token não informado.', 401));
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new Error('JWT_SECRET não configurado.'));
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string' || typeof decoded.sub !== 'number') {
      return next(new AppError('Token inválido.', 401));
    }

    res.locals.userId = decoded.sub;

    return next();
  } catch {
    return next(new AppError('Token inválido ou expirado.', 401));
  }
}
