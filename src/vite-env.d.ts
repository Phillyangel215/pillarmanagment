/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO?: string
  readonly VITE_BASE?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  __DEMO_RESET__?: () => void
}
