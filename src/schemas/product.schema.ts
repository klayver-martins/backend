import { z } from 'zod';

const productFields = {
  code: z.string().trim().min(1, 'Código do produto é obrigatório.'),

  description: z.string().trim().min(1, 'Descrição do produto é obrigatória.'),

  status: z.boolean(),

  photo: z.string().optional(),
};

export const productCreateSchema = z.object({
  ...productFields,
  status: z.boolean().default(true),
});

export const productUpdateSchema = z
  .object({
    code: productFields.code.optional(),
    description: productFields.description.optional(),
    status: productFields.status.optional(),
    photo: productFields.photo.optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Informe pelo menos um campo para atualizar.',
  });

export const productIdSchema = z
  .number()
  .int('ID do produto deve ser um número inteiro.')
  .positive('ID do produto inválido.');

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
