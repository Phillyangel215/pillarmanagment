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
