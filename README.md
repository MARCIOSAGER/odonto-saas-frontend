# Odonto SaaS — Frontend

Interface web para plataforma SaaS de gestao de clinicas odontologicas. Dashboard completo com agendamentos, prontuario digital, odontograma, conversas WhatsApp, NPS, relatorios e painel administrativo.

## Tech Stack

| Tecnologia | Uso |
|---|---|
| Next.js 14 | Framework (App Router) |
| React 18 | UI library |
| TypeScript | Tipagem estatica |
| Tailwind CSS 3 | Estilizacao |
| Radix UI | Componentes acessiveis |
| TanStack React Query 5 | Estado do servidor |
| Zustand | Estado global |
| NextAuth 4 | Autenticacao (JWT + Google) |
| React Hook Form + Zod | Formularios e validacao |
| Recharts | Graficos |
| React Big Calendar | Calendario de agendamentos |
| cmdk | Command palette (Cmd+K) |
| Sonner | Toast notifications |
| next-themes | Dark mode |
| Axios | HTTP client |

## Pre-requisitos

- Node.js >= 20
- Backend Odonto SaaS rodando (API)

## Instalacao

```bash
# Clonar repositorio
git clone <repo-url>
cd Odonto_Saas_Frontend

# Instalar dependencias
npm install

# Configurar variaveis de ambiente
# Crie um arquivo .env.local com:
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=sua-chave-secreta

# Opcional (Google OAuth):
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret

# Iniciar em modo desenvolvimento
npm run dev
```

O app estara disponivel em `http://localhost:3000`.

## Variaveis de Ambiente

| Variavel | Descricao | Obrigatoria |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL do backend API | Sim |
| `NEXTAUTH_SECRET` | Secret para NextAuth sessions | Sim |
| `GOOGLE_CLIENT_ID` | OAuth Google | Nao |
| `GOOGLE_CLIENT_SECRET` | OAuth Google | Nao |

## Funcionalidades

### Autenticacao
- Login com email/senha
- Login com Google (OAuth)
- Autenticacao 2FA (TOTP ou WhatsApp)
- Registro de nova conta + clinica
- Recuperacao de senha via email

### Dashboard
- Metricas: pacientes, agendamentos confirmados, pendentes, receita mensal
- Grafico de fluxo semanal de pacientes
- Lista de proximos agendamentos do dia
- Alertas de trial/expiracao de assinatura

### Agendamentos
- Calendario visual (dia, semana, mes)
- Criacao manual de agendamentos
- Status flow: agendado > confirmado > concluido / cancelado
- Filtros por dentista, data e status

### Pacientes
- Listagem com busca e paginacao
- Ficha completa: dados, historico de consultas, conversas WhatsApp
- Cadastro automatico via WhatsApp (IA)
- Odontograma digital interativo

### Dentistas
- Cadastro com CRO, especialidade, comissao
- Agenda individual
- Horarios de atendimento

### Servicos
- Catalogo de procedimentos (nome, preco, duracao, categoria)
- Usado pela IA para informar precos e agendar

### Conversas WhatsApp
- Historico completo de conversas paciente/IA
- Visualizacao em formato de chat
- Filtro e busca

### Relatorios
- Receita por dentista
- Fluxo de caixa
- Comissoes
- Exportacao CSV

### Configuracoes
- **Minha Clinica:** Dados, branding (logo, cores, favicon), horario
- **WhatsApp:** Credenciais Z-API, QR Code, webhook
- **Automacoes:** Templates de mensagem, lembretes
- **E-mail:** SMTP por clinica
- **Assistente IA:** Provedor, modelo, personalidade, permissoes
- **NPS:** Pesquisas de satisfacao pos-consulta
- **Faturamento:** Assinatura, plano, historico de faturas
- **Seguranca:** 2FA (TOTP/WhatsApp), politica da clinica
- **Minha Conta:** Dados pessoais, senha

### Painel Admin (superadmin)
- Gestao de clinicas
- Gestao de usuarios
- Gestao de planos de assinatura
- Metricas de faturamento

### Outros
- **Portal do Paciente:** Acesso sem login via token unico
- **NPS publico:** Pesquisa de satisfacao acessivel por link
- **PWA:** Instalavel no celular, suporte offline
- **Command Palette:** Cmd+K para navegacao rapida
- **Dark Mode:** Toggle claro/escuro
- **Branding dinamico:** Cores e logo da clinica aplicados em tempo real

## Estrutura do Projeto

```
app/                    # Rotas (App Router)
├── (auth)/             # Login, registro, reset senha
├── (dashboard)/        # Paginas protegidas (sidebar layout)
├── (portal)/           # Portal do paciente
├── (public)/           # Landing, pricing, termos
└── api/                # NextAuth API route

components/             # Componentes React
├── ui/                 # Base components (shadcn/ui)
├── layout/             # Sidebar, header
├── forms/              # Formularios
├── providers/          # Context providers
├── marketing/          # Landing page
├── odontogram/         # Odontograma
├── prescriptions/      # Receitas
├── billing/            # Faturamento
└── ...

hooks/                  # Custom hooks (data fetching)
lib/                    # Utilitarios (api, auth, store, validations)
public/                 # Assets estaticos, PWA manifest, icons
```

## Scripts

```bash
npm run dev      # Dev server com hot-reload (porta 3000)
npm run build    # Build de producao
npm run start    # Iniciar build de producao
npm run lint     # ESLint
```

## Seguranca

- Content Security Policy (CSP)
- HSTS (1 ano)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera, microphone, geolocation desabilitados
- Middleware de protecao de rotas com verificacao de role

## Deploy

- **Vercel:** Suportado nativamente (Next.js)
- **Coolify:** Build standalone do Next.js
- **PWA:** Service worker + manifest.json incluidos

## Licenca

MIT
