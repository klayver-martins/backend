import type { Response } from 'express';
import type { RequestWithCookies } from '../types/cookie.ts';

const ACCESS_COOKIE_NAME = 'token';
const REFRESH_COOKIE_NAME = 'refresh_token';

function durationToMilliseconds(value: string, fallback: number) {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) return fallback;
  const amount = Number(match[1]);
  const unit = match[2];
  const multiplier = unit === 's' ? 1_000 : unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : 86_400_000;
  return amount * multiplier;
}

const accessMaxAge = durationToMilliseconds(process.env.ACCESS_TOKEN_TTL ?? '15m', 15 * 60 * 1000);
const refreshMaxAge = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 7) * 24 * 60 * 60 * 1000;

const sameSite = (process.env.COOKIE_SAME_SITE ?? 'lax') as 'lax' | 'strict' | 'none';

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' || sameSite === 'none',
  sameSite,
  path: '/',
};

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, { ...baseCookieOptions, maxAge: accessMaxAge });
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, { ...baseCookieOptions, maxAge: refreshMaxAge });
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
