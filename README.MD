# Backend — API de Gerenciamento de Produtos

API REST desenvolvida com **Node.js, TypeScript e Express**, com autenticação JWT e gerenciamento de produtos. O projeto utiliza Prisma ORM para acesso ao banco de dados PostgreSQL e Zod para validação dos dados.

## 🚀 Tecnologias

- **Node.js** — ambiente de execução.
- **TypeScript** — tipagem estática.
- **Express 5** — construção da API REST.
- **PostgreSQL** — banco de dados relacional.
- **Prisma 7** — ORM para comunicação com o banco de dados.
- **Zod** — validação e tipagem dos dados de entrada.
- **JWT** — autenticação baseada em tokens.
- **Bcrypt** — criptografia de senhas.
- **Multer** — upload de imagens.
- **Swagger** — documentação da API.
- **Vitest** — execução dos testes.
- **Supertest** — testes de integração HTTP.
- **Docker** — ambiente de desenvolvimento.

## 📌 Funcionalidades

### Autenticação

- Cadastro de usuários.
- Login com e-mail e senha.
- Autenticação utilizando JWT.
- Consulta dos dados do usuário autenticado.
- Renovação de sessão com refresh token rotativo.
- Revogação de sessões no logout.

### Produtos

- Cadastro de produtos.
- Listagem de produtos.
- Busca de produto por ID.
- Atualização de produtos.
- Exclusão de produtos.
- Associação dos produtos ao usuário autenticado.
- Isolamento dos produtos por usuário.

### Upload de imagens

- Upload de imagens de produtos.
- Suporte aos formatos JPEG, PNG e WEBP.
- Limite de tamanho de arquivo de 5 MB.

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura em camadas, separando as responsabilidades de cada parte da aplicação.

```text
src/
├── controllers/
├── interfaces/
├── middlewares/
├── repository/
├── routes/
├── schemas/
├── services/
├── utils/
├── app.ts
└── index.ts
```

**Responsabilidades:**

- **Routes:** definição dos endpoints da API.
- **Controllers:** recebem as requisições e enviam as respostas HTTP.
- **Services:** concentram as regras de negócio e validações com Zod.
- **Repositories:** responsáveis pelo acesso e manipulação dos dados.
- **Middlewares:** autenticação, upload e tratamento de erros.
- **Schemas:** definição dos schemas de validação.
- **Utils:** funções auxiliares reutilizáveis.
- **Interfaces:** contratos e definições de tipos.

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js
- npm
- PostgreSQL ou Docker
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/klayver-martins/backend.git
```

### 2. Entre na pasta do projeto

```bash
cd backend
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="sua_url_de_conexao_postgresql"
JWT_SECRET="sua_chave_secreta"
```

### 5. Configure o banco de dados

Execute os comandos de geração do Prisma Client e de migração conforme os scripts configurados no projeto.

### 6. Inicie a aplicação

Utilize o script de desenvolvimento configurado no `package.json`.

### Fluxo de autenticação

- `POST /auth/login`: define os cookies HTTP-only `token` (access, 15 minutos) e `refresh_token` (7 dias).
- `POST /auth/refresh`: valida, revoga e substitui o refresh token; os novos tokens são enviados em cookies.
- `POST /auth/logout`: revoga o refresh token atual e limpa os dois cookies.
- O refresh token é armazenado no banco somente como hash SHA-256. Tokens de refresh antigos não podem ser reutilizados.
- Configure `URL_FRONTEND`, `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL_DAYS` e `COOKIE_SAME_SITE` no `.env`. Para sites diferentes, use `COOKIE_SAME_SITE=none` em HTTPS.

## 📖 Documentação da API

A documentação interativa da API está disponível através do Swagger:

```text
http://localhost:3000/api-docs
```

## 🧪 Testes

Foram implementados testes unitários e testes de integração utilizando **Vitest** e **Supertest**.

### Testes unitários

Verificam as regras de negócio dos Services e o comportamento dos Controllers.

- AuthService
- AuthController
- ProductService
- ProductController

### Testes de integração

Validam o funcionamento das rotas e middlewares da aplicação.

- AuthRoutes
- ProductRoutes
- Auth Middleware
- Upload Middleware

Para evitar dependência do banco de dados durante os testes, foram utilizados repositórios em memória.

## 🔐 Segurança

- Senhas armazenadas com hash utilizando Bcrypt.
- Autenticação com JWT.
- Validação dos dados de entrada com Zod.
- Proteção das rotas privadas.
- Isolamento dos produtos por usuário autenticado.

## 👨‍💻 Autor

**Klayver Martins**

- GitHub: [@klayver-martins](https://github.com/klayver-martins)
