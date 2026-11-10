import type { Response } from 'express';
import type { RequestWithCookies } from '../types/cookie.ts';

const COOKIE_NAME = 'token';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
};

export function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, cookieOptions);
}

export function getAuthCookie(req: RequestWithCookies) {
  return req.cookies?.[COOKIE_NAME];
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}
