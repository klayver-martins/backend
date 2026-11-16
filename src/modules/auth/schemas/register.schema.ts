import z from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.'),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'E-mail é obrigatório.')
    .email('Informe um e-mail válido.'),

  password: z
    .string()
    .min(1, 'Senha é obrigatória.')
    .min(4, 'A senha deve ter pelo menos 4 caracteres.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
