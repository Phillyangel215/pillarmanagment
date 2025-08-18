import validateEnv from '@/config/validateEnv'
validateEnv()

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'

const bootstrap = async () => {
  if (import.meta.env.VITE_DEMO === '1') {
    const m = await import('./demo/installDemo')
    m.installDemo()
  }
}

bootstrap().finally(() => {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Failed to find the root element')
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})