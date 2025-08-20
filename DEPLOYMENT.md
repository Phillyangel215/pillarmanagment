## Deployment guide

This app is a static Vite + React build that outputs to `dist/`. You can deploy it to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, or your own Nginx).

### Prerequisites
- Node 20+
- `npm ci && npm run build` will produce `dist/`
- Environment variables (if not in demo mode):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

If you want the self-contained demo (no backend), set `VITE_DEMO=1` in your environment.

### Vercel
1. Import the repository in Vercel
2. Framework: Vite
3. Build command: `npm run build`
4. Output: `dist`
5. Environment variables: add `VITE_DEMO=1` for demo, or your Supabase vars
6. After deploy: Settings → Domains → Add your custom domain
   - If you bought your domain at your registrar, set the provided CNAME (or A/AAAA) records to Vercel

### Netlify
1. New site from Git
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables as needed
5. Add custom domain: Site settings → Domain management → Add domain
   - Point your domain via CNAME to `your-site.netlify.app`

### Cloudflare Pages
1. Create a project from Git
2. Build command: `npm ci && npm run build:pages`
3. Build output directory: `dist`
4. Node version: `20`
5. Environment variables (Production):
   - `VITE_DEMO=1` (for demo mode)
   - `VITE_BASE=/`
   - Later, to go production: set `VITE_DEMO=0` and provide `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
6. SPA routing: ensure `_redirects` with `/*  /index.html  200` exists in `public/` (already included)
7. Custom domains: Pages project → Custom Domains → Set CNAME to Cloudflare

### GitHub Pages
1. Build locally: `npm ci && npm run build`
2. Push `dist/` to the `gh-pages` branch (e.g., with `gh-pages` npm package)
3. Repo Settings → Pages → Branch: `gh-pages`, folder `/`
4. For custom domain: add a `CNAME` file in `gh-pages` with your domain and set DNS to GitHub Pages

### Nginx (self-hosted)
1. Copy `dist/` to your server (e.g., `/var/www/nonprofit-app`)
2. Example Nginx config (SPA fallback):
```
server {
  listen 80;
  server_name example.org www.example.org;
  root /var/www/nonprofit-app;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```
3. For HTTPS, use Let's Encrypt (Certbot) or your provider

### DNS: linking a custom domain
- Add a CNAME record from `www` to your host-provided domain (e.g., `your-site.vercel.app`)
- Optionally add ANAME/ALIAS or A/AAAA for apex/root (depends on host). Many hosts provide easy apex support (e.g., Vercel/Netlify)
- Propagation can take up to 24 hours (typically much faster)

### Environment variables
- Demo mode (no backend): `VITE_DEMO=1`
- Production with Supabase:
  - `VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY`

### CI/CD
- GitHub Actions in `.github/workflows/ci.yml` runs typecheck, lint, tests and build
- Block merges on failing checks to keep main deployable

