# 🍕 Pizza Shop API

Uma API completa para gerenciamento de restaurantes e pedidos, construída com tecnologias modernas e de alta performance.

## 📋 Sobre o Projeto

Pizza Shop é uma API REST desenvolvida para gerenciar operações de restaurantes, incluindo autenticação, gestão de pedidos e dashboards analíticos. O sistema implementa autenticação via magic link e controle de acesso baseado em roles (manager/customer).

O front-end do projeto está disponível [clicando aqui.](https://github.com/patrick-cuppi/pizza-shop-frontend)

## 🚀 Tecnologias Utilizadas

### Core
- **[Bun](https://bun.sh/)** - Runtime JavaScript ultra-rápido
- **[ElysiaJS](https://elysiajs.com/)** - Framework web minimalista e performático
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática

### Database & ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM type-safe
- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Migrations e schema management

### Autenticação & Segurança
- **[@elysiajs/jwt](https://elysiajs.com/plugins/jwt.html)** - JSON Web Tokens
- **[@elysiajs/cookie](https://elysiajs.com/plugins/cookie.html)** - Gestão de cookies
- **[@elysiajs/cors](https://elysiajs.com/plugins/cors.html)** - Cross-Origin Resource Sharing

### Email & Comunicação
- **[Resend](https://resend.com/)** - Serviço de envio de emails
- **[React Email](https://react.email/)** - Templates de email em React

### Utilitários
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[Day.js](https://day.js.org/)** - Manipulação de datas
- **[cuid2](https://github.com/paralleldrive/cuid2)** - Geração de IDs únicos

## 📊 Arquitetura do Sistema

```mermaid
graph TB
    subgraph Client["Cliente"]
        FE[Frontend Application]
    end

    subgraph API["API Layer - ElysiaJS"]
        AUTH[Authentication Middleware]
        ROUTES[Route Handlers]
    end

    subgraph Business["Business Logic"]
        MANAGER[Manager Routes]
        CUSTOMER[Customer Routes]
        ANALYTICS[Analytics Routes]
    end

    subgraph Data["Data Layer"]
        DRIZZLE[Drizzle ORM]
        DB[(PostgreSQL Database)]
    end

    subgraph External["Serviços Externos"]
        EMAIL[Resend Email Service]
    end

    FE -->|HTTP/HTTPS| AUTH
    AUTH -->|JWT Validation| ROUTES
    ROUTES --> MANAGER
    ROUTES --> CUSTOMER
    ROUTES --> ANALYTICS
    
    MANAGER --> DRIZZLE
    CUSTOMER --> DRIZZLE
    ANALYTICS --> DRIZZLE
    
    DRIZZLE --> DB
    
    ROUTES -->|Magic Link| EMAIL
    
    style API fill:#e1f5ff
    style Business fill:#fff4e1
    style Data fill:#e8f5e9
    style External fill:#fce4ec
```

## 📁 Estrutura do Projeto

```
pizzashop/
├── src/
│   ├── db/
│   │   ├── schema/          # Definições de tabelas
│   │   ├── connection.ts    # Conexão com o banco
│   │   ├── migrate.ts       # Executar migrations
│   │   └── seed.ts          # Popular banco com dados
│   ├── http/
│   │   ├── routes/          # Rotas da API
│   │   ├── authentication.ts # Plugin de autenticação
│   │   └── server.ts        # Configuração do servidor
│   ├── lib/                 # Utilitários
│   ├── mail/                # Templates de email
│   └── env.ts               # Variáveis de ambiente
├── drizzle/
│   └── migrations/          # Histórico de migrations
├── docker-compose.yml       # Configuração do PostgreSQL
└── drizzle.config.ts        # Configuração do Drizzle
```

## 🔐 Autenticação

O sistema utiliza autenticação via **Magic Link**:
1. Usuário solicita link de autenticação via email
2. Sistema envia email com token JWT único
3. Usuário clica no link e é autenticado automaticamente
4. Token armazenado em cookie HTTP-only

## 📍 Rotas da API

### 🔓 Públicas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/restaurants` | Cadastrar novo restaurante e gerente |
| `POST` | `/customers` | Cadastrar novo cliente |
| `POST` | `/authenticate` | Solicitar magic link de autenticação |
| `GET` | `/auth-links/authenticate` | Validar magic link e autenticar |

### 👤 Perfil & Autenticação

| Método | Endpoint | Descrição | Requer Auth |
|--------|----------|-----------|-------------|
| `GET` | `/me` | Obter dados do usuário logado | ✅ |
| `POST` | `/sign-out` | Fazer logout | ✅ |
| `PUT` | `/profile` | Atualizar perfil do usuário | ✅ |

### 🏪 Restaurante (Manager)

| Método | Endpoint | Descrição | Requer Auth |
|--------|----------|-----------|-------------|
| `GET` | `/managed-restaurant` | Obter restaurante gerenciado | ✅ Manager |
| `PUT` | `/restaurants/:restaurantId/menu` | Atualizar cardápio | ✅ Manager |

### 📦 Pedidos

| Método | Endpoint | Descrição | Requer Auth |
|--------|----------|-----------|-------------|
| `POST` | `/restaurants/:restaurantId/orders` | Criar novo pedido | ✅ Customer |
| `GET` | `/orders` | Listar pedidos (com filtros) | ✅ Manager |
| `GET` | `/orders/:orderId` | Detalhes de um pedido | ✅ |
| `PATCH` | `/orders/:orderId/approve` | Aprovar pedido | ✅ Manager |
| `PATCH` | `/orders/:orderId/cancel` | Cancelar pedido | ✅ |
| `PATCH` | `/orders/:orderId/dispatch` | Marcar pedido como em entrega | ✅ Manager |
| `PATCH` | `/orders/:orderId/deliver` | Marcar pedido como entregue | ✅ Manager |

### ⭐ Avaliações

| Método | Endpoint | Descrição | Requer Auth |
|--------|----------|-----------|-------------|
| `POST` | `/orders/:orderId/evaluate` | Criar avaliação de pedido | ✅ Customer |
| `GET` | `/restaurants/:restaurantId/evaluations` | Listar avaliações do restaurante | ✅ |

### 📊 Métricas & Analytics (Manager)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/metrics/month-receipt` | Receita total do mês |
| `GET` | `/metrics/month-orders-amount` | Quantidade de pedidos do mês |
| `GET` | `/metrics/day-orders-amount` | Quantidade de pedidos do dia |
| `GET` | `/metrics/month-canceled-orders-amount` | Pedidos cancelados no mês |
| `GET` | `/metrics/daily-receipt-in-period` | Receita diária em período específico |
| `GET` | `/metrics/popular-products` | Produtos mais vendidos |

## 🔄 Fluxo de Pedidos

```mermaid
stateDiagram-v2
    [*] --> pending: Cliente cria pedido
    
    pending --> processing: Manager aprova
    pending --> canceled: Cliente/Manager cancela
    
    processing --> delivering: Manager despacha
    processing --> canceled: Manager cancela
    
    delivering --> delivered: Manager confirma entrega
    
    delivered --> [*]
    canceled --> [*]
    
    note right of pending
        Aguardando confirmação
        do restaurante
    end note
    
    note right of processing
        Pedido sendo
        preparado
    end note
    
    note right of delivering
        Pedido saiu para
        entrega
    end note
```

## 🗄️ Modelo de Dados

```mermaid
erDiagram
    USERS ||--o{ RESTAURANTS : manages
    USERS ||--o{ ORDERS : places
    USERS ||--o{ AUTH_LINKS : has
    
    RESTAURANTS ||--o{ ORDERS : receives
    RESTAURANTS ||--o{ PRODUCTS : offers
    RESTAURANTS ||--o{ EVALUATIONS : receives
    
    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDERS ||--o| EVALUATIONS : has
    
    PRODUCTS ||--o{ ORDER_ITEMS : "part of"
    
    USERS {
        string id PK
        string name
        string email UK
        string phone
        enum role
        timestamp createdAt
    }
    
    RESTAURANTS {
        string id PK
        string name
        string description
        string managerId FK
        timestamp createdAt
    }
    
    ORDERS {
        string id PK
        string customerId FK
        string restaurantId FK
        enum status
        int totalInCents
        timestamp createdAt
    }
    
    ORDER_ITEMS {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        int unitPriceInCents
        int subtotalInCents
    }
    
    PRODUCTS {
        string id PK
        string name
        string description
        int priceInCents
        string restaurantId FK
    }
    
    EVALUATIONS {
        string id PK
        string orderId FK
        string restaurantId FK
        int rating
        string comment
        timestamp createdAt
    }
    
    AUTH_LINKS {
        string id PK
        string code UK
        string userId FK
        timestamp createdAt
    }
```

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- [Bun](https://bun.sh/) >= 1.0.14
- [Docker](https://www.docker.com/) e Docker Compose
- Conta no [Resend](https://resend.com/) para envio de emails

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# API Configuration
API_BASE_URL=http://localhost:3333
AUTH_REDIRECT_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://docker:docker@localhost:5432/pizzashop

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Email Service
RESEND_API_KEY=re_your_resend_api_key_here
```

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/patrick-cuppi/pizza-shop-backend
cd pizzashop
```

2. **Instale as dependências**
```bash
bun install
```

3. **Inicie o banco de dados**
```bash
docker-compose up -d
```

4. **Execute as migrations**
```bash
bun run migrate
```

5. **Popule o banco com dados de teste (opcional)**
```bash
bun run seed
```

6. **Inicie o servidor**
```bash
bun run dev
```

O servidor estará rodando em `http://localhost:3333` 🚀

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento com hot-reload
bun run dev

# Gerar novas migrations
bun run generate

# Executar migrations
bun run migrate

# Popular banco com dados de teste
bun run seed
```

## 🧪 Testando a API

### Exemplo: Criar um restaurante

```bash
curl -X POST http://localhost:3333/restaurants 
  -H "Content-Type: application/json" 
  -d '{
    "restaurantName": "Pizza Express",
    "managerName": "John Doe",
    "email": "john_doe@pizzaexpress.com",
    "phone": "11999999999"
  }'
```

### Exemplo: Solicitar autenticação

```bash
curl -X POST http://localhost:3333/authenticate 
  -H "Content-Type: application/json" 
  -d '{
    "email": "john_doe@pizzaexpress.com"
  }'
```

## 🔒 Segurança

- ✅ Autenticação via JWT armazenado em HTTP-only cookies
- ✅ Validação de schemas com Zod e TypeBox
- ✅ CORS configurado com whitelist de origens
- ✅ Controle de acesso baseado em roles (Manager/Customer)
- ✅ Magic links com expiração automática
- ✅ Proteção contra SQL Injection via Drizzle ORM

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](https://github.com/patrick-cuppi/pizza-shop-backend/blob/main/LICENSE).

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
