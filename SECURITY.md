## Security policy

### Supported versions
- Main branch is supported. Use the latest release for production.

### Reporting a vulnerability
- Please open a private security advisory (GitHub Security → Advisories) or email the maintainers.
- Provide a clear description, reproduction steps, impact, and any suggested mitigations.

### Secure development practices
- ESLint security plugin is enabled (`eslint-plugin-security`)
- No implicit coercions; strict typing enforced
- Error boundaries prevent info leaks in UI
- Avoid `any` in production code; demo code is typed

### Dependency hygiene
- Lockfile (`npm ci`) for reproducible installs
- Keep dependencies updated; address high severity advisories promptly

### Data protection
- Demo mode (`VITE_DEMO=1`) uses only localStorage; no real PHI is processed
- In production, configure environment variables and backends securely (e.g., Supabase Row Level Security)

## Security policy

### Supported versions
- Main branch is supported. Use the latest release for production.

### Reporting a vulnerability
- Please open a private security advisory (GitHub Security → Advisories) or email the maintainers.
- Provide a clear description, reproduction steps, impact, and any suggested mitigations.

### Secure development practices
- ESLint security plugin is enabled (`eslint-plugin-security`)
- No implicit coercions; strict typing enforced
- Error boundaries prevent info leaks in UI
- Avoid `any` in production code; demo code is typed

### Dependency hygiene
- Lockfile (`npm ci`) for reproducible installs
- Keep dependencies updated; address high severity advisories promptly

### Data protection
- Demo mode (`VITE_DEMO=1`) uses only localStorage; no real PHI is processed
- In production, configure environment variables and backends securely (e.g., Supabase Row Level Security)

