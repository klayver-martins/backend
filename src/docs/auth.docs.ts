export const authDocs = {
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Cadastrar usuário',
      description: 'Cria uma nova conta de usuário.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name: {
                  type: 'string',
                  example: 'Klayver',
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'kaka@email.com',
                },
                password: {
                  type: 'string',
                  minLength: 4,
                  example: '123456',
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Usuário cadastrado com sucesso.',
          content: {
            'application/json': {
              example: {
                id: 1,
                name: 'Klayver',
                email: 'kaka@email.com',
                createdAt: '2026-11-05T23:06:47.695Z',
                updatedAt: '2026-11-05T23:06:47.695Z',
              },
            },
          },
        },
        '409': {
          description: 'E-mail já cadastrado.',
        },
        '400': {
          description: 'Dados inválidos.',
        },
      },
    },
  },

  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Realizar login',
      description:
        'Autentica o usuário. Retorna o JWT no JSON e também o armazena em um cookie HTTP-only chamado token.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'kaka@email.com',
                },
                password: {
                  type: 'string',
                  example: '123456',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Login realizado com sucesso.',
          headers: {
            'Set-Cookie': {
              description:
                'Cookie HTTP-only contendo o JWT. O navegador não pode ler esse cookie via JavaScript.',
              schema: {
                type: 'string',
                example: 'token=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Path=/',
              },
            },
          },
          content: {
            'application/json': {
              example: {
                message: 'Login realizado com sucesso.',
                user: {
                  id: 1,
                  name: 'Klayver',
                  email: 'kaka@email.com',
                },
                token: 'eyJhbGciOiJIUzI1NiIs...',
              },
            },
          },
        },
        '401': {
          description: 'E-mail ou senha inválidos.',
        },
        '400': {
          description: 'Dados inválidos.',
        },
      },
    },
  },

  '/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Realizar logout',
      description: 'Limpa o cookie de autenticação do navegador.',
      responses: {
        '200': {
          description: 'Logout realizado com sucesso.',
          content: {
            'application/json': {
              example: {
                message: 'Logout realizado com sucesso.',
              },
            },
          },
        },
      },
    },
  },

  '/users/me': {
    get: {
      tags: ['Auth'],
      summary: 'Consultar usuário autenticado',
      description: 'Retorna os dados do usuário identificado pelo JWT.',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: {
        '200': {
          description: 'Usuário autenticado.',
          content: {
            'application/json': {
              example: {
                id: 1,
                name: 'Klayver',
                email: 'kaka@email.com',
                createdAt: '2026-11-05T23:06:47.695Z',
                updatedAt: '2026-11-05T23:06:47.695Z',
              },
            },
          },
        },
        '401': {
          description: 'Token não informado, inválido ou expirado.',
        },
        '404': {
          description: 'Usuário não encontrado.',
        },
      },
    },
  },
};
