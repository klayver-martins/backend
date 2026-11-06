# TODO — API de Gerenciamento de Produtos

## Backend

- [x] Configuração do Node.js com TypeScript
- [x] Configuração do Express
- [x] Configuração do Prisma ORM
- [x] Configuração do PostgreSQL com Docker
- [x] Criação do banco de dados e migrations
- [x] Estruturação do projeto em camadas (Controller, Service e Repository)

## API de autenticação

- [x] Cadastro de usuários
- [x] Login de usuários
- [x] Criptografia de senhas com bcrypt
- [x] Geração de JWT
- [x] Autenticação via middleware
- [x] Cookie HTTP-only para autenticação
- [x] Logout
- [x] Rota para consultar usuário autenticado (`/auth/me`)

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

- [x] Criar pasta `docs`
- [x] Documentar endpoints de autenticação
- [x] Documentar endpoints de produtos
- [x] Configurar Swagger
- [x] Conferir exemplos de requisições e respostas

## Testes automatizados

- [x] Instalar e configurar Vitest
- [x] Instalar e configurar Supertest
- [x] Testar cadastro e login
- [x] Testar criação e listagem de produtos
- [x] Testar atualização e exclusão
- [x] Testar autenticação e permissões
- [x] Executar todos os testes com `npm test`

## Finalização

- [x] Revisar variáveis de ambiente
- [x] Criar arquivo `.env.example`
- [x] Revisar README com instruções de instalação e execução
- [x] Preparar configuração para deploy
- [x] Criar o github actions
- [ ] Fazer deploy da API
