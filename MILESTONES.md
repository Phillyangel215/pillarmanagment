## Milestones and Acceptance Criteria

This roadmap is operator‑friendly, auditor‑pleasing, and engineer‑approved. Dates are placeholders; size your sprints as you see fit. All milestones inherit global quality gates: TypeScript strict, ESLint zero warnings, unit tests for logic, a11y checks for UI, and CI green on Node 18/20.

### M0 — Foundation (Complete)

- Vite + React + TypeScript strict with `@` alias
- Tailwind 4 design system tokens and global CSS baselines
- ErrorBoundary with production‑safe messaging
- CI pipeline: typecheck, lint, test, build, artifact upload
- Demo mode with fetch shim, seed data, scenarios, latency simulation

Acceptance:
- `npm run typecheck && npm run lint && npm run test && npm run build` passes locally and in CI
- Demo controls visible when `VITE_DEMO=1`; `window.__DEMO_RESET__` works

### M1 — Authentication & RBAC Wiring

- Implement authentication UI scaffolding and session handling hooks
- Role switcher connected to RBAC model for gating screens
- Guarded routes/screen stubs for key roles (Program Director, HR Manager, Development Director, Board Secretary)

Acceptance:
- Happy path login/logout flows (demo and production configuration stubs)
- Screens render/deny access per `src/auth/rbac.ts`
- Tests: RBAC unit tests for representative roles/scopes

### M2 — Role‑Based Dashboards (Scaffolds → Functional)

- Dashboard KPIs fetch via services layer, replace TODO metrics with deterministic demo data
- PresenterBar toggles scenarios and latency to visualize resilience
- Add empty/errored/loading states across dashboard widgets

Acceptance:
- KPI row renders stable values and handles error/empty gracefully
- a11y: widgets have labels, readable status messages
- Tests: service adapters mocked; dashboard renders under each state

### M3 — Core Modules (Intake, Case, Housing)

- Intake form scaffolding with validation and HIPAA indicators
- Case management list/detail stubs with role gating
- Housing placement workflow skeleton

Acceptance:
- Forms meet baseline a11y (labels, errors, keyboard)
- HIPAA amber indicators present on PHI fields/sections
- Tests: validation rules; RBAC denies/permits as expected

### M4 — Communications & Reporting

- Notifications center stub wired to services
- Basic reports export (CSV) with role restrictions

Acceptance:
- Exports include metadata footer (timestamp, user role)
- Tests: export formatter unit tests; permissions enforced

### M5 — Production Readiness

- Supabase environment integration (URL, anon key) with `validateEnv` enforcement
- CI extended with a11y checks and bundle budget
- Deployment runbooks verified (Vercel/Netlify/Cloudflare/Nginx)

Acceptance:
- CI includes a11y job and fails on regressions
- Build size within agreed budget; chunks documented
- `DEPLOYMENT.md` steps validated in at least one target host

### M6 — Audit & Security Hardening

- Add audit logging interfaces (client‑side hooks, server stubs)
- Document RLS strategies and data access patterns

Acceptance:
- Security checklist passes: HIPAA indicators, audit hook invocations in PHI paths
- Threat model documented at a high level; mitigations linked

### Ongoing Quality Bars

- Code review required; follow `guidelines/Guidelines.md`
- 80%+ logic coverage on services and RBAC helpers
- Zero `any`, explicit return types for exported functions

References:
- Project status details: `guidelines/STATUS.md`
- Deployment details: `DEPLOYMENT.md`
- Security policy: `SECURITY.md`
