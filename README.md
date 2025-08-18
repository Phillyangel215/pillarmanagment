## Nonprofit Enterprise Management System

Enterprise-grade nonprofit management system built with Vite, React, TypeScript, and Tailwind. Strict typing, RBAC, compliance indicators, and an offline demo mode.

### TL;DR (Run it)

```bash
# Node 18/20 LTS recommended
npm ci

# Local dev (with hot reload)
npm run dev

# Typecheck, lint, test, build
npm run typecheck && npm run lint && npm run test && npm run build

# Preview the production build
npm run preview
```

### Demo Mode (no backend)

- Set `VITE_DEMO=1` for an offline experience with seeded data and a Presenter Bar.

### Production Mode

- Do not set `VITE_DEMO=1`.
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## Project Structure

```text
src/
├─ app/                      # App shell & demo gallery
│  ├─ App.tsx                # Error boundary + gallery
│  └─ DemoGallery.tsx        # Screen switcher + PresenterBar + KPIs
├─ components/
│  ├─ common/                # ErrorBoundary, RoleSwitcher, CreateUserButton, Logo
│  ├─ demo/                  # PresenterBar, DemoDashboardRow, StatCard
│  └─ ui/                    # UI building blocks (project-specific)
├─ auth/                     # RBAC model & helpers (see auth/rbac.ts)
├─ config/                   # validateEnv and app config
├─ demo/                     # fetch shim, seed, scenarios, deterministic PRNG
├─ services/                 # API calls (demo shim intercepts /api/*)
├─ styles/                   # Tailwind/global tokens
├─ assets/                   # Static assets
├─ main.tsx                  # Bootstrap (installs demo if enabled)
└─ vite-env.d.ts             # Vite types
```

## Tech Stack (and why)

- React 18 + TypeScript strict: predictable UI with compile‑time safety
- Vite 6: blazing dev server and lean production builds
- Tailwind CSS 4 (beta): design tokens via CSS vars; AA accessibility defaults
- Vitest + Testing Library: fast unit/integration tests
- GitHub Actions CI: Node 18/20 matrix, typecheck, lint, test, build, artifacts

## Security, Compliance, Accessibility

- RBAC with explicit scopes and actions. See `src/auth/rbac.ts` for roles such as `SUPER_ADMIN`, `CEO`, `PROGRAM_DIRECTOR`, `HR_MANAGER`, `DEVELOPMENT_DIRECTOR`, `CASE_WORKER`, etc.
- HIPAA‑oriented UI indicators (amber accents) for sensitive areas; see `styles/globals.css` design tokens.
- Error isolation via `ErrorBoundary` with production‑safe messaging.
- Strict typing, zero‑`any` policy, ESLint security plugin, and a11y linting.
- Demo mode never touches real PHI. In production, configure Row Level Security on your backend (e.g., Supabase) and audit logging.

## Data and Services

- All service calls are located in `src/services/*` (e.g., `/api/summary/*`, `/api/accounts`).
- In demo mode, a fetch shim intercepts these routes and serves seeded data with optional latency and scenarios. See `src/demo/*` and `src/demo/fetchShim.ts`.

## Developer Workflow

- Type safety first: `npm run typecheck`
- Keep the lights green: `npm run lint` and `npm run test`
- CI mirrors your local flow and fails fast on violations.
- Import alias `@` maps to `src/` (configured in `vite.config.ts`).

### Scripts

- `dev`: start the Vite dev server on port 3000
- `build`: `tsc -b` then Vite build (sourcemaps on, modern targets)
- `typecheck`: strict TS checks, no emit
- `lint`: ESLint with security and a11y rules, max warnings 0
- `test`: Vitest test runner
- `preview`: serve the production build locally

## CI/CD

- Workflow: `.github/workflows/ci.yml`
- Steps: checkout → setup‑node → `npm ci` → lint → typecheck → serverless import guard → tests → build → upload `dist` artifact

## Design System (Highlights)

- WCAG AA defaults; typography base 16px; 44px minimum touch targets
- Color system with explicit tokens for primary, error, success, and HIPAA indicators
- Spacing system based on a 4px grid; consistent radii and transitions
- See `styles/globals.css` and `guidelines/Guidelines.md` for the full specification

## Deployment

- Static SPA build output: `dist/`
- Supported hosts: Vercel, Netlify, Cloudflare Pages, GitHub Pages, Nginx
- Full instructions in `DEPLOYMENT.md` (including DNS/custom domain notes)

## Status and Roadmap

- Current status: `guidelines/STATUS.md`
- Detailed milestones and acceptance criteria: `MILESTONES.md`

## Contributing

- PRs welcome. Use the template in `.github/PULL_REQUEST_TEMPLATE.md`.
- Keep CI green and adhere to `guidelines/Guidelines.md` before requesting review.

Built with ❤️ for nonprofit organizations.

## Environments & Flags

Create a `.env` from `.env.example`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SENTRY_DSN=            # optional; if set, beacons enabled
VITE_DEMO=0                 # set 1 for demo mode
```

`VITE_BUILD_SHA` is injected by CI; defaults to `dev` locally.

## Release checklist

- Lint, typecheck, build, and tests are green
- Env vars configured
- CI produces `dist/` artifact

## Security notes

- Provisioning requires `SUPER_ADMIN` in JWT roles
- RLS enforced in the database
