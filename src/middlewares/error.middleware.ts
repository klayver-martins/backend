import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client.ts';

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);

  // Erros conhecidos do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: 'Já existe um produto com esse código.',
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        message: 'Registro não encontrado.',
      });
    }
  }

  // Erros personalizados do Service
  const statusCode =
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
      ? error.statusCode
      : 500;

  const message = error instanceof Error ? error.message : 'Erro interno do servidor.';

  return res.status(statusCode).json({
    message,
  });
}
