# PI Services API

Uma API robusta, escalável e bem documentada para gerenciar múltiplos serviços empresariais, incluindo autenticação, gestão de produtos, pedidos, empresas, notificações e upload de arquivos.

## Tabela de Conteúdos

- [Visão Geral](#visão-geral)
- [Componentes e Funcionalidades](#componentes-e-funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Autenticação](#autenticação)
- [Upload de Arquivos](#upload-de-arquivos)
- [Notificações](#notificações)
- [Boas Práticas](#boas-práticas)
- [Troubleshooting](#troubleshooting)

## Visão Geral

Esta é uma API de serviços robusta desenvolvida para gerenciar diversas funcionalidades empresariais essenciais com autenticação segura, controle de acesso baseado em roles (Admin), tratamento de erros consistente e documentação interativa.

### Principais Características

-  **Autenticação JWT** - Segurança com tokens JWT e refresh tokens
-  **Controle de Acesso** - Middleware Admin para rotas protegidas
-  **Gerenciamento de Empresas** - CRUD completo com validações
-  **Catálogo de Produtos** - Produtos associados a empresas
-  **Sistema de Pedidos** - Rastreamento completo de pedidos
-  **Upload de Arquivos** - Com validação de documento
-  **Notificações por Email** - Sistema integrado com Nodemailer
-  **API Documentada** - Swagger UI para exploração interativa
-  **ORM Moderno** - Prisma e Mongoose para flexibilidade

##  Componentes e Funcionalidades

### Módulos Principais

| Módulo | Descrição | Endpoints |
|--------|-----------|-----------|
| **Autenticação** | Registro, login, logout e gerenciamento de sessões | `/api/auth/*` |
| **Usuários** | CRUD de usuários, perfis e controle de acesso | `/api/users/*` |
| **Empresas** | Gerenciamento de empresas e informações | `/api/companies/*` |
| **Produtos** | Catálogo de produtos com categorização | `/api/products/*` |
| **Pedidos** | Criação e rastreamento de pedidos | `/api/orders/*` |
| **Classificadores** | Categorias e classificações de dados | `/api/classifiers/*` |
| **Arquivos** | Upload com validação de documentos | `/api/files/*` |
| **Notificações** | Sistema de notificações por email | `/api/notifications/*` |

### Funcionalidades de Segurança

-  **Autenticação JWT** - Tokens com expiração configurável
-  **Hash de Senhas** - Bcryptjs com salt automático
-  **Lista Negra de Tokens** - Revogação de tokens em logout
-  **Middleware de Autenticação** - Proteção de rotas
-  **Verificação de Admin** - Controle de acesso granular
-  **Validação de Documentos** - Documentador customizado
-  **CORS Configurado** - Requisições cross-origin seguras

##  Tecnologias Utilizadas

### Runtime & Framework
- **Node.js** `v18.0.0+` - Plataforma de execução JavaScript
- **Express.js** `v5.2.1` - Framework web minimalista e performático

### Banco de Dados & Persistência
- **MongoDB** `v7.0.0` - Banco de dados NoSQL escalável
- **Mongoose** `v9.1.3` - ODM com validação de schema
- **Prisma** `v6.19.2` - ORM de próxima geração com geração automática de cliente

### Segurança & Autenticação
- **jsonwebtoken** `v9.0.3` - Implementação de JWT
- **bcryptjs** `v3.0.3` - Hash seguro de senhas
- **cors** `v2.8.5` - Middleware CORS

### Upload & Middleware
- **multer** `v2.0.2` - Parser de formulários multipart
- **busboy** `v1.6.0` - Parser de stream para upload

### Notificações
- **nodemailer** `v7.0.12` - Envio de emails SMTP

### Documentação & Validação
- **swagger-jsdoc** `v6.2.8` - Geração de OpenAPI/Swagger
- **swagger-ui-express** `v5.0.1` - Interface gráfica Swagger
- **swagger-parser** `v10.0.3` - Parser de especificações OpenAPI
- **z-schema** `v5.0.5` - Validação de JSON Schema

### Utilitários
- **dotenv** `v17.2.3` - Carregamento de variáveis de ambiente

### Desenvolvimento
- **nodemon** `v3.1.11` - Auto-reload durante desenvolvimento

##  Pré-requisitos

Antes de começar, certifique-se de ter:

```
✓ Node.js 18.0.0 ou superior
✓ npm (v9+) ou yarn (v1.22+)
✓ MongoDB (local ou instância remota)
✓ Editor de código (VS Code recomendado)
✓ Git para versionamento
```

**Verificar versões instaladas:**
```bash
node --version        # v18.0.0 ou superior
npm --version         # v9.0.0 ou superior
mongodb --version     # v7.0.0 ou superior
```

## Instalação

### Passo 1: Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd API-Sample-Model
```

### Passo 2: Instale as dependências

```bash
# Usando npm
npm install

# Ou usando yarn
yarn install
```

### Passo 3: Configurar o Banco de Dados

Certifique-se de que MongoDB está em execução:

```bash
# Se usar MongoDB localmente (Linux/Mac)
mongod

# Se usar MongoDB Atlas (cloud), você já tem a URL de conexão
```

### Passo 4: Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Copiar do exemplo (se existir)
cp .env.example .env
```

Ou crie manualmente com as variáveis necessárias (veja seção [Configuração](#configuração))

### Passo 5: Sincronizar schema do Prisma

```bash
# Sincroniza o schema com o banco de dados e gera o cliente
npm run prisma:push

# Ou com yarn
yarn prisma:push
```

Pronto! A aplicação está configurada.

##  Configuração

### Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# ========== Ambiente ==========
NODE_ENV=development
PORT=3000

# ========== Banco de Dados ==========
# Para MongoDB local
DATABASE_URL="mongodb://localhost:27017/pi-services"

# Para MongoDB Atlas (cloud)
# DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/pi-services?retryWrites=true&w=majority"

# ========== JWT (Segurança) ==========
JWT_SECRET="sua_chave_secreta_muito_segura_aqui_minimo_32_caracteres"
JWT_EXPIRES_IN="7d"

# ========== Email (Notificações) ==========
SMTP_USER="seu_email@gmail.com"
SMTP_PASSWORD="sua_senha_de_app_gmailail"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587

# ========== API (Api de Classificação) ==========
```

### Variáveis Importantes

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente (development/production) | `development` |
| `PORT` | Porta do servidor | `3000` |
| `DATABASE_URL` | URL de conexão MongoDB | `mongodb://localhost:27017/db` |
| `JWT_SECRET` | Chave secreta para JWT | Qualquer hash seguro |
| `JWT_EXPIRES_IN` | Duração do token JWT | `7d`, `24h`, `1w` |
| `SMTP_USER` | Email para envio | `seu_email@gmail.com` |
| `SMTP_PASSWORD` | Senha de app (não senha normal) | Senha de app Gmail |

### Configuração do Email (Gmail)

Para usar Nodemailer com Gmail:

1. Ative autenticação de dois fatores na sua conta Google
2. Gere uma [senha de app](https://myaccount.google.com/apppasswords)
3. Use essa senha em `SMTP_PASSWORD` no `.env`

## Scripts Disponíveis

```bash
# ========== Desenvolvimento ==========
npm run dev          # Inicia em modo desenvolvimento com reload automático
npm start            # Inicia em modo produção
npm run start:prod   # Inicia com NODE_ENV=production

# ========== Banco de Dados ==========
npm run prisma:push  # Sincroniza schema e gera cliente Prisma
npm run prisma:migrate  # Cria nova migração (se configurado)

# ========== Testes (quando implementado) ==========
npm test             # Executa suite de testes
```

### Exemplo de Uso

```bash
# Desenvolvimento local
npm run dev
# Saída: Server running on http://localhost:3000

# Logs do Swagger
# API Docs disponível em: http://localhost:3000/api-docs
```

## 📂 Estrutura do Projeto

```
API-Sample-Model/
├── doc/                              # Documentação
│   └── P-I-5-Semestre.postman_collection.json
├── prisma/                           # ORM Prisma
│   └── schema.prisma                 # Schema de dados
├── src/
│   ├── app.js                        # Configuração da aplicação
│   ├── server.js                     # Entry point do servidor
│   ├── config/                       # Configurações
│   │   ├── db.js                     # Conexão com MongoDB
│   │   ├── swagger.js                # Configuração Swagger
│   │   └── upload.js                 # Configuração Multer
│   ├── controllers/                  # Controllers (lógica de rotas)
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── companies.controller.js
│   │   ├── products.controller.js
│   │   ├── orders.controller.js
│   │   ├── classifier.controller.js
│   │   ├── files.controller.js
│   │   └── notifications.controller.js
│   ├── middleware/                   # Middlewares customizados
│   │   ├── auth.js                   # Verificação de JWT
│   │   ├── Admin.js                  # Verificação de permissão Admin
│   │   └── checkBlacklist.js         # Verificação de token revogado
│   ├── models/                       # Modelos (schema Mongoose)
│   │   └── [modelos do banco]
│   ├── routes/                       # Definição de rotas
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── companies.routes.js
│   │   ├── products.routes.js
│   │   ├── orders.routes.js
│   │   ├── classifier.routes.js
│   │   ├── files.routes.js
│   │   ├── notifications.routes.js
│   │   └── index.js                  # Agrupador de rotas
│   ├── services/                     # Serviços (lógica de negócio)
│   │   ├── auth.service.js
│   │   ├── users.service.js
│   │   ├── companies.service.js
│   │   ├── products.service.js
│   │   ├── orders.service.js
│   │   ├── classifier.service.js
│   │   ├── files.service.js
│   │   └── notification.service.js
│   └── utils/                        # Utilitários
│       └── documentValidator.js      # Validação de documentos
├── uploads/                          # Diretório de uploads
│   ├── files/
│   └── temp/
├── .env                              # Variáveis de ambiente (não commitado)
├── .gitignore                        # Arquivos ignorados no Git
├── package.json                      # Dependências e scripts
├── package-lock.json                 # Lock de dependências
└── README.md                         # Esta documentação
```

## Documentação da API

### Acessar a Documentação Interativa

Após iniciar a API com `npm run dev`, acesse a documentação Swagger em:

```
http://localhost:3000/api-docs
```

A interface Swagger permite:
- ✓ Visualizar todos os endpoints
- ✓ Testar requisições diretamente
- ✓ Ver exemplos de request/response
- ✓ Verificar códigos de status HTTP
- ✓ Explorar parâmetros e validações

### Coleção Postman

Uma coleção Postman é fornecida em:
```
doc/P-I-5-Semestre.postman_collection.json
```

Para importar:
1. Abra a aplicação Postman
2. Clique em "Import"
3. Selecione o arquivo JSON
4. Configure a variável `baseUrl` para seu host local

## Autenticação

### Flow de Autenticação

```
1. Usuário faz POST /api/auth/register com email e senha
2. Sistema hash a senha com Bcrypt
3. Usuário recebe confirmação
4. Usuário faz POST /api/auth/login
5. Sistema verifica credenciais e gera JWT
6. Cliente armazena token (localStorage ou cookie)
7. Cliente envia token em Authorization header para rotas protegidas
8. Middleware valida o token antes de processar a requisição
```

### Usar Token JWT

Todas as rotas protegidas requerem o header:

```http
Authorization: Bearer <seu_token_jwt_aqui>
```

**Exemplo com curl:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/api/users/profile
```

**Exemplo com JavaScript (fetch):**
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3000/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Rotas de Autenticação

```
POST   /api/auth/register    - Registrar novo usuário
POST   /api/auth/login       - Login (retorna JWT)
POST   /api/auth/logout      - Logout (invalida token)
POST   /api/auth/refresh     - Renovar token expirado (se implementado)
```

## Upload de Arquivos

### Configuração

Upload de arquivos é gerenciado pelo Multer com validação customizada:

```javascript
// Diretório padrão: ./uploads
// Tamanho máximo: 5MB (configurável em .env)
```

### Upload de Arquivo

```bash
curl -X POST \
  -F "file=@seu_arquivo.pdf" \
  -H "Authorization: Bearer seu_token" \
  http://localhost:3000/api/files/upload
```

### Validação de Documento

O arquivo `src/utils/documentValidator.js` valida:
- ✓ Tipo de arquivo (extensão permitida)
- ✓ Tamanho do arquivo
- ✓ Conteúdo do arquivo

### Diretórios de Upload

```
uploads/
├── files/        # Arquivos permanentes
└── temp/         # Arquivos temporários (limpeza automática)
```

## Notificações

### Configuração de Email

A API usa Nodemailer para envio de emails. Configure em `.env`:

```env
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_de_app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=noreply@piservices.com
```

### Enviar Notificação

```bash
POST /api/notifications/send
Content-Type: application/json
Authorization: Bearer token

{
  "to": "usuario@example.com",
  "subject": "Assunto do email",
  "body": "Conteúdo do email"
}
```

### Templates de Email

Implementar templates de email em `src/services/notification.service.js` para:
- Bem-vindo (signup)
- Confirmação de pedido
- Recuperação de senha
- Notificações gerais

##  Boas Práticas

### Segurança

- ✓ Nunca commitar `.env` com dados sensíveis
- ✓ Usar HTTPS em produção
- ✓ Validar todas as entradas de usuário
- ✓ Implementar rate limiting para login
- ✓ Usar CORS restritivo em produção
- ✓ Hash de senhas com Bcrypt (nunca plaintext)

### Performance

- ✓ Usar índices no MongoDB para queries frequentes
- ✓ Cache de dados com Redis (opcional)
- ✓ Paginação para listagens grandes
- ✓ Lazy loading de relacionamentos
- ✓ Compressão de resposta (gzip)

### Código

- ✓ Separar lógica (controllers → services)
- ✓ Validar dados de entrada
- ✓ Tratamento consistente de erros
- ✓ Comentários em lógica complexa
- ✓ Use async/await em vez de callbacks
- ✓ Nomes significativos para variáveis

### Testes

```bash
# Quando tests forem implementados
npm test

# Cobertura de testes
npm run test:coverage
```

##  Troubleshooting

### Banco de Dados

**Erro: "connect ECONNREFUSED 127.0.0.1:27017"**
```bash
# MongoDB não está rodando
# Inicie MongoDB:
mongod

# Ou verifique a URL de conexão em .env
```

### JWT

**Erro: "jwt malformed"**
- Verifique se o token é enviado corretamente no header
- Confirme que JWT_SECRET está configurado
- Token pode ter expirado - faça login novamente

### Upload de Arquivos

**Erro: "413 Payload Too Large"**
- Arquivo maior que o limite configurado (5MB padrão)
- Aumente `MAX_FILE_SIZE` em `.env` se necessário

### Variáveis de Ambiente

**Erro: "undefined is not a function"**
- Verifique se todas as variáveis de `.env` estão definidas
- Reinicie o servidor após alterar `.env`
- Use `console.log(process.env)` para debug

## Suporte

Para problemas ou dúvidas:

1. Verifique os logs do console
2. Consulte a documentação Swagger em `/api-docs`
3. Verifique a coleção Postman em `doc/`
4. Abra uma issue no repositório

## Licença

ISC

## Contribuições

Contribuições são bem-vindas! Siga o padrão de código existente e adicione testes.

```bash
# Criar feature branch
git checkout -b feature/sua-funcionalidade

# Commit com mensagens descritivas
git commit -m "feat: sua funcionalidade"

# Push e abra Pull Request
git push origin feature/sua-funcionalidade
```

---

**Última atualização:** Março de 2025  
**Versão:** 1.0.0  
**Status:** Produção
