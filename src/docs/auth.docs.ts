export const authDocs = {
  '/auth/register': {
    post: {
      tags: ['Auth'], summary: 'Cadastrar usuário', description: 'Cria uma nova conta de usuário.',
      requestBody: { required: true, content: { 'application/json': { schema: {
        type: 'object', required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Klayver' },
          email: { type: 'string', format: 'email', example: 'kaka@email.com' },
          password: { type: 'string', minLength: 4, example: '123456' },
        },
      } } } },
      responses: {
        '201': { description: 'Usuário cadastrado com sucesso.' },
        '409': { description: 'E-mail já cadastrado.' },
        '400': { description: 'Dados inválidos.' },
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Auth'], summary: 'Realizar login',
      description: 'Autentica o usuário e define os cookies HTTP-only token e refresh_token. Os tokens não são retornados no JSON.',
      requestBody: { required: true, content: { 'application/json': { schema: {
        type: 'object', required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'kaka@email.com' },
          password: { type: 'string', example: '123456' },
        },
      } } } },
      responses: {
        '200': {
          description: 'Login realizado. Dois cookies HTTP-only são definidos.',
          headers: { 'Set-Cookie': { description: 'Cookies token (access) e refresh_token (refresh).', schema: { type: 'string' } } },
          content: { 'application/json': { example: { message: 'Login realizado com sucesso.', user: { id: 1, name: 'Klayver', email: 'kaka@email.com' } } } },
        },
        '401': { description: 'E-mail ou senha inválidos.' },
        '400': { description: 'Dados inválidos.' },
      },
    },
  },
  '/auth/refresh': {
    post: {
      tags: ['Auth'], summary: 'Renovar sessão',
      description: 'Valida, revoga e rotaciona o refresh token, emitindo um novo par de cookies.',
      security: [{ refreshCookieAuth: [] }],
      responses: {
        '200': { description: 'Sessão renovada. Novos cookies são enviados.' },
        '401': { description: 'Refresh token ausente, inválido, expirado ou reutilizado.' },
      },
    },
  },
  '/auth/logout': {
    post: {
      tags: ['Auth'], summary: 'Realizar logout',
      description: 'Revoga o refresh token atual e limpa os cookies de access e refresh.',
      responses: { '200': { description: 'Logout realizado com sucesso.' } },
    },
  },
  '/users/me': {
    get: {
      tags: ['Auth'], summary: 'Consultar usuário autenticado',
      description: 'Retorna os dados do usuário identificado pelo access token.',
      security: [{ cookieAuth: [] }],
      responses: {
        '200': { description: 'Usuário autenticado.' },
        '401': { description: 'Token não informado, inválido ou expirado.' },
        '404': { description: 'Usuário não encontrado.' },
      },
    },
  },
};
