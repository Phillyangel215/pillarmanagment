export default function validateEnv() {
	const required = ['VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY'] as const;
	// eslint-disable-next-line security/detect-object-injection
	const missing = required.filter(k => !import.meta.env[k]);
	if (missing.length && import.meta.env.PROD) {
		throw new Error(`Missing required env vars: ${missing.join(', ')}`);
	}
}
