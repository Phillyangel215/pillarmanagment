## Nonprofit Enterprise Management System

Buckle up, professional do-gooders and code connoisseurs. This is a high‑octane, enterprise‑grade management system for nonprofits: React + TypeScript + Vite + Tailwind, strict typing, RBAC, compliance indicators, and an offline demo mode that fakes a backend so well it should probably pay taxes. It’s fast, it’s accessible, and it won’t spill PHI on your shoes.

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

### Demo Mode (no backend, no problem)

- Set `VITE_DEMO=1` to enable a fully offline experience with localStorage and a fetch shim.
- You’ll see a Presenter Bar with demo controls, KPI widgets, and a role switcher.
- Handy globals in demo mode:
  - `window.__DEMO_RESET__()` resets all demo data and refreshes the app
  - `window.__DEMO_LATENCY__(ms, jitter?)` simulates network latency/jitter
  - `window.__DEMO_SCENARIO__('happy_path'|'empty_org'|'fire_drill'|'board_meeting'|'audit_mode')`

### Production Mode (bring your own backend)

- Don’t set `VITE_DEMO=1`.
- Required env vars in production builds: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- `src/config/validateEnv.ts` will fail builds if required env vars are missing in production.

### Live Demo

- https://phillyangel215.github.io/pillarmanagment/

Published via GitHub Pages with `VITE_DEMO=1` and `VITE_BASE=/pillarmanagment/`.

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
- Matrix: Node 18.x and 20.x
- Steps: checkout → setup‑node → `npm ci` → lint → typecheck → serverless import guard → tests → build → upload `dist` artifact (Node 20)

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

## Attribution and Security

- Attribution notices: `Attributions.md`
- Security policy and contact: `SECURITY.md`

— Written in a deliberately irreverent, candid engineering tone so you actually read it and actually ship it.