# CLAUDE.md — Odonto SaaS Frontend

## Visao Geral

Frontend Next.js 14 (App Router) para SaaS odontologico. Interface multi-tenant com branding dinamico por clinica (cores, logo, favicon). PWA com suporte offline.

## Stack

- **Framework:** Next.js 14 (App Router, React 18)
- **Linguagem:** TypeScript (ES2020, strict mode)
- **Estilizacao:** Tailwind CSS 3 + CSS variables (tema claro/escuro)
- **Componentes:** Radix UI (primitivos) + shadcn/ui pattern
- **Estado global:** Zustand
- **Estado servidor:** TanStack React Query 5
- **Autenticacao:** NextAuth 4 (Credentials + Google OAuth)
- **HTTP:** Axios com interceptors (JWT automatico)
- **Formularios:** React Hook Form + Zod
- **Graficos:** Recharts
- **Calendario:** React Big Calendar
- **Notificacoes:** Sonner (toasts)
- **Tema:** next-themes (class-based dark mode)
- **Fonte:** Plus Jakarta Sans (Google Fonts)
- **Command Palette:** cmdk

## Estrutura de Rotas

```
app/
├── (auth)/                    # Layout sem sidebar
│   ├── login/                 # Login com 2FA flow
│   ├── login/verify-2fa/      # Verificacao 2FA
│   ├── register/              # Registro
│   ├── forgot-password/       # Esqueci senha
│   └── forgot-password/reset/ # Reset de senha
│
├── (dashboard)/               # Layout com sidebar + header
│   ├── home/                  # Dashboard principal
│   ├── appointments/          # Agendamentos (calendario)
│   ├── patients/              # Lista de pacientes
│   ├── patients/[id]/         # Ficha do paciente
│   ├── dentists/              # Dentistas
│   ├── services/              # Servicos
│   ├── conversations/         # Conversas WhatsApp
│   ├── reports/               # Relatorios
│   ├── docs/                  # Guia do usuario
│   ├── onboarding/            # Wizard de configuracao inicial
│   ├── clinics/               # Gestao de clinicas (superadmin)
│   ├── admin/users/           # Usuarios (superadmin)
│   ├── admin/plans/           # Planos (superadmin)
│   ├── admin/billing/         # Faturamento admin (superadmin)
│   └── settings/
│       ├── (index)            # Minha Conta
│       ├── clinic/            # Config. da Clinica
│       ├── whatsapp/          # Config. WhatsApp
│       ├── whatsapp/automations/ # Automacoes
│       ├── email/             # Config. SMTP
│       ├── ai/                # Assistente IA
│       ├── nps/               # Config. NPS
│       ├── billing/           # Faturamento/Assinatura
│       └── security/          # 2FA e seguranca
│
├── (portal)/
│   └── p/[token]/             # Portal do paciente (sem login)
│
├── (public)/                  # Paginas publicas (marketing)
│   ├── pricing/
│   ├── terms/
│   ├── privacy/
│   └── nps/[surveyId]/        # Pesquisa NPS publica
│
├── api/auth/[...nextauth]/    # NextAuth API route
└── offline/                   # Pagina offline (PWA)
```

## Componentes

```
components/
├── ui/                  # Base components (shadcn/ui pattern)
│   ├── button.tsx       # CVA variants: default, destructive, outline, secondary, ghost, link
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── badge.tsx
│   ├── sheet.tsx        # Mobile drawer
│   ├── dropdown-menu.tsx
│   ├── alert-dialog.tsx
│   └── calendar.tsx
├── layout/
│   ├── sidebar.tsx      # Sidebar com submenu Settings animado
│   ├── header.tsx       # Header com notificacoes e search
│   └── mobile-nav.tsx   # Nav mobile (Sheet)
├── forms/               # Formularios reutilizaveis
├── providers/
│   ├── providers.tsx    # Stack: Session > Theme > Query > Branding > Toaster
│   └── branding-provider.tsx  # Aplica cores da clinica via CSS variables
├── marketing/           # Landing page components
├── odontogram/          # Visualizacao do odontograma
├── prescriptions/       # UI de receitas/atestados
├── billing/             # Componentes de faturamento
├── notifications/       # Dropdown de notificacoes
├── ai/                  # Componentes de IA
└── command-palette/     # Cmd+K command palette (cmdk)
```

## Padroes Importantes

### Autenticacao
- NextAuth com strategy JWT
- Token JWT do backend armazenado na session NextAuth
- `api.ts` interceptor anexa `Authorization: Bearer <token>` automaticamente
- Middleware protege rotas: publicas, auth, dashboard, superadmin

### Data Fetching
- TanStack React Query para todas as chamadas API
- Pattern: `useQuery({ queryKey: [...], queryFn: async () => { const res = await api.get(...); return res.data?.data || res.data } })`
- Unwrap do `TransformInterceptor` do backend: `res.data.data`

### Branding Dinamico
- `BrandingProvider` busca dados da clinica e aplica cores via CSS variables
- Conversao hex -> HSL para compatibilidade com Tailwind
- Logo, favicon e nome da clinica sao dinamicos

### Tema
- Dark mode via `next-themes` (class-based)
- Todas as cores usam CSS variables HSL: `hsl(var(--primary))`
- Toggle no header

### Animacoes
- Keyframes custom no Tailwind: `fade-in-up`, `fade-in`, `scale-in`, `slide-in-left`
- Staggered animations com `animationDelay` inline
- Cards usam `hover:-translate-y-0.5` + `hover:shadow-card-hover`
- Sidebar submenu: transicao CSS com `max-h` + `opacity`

### Formularios
- React Hook Form + zodResolver para validacao
- Schemas definidos em `lib/validations.ts`
- Erros exibidos inline abaixo dos campos

## Hooks Customizados

```
hooks/
├── useAppointments.ts   # CRUD agendamentos via React Query
├── useClinic.ts         # Dados da clinica logada
├── useConversations.ts  # Conversas WhatsApp
├── useDentists.ts       # CRUD dentistas
├── usePatients.ts       # CRUD pacientes
├── useServices.ts       # CRUD servicos
├── useIsMobile.ts       # Deteccao mobile
└── useTwoFactor.ts      # Fluxo 2FA
```

## Lib

```
lib/
├── api.ts          # Axios instance + interceptors (JWT, mock mode)
├── auth.ts         # NextAuth config (Credentials + Google providers)
├── store.ts        # Zustand store (token, mockMode)
├── utils.ts        # cn() — Tailwind class merge
├── colors.ts       # hexToHsl() para branding dinamico
├── mock.ts         # Dados mock para modo offline
└── validations.ts  # Zod schemas (login, register, patient, appointment, etc.)
```

## Middleware

`middleware.ts` controla acesso as rotas:
- **PUBLIC_PATHS:** `/`, `/pricing`, `/terms`, `/privacy`
- **AUTH_PATHS:** `/login`, `/register`, `/forgot-password`, `/login/verify-2fa`
- **SUPERADMIN_PATHS:** `/admin`, `/clinics`
- Portal (`/p/*`) e NPS (`/nps/*`) sao sempre publicos
- Dashboard exige autenticacao
- Admin exige role `superadmin`

## Comandos

```bash
npm run dev        # Dev server (porta 3000)
npm run build      # Build de producao
npm run start      # Iniciar build de producao
npm run lint       # ESLint
```

## Variaveis de Ambiente

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001   # URL do backend
NEXTAUTH_SECRET=                            # Secret NextAuth
GOOGLE_CLIENT_ID=                           # OAuth Google (opcional)
GOOGLE_CLIENT_SECRET=                       # OAuth Google (opcional)
```

## Design System

### Fonte
Plus Jakarta Sans — geometrica com terminais arredondados, ideal para saude.

### Cores (CSS Variables)
- `--primary`: Sky blue (padrao, sobrescrito pelo branding da clinica)
- `--background`, `--foreground`: Fundo e texto principal
- `--muted`, `--accent`, `--card`: Variantes de superficie
- `--destructive`: Vermelho para acoes destrutivas
- `--success`: Verde (#10B981)
- `--warning`: Amber (#F59E0B)

### Sombras
- `shadow-sm` / `shadow-md` / `shadow-lg`: Escala de elevacao
- `shadow-card-hover`: Hover em cards (30px blur)

### Breakpoints
- Mobile-first
- `sm`: 640px, `md`: 768px, `lg`: 1024px, `xl`: 1280px
- Container max-width: 1280px

## Deploy

- **Vercel:** Configurado com `vercel.json` (rewrites)
- **Coolify:** Build Next.js standalone
- **PWA:** Service worker registrado, manifest.json, offline page
- **Security headers:** CSP, HSTS, X-Frame-Options, etc. via `next.config.mjs`
