# CLAUDE.md — Odonto SaaS Frontend

## Visao Geral

Frontend Next.js 14 (App Router) para SaaS odontologico. Interface multi-tenant com branding dinamico por clinica (cores, logo, favicon). PWA com suporte offline. Internacionalizacao completa (PT-BR + EN).

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
- **i18n:** next-intl (PT-BR + EN)
- **Graficos:** Recharts
- **Calendario:** React Big Calendar
- **Notificacoes:** Sonner (toasts)
- **Tema:** next-themes (class-based dark mode)
- **Fonte:** Plus Jakarta Sans (Google Fonts)
- **Command Palette:** cmdk
- **Monitoramento:** Sentry (error tracking)

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
│   ├── docs/                  # Guia do usuario (PT/EN por locale)
│   ├── onboarding/            # Wizard de configuracao inicial
│   ├── notifications/         # Central de notificacoes
│   ├── clinics/               # Gestao de clinicas (superadmin)
│   ├── admin/
│   │   ├── users/             # Usuarios (superadmin)
│   │   ├── plans/             # Planos (superadmin)
│   │   ├── billing/           # Faturamento admin (superadmin)
│   │   ├── branding/          # Branding da plataforma (superadmin)
│   │   └── settings/          # Config. admin (superadmin)
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
│   ├── pricing/               # Tabela de precos
│   ├── terms/                 # Termos de uso (PT/EN por locale)
│   ├── privacy/               # Politica de privacidade (PT/EN por locale)
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
│   ├── card.tsx, dialog.tsx, input.tsx, select.tsx, badge.tsx
│   ├── sheet.tsx        # Mobile drawer
│   ├── dropdown-menu.tsx, alert-dialog.tsx, calendar.tsx
│   ├── checkbox.tsx, switch.tsx, table.tsx, tabs.tsx, textarea.tsx
│
├── layout/
│   ├── sidebar.tsx            # Sidebar com submenu Settings animado
│   ├── header.tsx             # Header com notificacoes e search
│   ├── mobile-nav.tsx         # Nav mobile (Sheet)
│   └── language-selector.tsx  # Seletor de idioma (PT-BR/EN)
│
├── forms/               # Formularios reutilizaveis (appointment, patient, dentist, service)
│
├── providers/
│   ├── providers.tsx          # Stack: Session > Theme > Query > Branding > Toaster
│   ├── branding-provider.tsx  # Aplica cores da clinica via CSS variables
│   └── branding-css-injector.tsx  # Injeta CSS dinamico para branding
│
├── marketing/           # Landing page (navbar, hero, features, pricing, faq, cta, footer)
├── odontogram/          # Visualizacao do odontograma (chart, viewer, surface-picker, legend)
├── prescriptions/       # UI de receitas/atestados
├── billing/             # Componentes de faturamento (invoice-table, plan-card, usage-bar)
├── notifications/       # Dropdown de notificacoes
├── ai/                  # Componentes de IA (anamnesis, clinical-notes, treatment-plan)
├── patients/            # patient-financial, patient-timeline
├── reports/             # Charts (appointments, cashflow, patients, revenue)
├── dashboard/           # weekly-flow-chart
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
- `BrandingCssInjector` injeta CSS dinamico (retorna null, sem UI)
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

## Internacionalizacao (i18n)

### Configuracao
- **Biblioteca:** next-intl 4.x
- **Locales:** `pt-BR` (padrao), `en`
- **Locale storage:** Cookie
- **Arquivos de traducao:** `messages/pt-BR.json`, `messages/en.json`

### Namespaces de traducao
| Namespace | Descricao | Usado em |
|---|---|---|
| `common` | Botoes, labels genericos | Todo o app |
| `nav` | Menu de navegacao | Sidebar, command-palette |
| `auth` | Login, registro, 2FA | Paginas de auth |
| `appointments` | Agendamentos | Dashboard |
| `patients` | Pacientes | CRUD pacientes |
| `dentists` | Dentistas | CRUD dentistas |
| `settings` | Configuracoes | Paginas de settings |
| `admin` | Painel admin | Paginas superadmin |
| `commandPalette` | Command palette | command-palette.tsx |
| `marketing` | Landing page (navbar, hero, features, cta, footer) | Componentes marketing |
| `pricing` | Tabela de precos | pricing-table.tsx |
| `faq` | Perguntas frequentes | faq.tsx |

### Pattern de uso
```tsx
"use client"
import { useTranslations } from "next-intl"

export function MyComponent() {
  const t = useTranslations("namespace")
  return <h1>{t("key")}</h1>
}
```

### Paginas com versao por locale
Paginas grandes (docs, terms, privacy) usam componentes separados por idioma:
```
docs/
├── page.tsx          # Wrapper que detecta locale e renderiza PT ou EN
├── docs-pt.tsx       # Conteudo completo em portugues
└── docs-en.tsx       # Conteudo completo em ingles
```

## Hooks Customizados

```
hooks/
├── useAppointments.ts      # CRUD agendamentos via React Query
├── useClinic.ts            # Dados da clinica logada
├── useConversations.ts     # Conversas WhatsApp
├── useDentists.ts          # CRUD dentistas
├── usePatients.ts          # CRUD pacientes
├── useServices.ts          # CRUD servicos
├── useIsMobile.ts          # Deteccao mobile (< 768px)
├── useTwoFactor.ts         # Fluxo 2FA
├── useOdontogram.ts        # Odontograma (visualizacao/edicao)
├── usePermissions.ts       # Verificacao de roles/permissoes
└── usePlatformBranding.ts  # Branding da plataforma (cores, logo)
```

## Lib

```
lib/
├── api.ts          # Axios instance + interceptors (JWT automatico)
├── auth.ts         # NextAuth config (Credentials + Google providers)
├── env.ts          # Variaveis de ambiente tipadas (env + serverEnv)
├── store.ts        # Zustand store (mockMode)
├── utils.ts        # cn() — Tailwind class merge
├── colors.ts       # hexToHsl() para branding dinamico
├── i18n.ts         # Configuracao next-intl
├── mock.ts         # Dados mock para modo offline
└── validations.ts  # Zod schemas (login, register, patient, appointment, etc.)
```

### lib/env.ts
Variaveis de ambiente tipadas — importar `env` ou `serverEnv` ao inves de acessar `process.env` diretamente:
```ts
import { env } from "@/lib/env"         // Client-side (NEXT_PUBLIC_*)
import { serverEnv } from "@/lib/env"   // Server-side only
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
npm run test:e2e   # Playwright E2E tests
```

## Variaveis de Ambiente

```bash
# Client-side (expostas ao browser)
NEXT_PUBLIC_API_URL=http://localhost:3001   # URL do backend
NEXT_PUBLIC_SITE_URL=https://odontosaas.com.br  # URL do site (SEO, sitemap)
NEXT_PUBLIC_SENTRY_DSN=                    # Sentry DSN (opcional)
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development # Sentry environment

# Server-side only
NEXTAUTH_SECRET=                           # Secret NextAuth
NEXTAUTH_URL=                              # URL do NextAuth
GOOGLE_CLIENT_ID=                          # OAuth Google (opcional)
GOOGLE_CLIENT_SECRET=                      # OAuth Google (opcional)
SENTRY_AUTH_TOKEN=                         # Sentry auth token (build)
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

## SEO

- `app/robots.ts` — Configura robots.txt (permite `/`, bloqueia rotas privadas)
- `app/sitemap.ts` — Gera sitemap.xml com paginas publicas
- `app/layout.tsx` — Metadata (OpenGraph, Twitter Card, keywords)
- Security headers configurados em `next.config.mjs`

## Deploy

### Infraestrutura
- **Hospedagem:** Coolify (VPS)
- **PWA:** Service worker registrado, manifest.json, offline page
- **Security headers:** CSP, HSTS, X-Frame-Options, etc. via `next.config.mjs`

### Workflow de deploy

O deploy e automatico via **webhook do Coolify**. Basta fazer push para `main`:

1. **Commit** — `git add <arquivos> && git commit -m "mensagem"`
2. **Push** — `git push origin main`
3. **Deploy** — Automatico! O webhook do GitHub notifica o Coolify, que inicia o build e deploy.

> **Nota:** O webhook esta configurado no GitHub (Settings > Webhooks) apontando para o Coolify. Nao e necessario disparar manualmente.

### Deploy manual (fallback)

Se precisar disparar deploy manual sem push, use a API do Coolify com o token salvo em `.coolify-token` (arquivo gitignored):

```bash
TOKEN=$(cat .coolify-token)
curl -s -X POST "https://coolify.marciosager.com/api/v1/deploy" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"uuid":"tc08w80kccws48osw48woswo","force":false}'
```
