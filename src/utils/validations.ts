import { AppError } from './app-error';

export function validateRequiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`${field} é obrigatório.`);
  }

  return value.trim();
}

export function validateStatus(value: unknown): boolean {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;

  throw new AppError('Status deve ser true ou false.');
}
