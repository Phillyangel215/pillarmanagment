# Domain Setup Guide - GoDaddy to Project

This guide will help you connect your GoDaddy domain to both the demo (GitHub Pages) and production versions of your nonprofit management system.

## 🌐 Domain Strategy Options

### Option 1: Subdomain Setup (Recommended)
- **Demo**: `demo.yourdomain.com` → GitHub Pages
- **Production**: `app.yourdomain.com` → Your production hosting
- **Marketing**: `www.yourdomain.com` → Landing page

### Option 2: Path-based Setup
- **Demo**: `yourdomain.com/demo` → GitHub Pages
- **Production**: `yourdomain.com` → Production app

### Option 3: Separate Domains
- **Demo**: `yourdomain.com` → GitHub Pages
- **Production**: Different domain or subdomain

## 🚀 Step-by-Step Setup

### Step 1: Configure GitHub Pages for Demo

#### 1.1 Update GitHub Pages Settings
1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select branch: `main`
5. Set custom domain: `demo.yourdomain.com` (or your chosen subdomain)

#### 1.2 Update Demo Build Configuration
Update your GitHub Pages workflow:

```yaml
# .github/workflows/demo-pages.yml
name: Demo (GitHub Pages)
on:
  push: { branches: [ main ] }
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency: { group: demo-pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - name: Build (Demo Mode)
        env: 
          VITE_DEMO: "1"
          VITE_BASE: "/"  # Change from "/pillarmanagment/" to "/"
        run: |
          npm run build
          cp dist/index.html dist/404.html
          echo "demo.yourdomain.com" > dist/CNAME
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Step 2: Configure GoDaddy DNS

#### 2.1 Access GoDaddy DNS Management
1. Log in to your GoDaddy account
2. Go to "My Products"
3. Find your domain and click "DNS"

#### 2.2 Add DNS Records

**For Demo (GitHub Pages):**
```
Type: CNAME
Name: demo
Value: yourusername.github.io
TTL: 1 Hour
```

**For Production App:**
```
Type: CNAME  
Name: app
Value: your-production-host.com
TTL: 1 Hour
```

**For Main Website (Optional):**
```
Type: CNAME
Name: www
Value: your-landing-page-host.com
TTL: 1 Hour

Type: A (if using root domain)
Name: @
Value: [Your hosting provider's IP]
TTL: 1 Hour
```

#### 2.3 Common DNS Configurations

**Vercel (Production):**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 1 Hour
```

**Netlify (Production):**
```
Type: CNAME
Name: app
Value: yoursitename.netlify.app
TTL: 1 Hour
```

**Cloudflare Pages:**
```
Type: CNAME
Name: app
Value: yourproject.pages.dev
TTL: 1 Hour
```

### Step 3: Update Project Configuration

#### 3.1 Update Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  // ... rest of config
})
```

#### 3.2 Update Supabase Configuration
```typescript
// src/lib/supabase.ts
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  { 
    auth: { 
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Add your domains to allowed origins
      redirectTo: process.env.NODE_ENV === 'production' 
        ? 'https://app.yourdomain.com'
        : 'http://localhost:3000'
    } 
  }
)
```

#### 3.3 Update Environment Variables
Create different `.env` files for different environments:

**.env.demo:**
```bash
VITE_DEMO=1
VITE_BASE=/
VITE_APP_URL=https://demo.yourdomain.com
```

**.env.production:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BASE=/
VITE_APP_URL=https://app.yourdomain.com
```

### Step 4: SSL Certificate Setup

#### 4.1 GitHub Pages SSL
- GitHub Pages automatically provides SSL for custom domains
- Wait 24-48 hours after DNS setup for SSL to activate
- Check "Enforce HTTPS" in repository settings

#### 4.2 Production SSL
Most hosting providers (Vercel, Netlify, Cloudflare) provide automatic SSL:
- Vercel: Automatic SSL for custom domains
- Netlify: Automatic SSL with Let's Encrypt
- Cloudflare: SSL included in all plans

### Step 5: Testing Your Setup

#### 5.1 DNS Propagation Check
```bash
# Check if DNS is working
nslookup demo.yourdomain.com
nslookup app.yourdomain.com

# Or use online tools:
# https://dnschecker.org
```

#### 5.2 Test Demo Site
1. Visit `https://demo.yourdomain.com`
2. Verify demo mode is active (should show "DEMO MODE" badge)
3. Test all functionality works
4. Check browser console for errors

#### 5.3 Test Production Site
1. Visit `https://app.yourdomain.com`
2. Verify Supabase connection works
3. Test authentication flow
4. Test avatar uploads

## 🔧 Hosting Options for Production

### Option 1: Vercel (Recommended for React)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add custom domain in Vercel dashboard
# Point app.yourdomain.com to your Vercel deployment
```

### Option 2: Netlify
```bash
# Install Netlify CLI  
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Add custom domain in Netlify dashboard
```

### Option 3: Cloudflare Pages
1. Connect GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add custom domain: `app.yourdomain.com`

### Option 4: Traditional Web Hosting
If using traditional hosting (shared hosting, VPS):
1. Build the project: `npm run build`
2. Upload `dist/` contents to your web server
3. Configure web server for SPA routing
4. Point DNS to your server's IP

## 🚨 Common Issues & Solutions

### Issue 1: "Page Not Found" on Refresh
**Solution**: Configure SPA fallback
- GitHub Pages: `cp dist/index.html dist/404.html`
- Netlify: Add `_redirects` file with `/* /index.html 200`
- Vercel: Add `vercel.json` with rewrites

### Issue 2: DNS Not Propagating
**Solutions**:
- Wait 24-48 hours for full propagation
- Use different DNS servers for testing
- Clear browser DNS cache
- Check TTL settings (lower = faster updates)

### Issue 3: SSL Certificate Not Working
**Solutions**:
- Wait for automatic SSL provisioning
- Verify DNS is pointing correctly
- Check hosting provider's SSL settings
- Use SSL checker tools online

### Issue 4: Supabase Auth Redirect Issues
**Solution**: Update Supabase Auth settings
1. Go to Supabase Dashboard → Authentication → Settings
2. Add your domains to "Site URL" and "Redirect URLs":
   - `https://demo.yourdomain.com`
   - `https://app.yourdomain.com`

## 📝 Final Checklist

- [ ] DNS records configured in GoDaddy
- [ ] GitHub Pages custom domain set
- [ ] Production hosting configured
- [ ] SSL certificates active
- [ ] Supabase redirect URLs updated
- [ ] Demo site working at demo.yourdomain.com
- [ ] Production site working at app.yourdomain.com
- [ ] All authentication flows tested
- [ ] Avatar uploads working in production

## 🎉 You're Done!

Your nonprofit management system should now be accessible at:
- **Demo**: `https://demo.yourdomain.com` 
- **Production**: `https://app.yourdomain.com`

Both versions will have proper SSL, fast loading, and all features working correctly.
