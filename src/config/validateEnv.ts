export default function validateEnv() {
  const isDemoEnabled = import.meta.env.VITE_DEMO === '1';
  const isProduction = Boolean(import.meta.env.PROD);
  if (isDemoEnabled) return;

  const required = ['VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY'] as const;
  const missing = required.filter((key) => !import.meta.env[key]);
  if (missing.length && isProduction) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
