import React from 'react'
import RoleSwitcher from '@/components/common/RoleSwitcher'
import CreateUserButton from '@/components/common/CreateUserButton'

export default function PresenterBar() {
  if (import.meta.env.VITE_DEMO !== '1') return null
  const onReset = () => {
    (window as any).__DEMO_RESET__?.()
    // reload to reflect state reset
    window.location.reload()
  }
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 text-xs rounded bg-amber-500/20 border border-amber-500/30">DEMO MODE</span>
        <button onClick={onReset} className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5">
          Reset data
        </button>
        <CreateUserButton />
      </div>
      <RoleSwitcher />
    </div>
  )
}

