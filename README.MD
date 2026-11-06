# TODO — API de Gerenciamento de Produtos

## Backend

- [x] Configuração do Node.js com TypeScript
- [x] Configuração do Express
- [x] Configuração do Prisma ORM
- [x] Configuração do PostgreSQL com Docker
- [x] Criação do banco de dados e migrations
- [x] Configuração das variáveis de ambiente
- [x] Estruturação do projeto em camadas (Controller, Service e Repository)
- [x] Configuração do tratamento global de erros
- [x] Configuração de CORS
- [x] Configuração de cookies com Cookie Parser
- [x] Configuração de arquivos estáticos para uploads

## API de autenticação

- [x] Cadastro de usuários
- [x] Login de usuários
- [x] Criptografia de senhas com bcrypt
- [x] Geração de JWT
- [x] Autenticação via middleware
- [x] Cookie HTTP-only para autenticação
- [x] Logout
- [x] Rota para consultar usuário autenticado (`/auth/me`)
- [x] Validações dos dados de autenticação

## API de produtos

- [x] Cadastro de produtos
- [x] Listagem de produtos
- [x] Busca de produto por ID
- [x] Atualização de produtos
- [x] Exclusão de produtos
- [x] Associação de produtos ao usuário autenticado
- [x] Restrição de acesso aos produtos por usuário
- [x] Upload opcional de imagens
- [x] Validações de dados

## Documentação

- [x] Documentar endpoints de autenticação
- [x] Documentar endpoints de produtos
- [x] Configurar Swagger
- [x] Disponibilizar documentação interativa da API
- [x] Conferir exemplos de requisições e respostas

## Testes automatizados

- [x] Instalar e configurar Vitest
- [x] Instalar e configurar Supertest
- [x] Criar testes unitários para Services
- [x] Criar testes para Controllers
- [x] Criar testes para Routes
- [x] Testar cadastro e login
- [x] Testar criação e listagem de produtos
- [x] Testar atualização e exclusão
- [x] Testar autenticação
- [x] Testar middlewares
- [x] Utilizar repositórios em memória para testes sem conexão com PostgreSQL
- [x] Executar todos os testes com `npm run test:run`
- [x] Validar todos os testes automatizados

## Docker e banco de dados

- [x] Criar configuração `docker-compose.yml`
- [x] Configurar container PostgreSQL
- [x] Configurar persistência de dados com volume Docker
- [x] Configurar healthcheck do PostgreSQL
- [x] Configurar migrations com Prisma
- [x] Configurar geração do Prisma Client

## Deploy e infraestrutura

- [x] Criar repositório no GitHub
- [x] Configurar projeto na Vercel
- [x] Configurar deploy da API na Vercel
- [x] Configurar banco de dados PostgreSQL na Neon
- [x] Configurar variáveis de ambiente na Vercel
- [x] Criar endpoint de verificação de funcionamento (`/health`)
- [x] Disponibilizar API em ambiente de produção
- [x] Automatizar execução das migrations com GitHub Actions
- [x] Validar pipeline de migrations em produção

## Finalização

- [x] Revisar variáveis de ambiente
- [x] Criar arquivo `.env.example`
- [x] Revisar configuração do TypeScript
- [x] Revisar README com instruções de instalação e execução
- [x] Preparar configuração para deploy
- [x] Finalizar automação de CI/CD
- [x] Fazer deploy da API
