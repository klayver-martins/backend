import { authDocs } from '../docs/auth.docs.ts';
import { productDocs } from '../docs/product.docs.ts';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'API de Gerenciamento de Produtos',
    version: '1.0.0',
    description: 'Documentação oficial para integração do Front-end com a API.',
  },
  servers: [{ url: 'http://localhost:3333', description: 'Servidor local' }],
  tags: [
    { name: 'Auth', description: 'Autenticação e gerenciamento de usuários.' },
    { name: 'Products', description: 'Gerenciamento de produtos.' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' },
      refreshCookieAuth: { type: 'apiKey', in: 'cookie', name: 'refresh_token' },
    },
  },
  paths: { ...authDocs, ...productDocs },
};
