const productSecurity = [{ bearerAuth: [] }, { cookieAuth: [] }];

const productIdParameter = [
  {
    in: 'path',
    name: 'id',
    required: true,
    description: 'ID do produto.',
    schema: {
      type: 'integer',
      example: 1,
    },
  },
];

export const productDocs = {
  '/products': {
    post: {
      tags: ['Products'],
      summary: 'Cadastrar produto',
      description: 'Cadastra um produto vinculado ao usuário autenticado. A foto é opcional.',
      security: productSecurity,
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['code', 'description'],
              properties: {
                code: {
                  type: 'string',
                  example: 'PROD001',
                },
                description: {
                  type: 'string',
                  example: 'Teclado mecânico',
                },
                status: {
                  type: 'boolean',
                  default: true,
                  example: true,
                },
                photo: {
                  type: 'string',
                  format: 'binary',
                  description: 'Imagem do produto (opcional).',
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Produto cadastrado com sucesso.',
          content: {
            'application/json': {
              example: {
                id: 1,
                code: 'PROD001',
                description: 'Teclado mecânico',
                status: true,
                photo: null,
                userId: 1,
              },
            },
          },
        },
        '401': {
          description: 'Não autorizado.',
        },
        '400': {
          description: 'Dados inválidos.',
        },
      },
    },

    get: {
      tags: ['Products'],
      summary: 'Listar produtos',
      description: 'Retorna somente os produtos pertencentes ao usuário autenticado.',
      security: productSecurity,
      responses: {
        '200': {
          description: 'Lista de produtos.',
          content: {
            'application/json': {
              example: [
                {
                  id: 1,
                  code: 'PROD001',
                  description: 'Teclado mecânico',
                  status: true,
                  photo: null,
                  userId: 1,
                },
              ],
            },
          },
        },
        '401': {
          description: 'Não autorizado.',
        },
      },
    },
  },

  '/products/{id}': {
    get: {
      tags: ['Products'],
      summary: 'Buscar produto por ID',
      description: 'Busca um produto pertencente ao usuário autenticado.',
      security: productSecurity,
      parameters: productIdParameter,
      responses: {
        '200': {
          description: 'Produto encontrado.',
        },
        '401': {
          description: 'Não autorizado.',
        },
        '404': {
          description: 'Produto não encontrado.',
        },
      },
    },

    put: {
      tags: ['Products'],
      summary: 'Atualizar produto',
      description:
        'Atualiza os dados de um produto pertencente ao usuário autenticado. Os campos enviados são atualizados; a foto é opcional.',
      security: productSecurity,
      parameters: productIdParameter,
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'PROD002',
                },
                description: {
                  type: 'string',
                  example: 'Mouse sem fio',
                },
                status: {
                  type: 'boolean',
                  example: true,
                },
                photo: {
                  type: 'string',
                  format: 'binary',
                  description: 'Nova imagem do produto (opcional).',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Produto atualizado com sucesso.',
        },
        '401': {
          description: 'Não autorizado.',
        },
        '404': {
          description: 'Produto não encontrado.',
        },
      },
    },

    delete: {
      tags: ['Products'],
      summary: 'Excluir produto',
      description: 'Exclui um produto pertencente ao usuário autenticado.',
      security: productSecurity,
      parameters: productIdParameter,
      responses: {
        '204': {
          description: 'Produto excluído com sucesso.',
        },
        '401': {
          description: 'Não autorizado.',
        },
        '404': {
          description: 'Produto não encontrado.',
        },
      },
    },
  },
};
