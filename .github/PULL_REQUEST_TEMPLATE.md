### Summary

- Fix Cloudflare Pages build with Vite SPA config and Pages-like CI sanity.

### Changes
- Build scripts and engines in `package.json`
- Vite base and alias in `vite.config.ts`
- Vite types and paths in `tsconfig.json`; add `src/vite-env.d.ts`
- SPA redirects in `public/_redirects`
- Replace `process.env` with `import.meta.env` in `ErrorBoundary`
- DEPLOYMENT.md: Cloudflare Pages section
- GitHub Action: simulate Pages build

### Verification
- Local Pages-like build: `CI=1 VITE_DEMO=1 VITE_BASE=/ npm run build` (or `npm run build:pages`)
- Output directory: `dist`

### Cloudflare Pages Settings
- Build command: `npm ci && npm run build:pages`
- Output directory: `dist`
- Node: 20
- Env: `VITE_DEMO=1`, `VITE_BASE=/`

### Summary

- Fix Cloudflare Pages build with Vite SPA config and Pages-like CI sanity.

### Changes
- Build scripts and engines in `package.json`
- Vite base and alias in `vite.config.ts`
- Vite types and paths in `tsconfig.json`; add `src/vite-env.d.ts`
- SPA redirects in `public/_redirects`
- Replace `process.env` with `import.meta.env` in `ErrorBoundary`
- DEPLOYMENT.md: Cloudflare Pages section
- GitHub Action: simulate Pages build

### Verification
- Local Pages-like build: `CI=1 VITE_DEMO=1 VITE_BASE=/ npm run build` (or `npm run build:pages`)
- Output directory: `dist`

### Cloudflare Pages Settings
- Build command: `npm ci && npm run build:pages`
- Output directory: `dist`
- Node: 20
- Env: `VITE_DEMO=1`, `VITE_BASE=/`

