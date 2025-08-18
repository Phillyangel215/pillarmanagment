## Nonprofit Enterprise Management System

Enterprise-grade nonprofit management system built with Vite, React, TypeScript, and Tailwind CSS. Features role-based access control, HIPAA compliance, and comprehensive audit logging.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run test suite
- `npm run preview` - Preview production build

## 🏗️ Project Structure

```
src/
├── app/              # Main application components
├── components/       # Reusable components
│   └── common/       # Common components (ErrorBoundary, etc.)
├── test/             # Test configuration
├── main.tsx          # Application entry point
├── index.css         # Global styles with enterprise design system
└── vite-env.d.ts     # Vite type definitions
```

## 🎯 Phase 1: Foundation Setup ✅

- ✅ Clean Vite + React + TypeScript project structure
- ✅ Enterprise ESLint configuration with security rules
- ✅ TypeScript strict mode with path aliases (@/*)
- ✅ Enterprise design system with HIPAA compliance indicators
- ✅ Error boundary implementation
- ✅ GitHub Actions CI/CD pipeline
- ✅ Comprehensive build and quality checks

## 🔧 Enterprise Configurations

### TypeScript
- Strict mode enabled with comprehensive type checking
- Path aliases configured for clean imports
- No implicit any types allowed

### ESLint
- Enterprise-grade rules with security checks
- Accessibility (a11y) validation
- React and TypeScript best practices
- Zero warnings policy

### Design System
- WCAG AA accessibility compliance
- 16px minimum font size
- 44px minimum touch targets
- HIPAA-compliant amber indicators for sensitive data
- Mobile-first responsive design

## 🛡️ Security & Compliance

- **Role-Based Access Control (RBAC)**: Admin, CEO, COO, Case Worker, etc.
- **HIPAA Compliance**: PHI data handling with audit logging
- **Enterprise Security**: ESLint security rules and vulnerability checks
- **Accessibility**: WCAG AA compliance with proper ARIA labels

## 📊 Quality Assurance

- **TypeScript Strict Mode**: Zero runtime errors
- **ESLint Rules**: Consistent code style and security
- **Error Boundaries**: Graceful error handling
- **CI/CD Pipeline**: Automated testing and building

## 🎨 Design Principles

- **Mobile First**: 375px minimum width with progressive enhancement
- **Enterprise Typography**: Inter font with consistent hierarchy
- **Color Standards**: Blue (primary), Gray (secondary), Green (success), Red (error), Amber (HIPAA)
- **Spacing System**: 4px base unit with consistent spacing throughout

## 🚀 Next Development Phases

**Phase 2**: Component Development
- Authentication system with Supabase
- Role-based dashboard components
- Form components with validation

**Phase 3**: Business Logic
- Client management system
- Housing services tracking
- Report generation

**Phase 4**: Advanced Features
- Real-time notifications
- Document management
- Analytics dashboard

## 📚 Development Standards

### Component Structure
1. Header documentation with purpose and HIPAA status
2. RBAC security checks
3. TypeScript interfaces with user object
4. State management for loading, error, and data states
5. Event handlers with proper error handling
6. Accessibility features and ARIA labels
7. HIPAA compliance and audit logging

### Code Quality
- All functions must have explicit return types
- No `any` types allowed
- Comprehensive error boundaries
- User-friendly error messages
- Proper TypeScript strict mode compliance

---

Built with ❤️ for nonprofit organizations serving vulnerable populations.

## Environments & Flags

Create a `.env` from `.env.example`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SENTRY_DSN=            # optional; if set, error reporting beacons enabled
VITE_DEMO=0                 # set 1 for demo mode
```

Build metadata is injected via `VITE_BUILD_SHA` in CI and defaults to `dev` locally.

## Run modes

- Demo (no network calls):

```
VITE_DEMO=1 npm run dev
```

- Local prod path (requires Supabase project and Edge functions running):

```
VITE_DEMO=0 npm run dev
```

## Release checklist

- Lint, typecheck, build, and tests are green: `npm run lint && npm run typecheck && npm run build && npm run test`
- Env vars set in hosting provider
- CI produces `dist/` artifact on main

## Security notes

- Provisioning requires `SUPER_ADMIN` in JWT `app_metadata.roles`
- RLS is enforced in Supabase (see your project's policies)

## Meta security headers

Configure at your reverse proxy / hosting:

- Content-Security-Policy, Referrer-Policy, X-Frame-Options, Permissions-Policy

## Changelog

- v1.0.0 – Initial production release.