import type { Response } from 'express';
import type { RequestWithCookies } from '../types/cookie.ts';

const ACCESS_COOKIE_NAME = 'token';
const REFRESH_COOKIE_NAME = 'refresh_token';
const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 7) * 24 * 60 * 60 * 1000;

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, { ...baseCookieOptions, maxAge: ACCESS_MAX_AGE });
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, { ...baseCookieOptions, maxAge: REFRESH_MAX_AGE });
}

export function getAuthCookie(req: RequestWithCookies) {
  return req.cookies?.[ACCESS_COOKIE_NAME];
}

export function getRefreshCookie(req: RequestWithCookies) {
  return req.cookies?.[REFRESH_COOKIE_NAME];
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE_NAME, baseCookieOptions);
  res.clearCookie(REFRESH_COOKIE_NAME, baseCookieOptions);
}
