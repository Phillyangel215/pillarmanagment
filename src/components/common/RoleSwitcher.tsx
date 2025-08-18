import React, { useEffect, useState } from 'react'
import { Role } from '@/auth/rbac'

const ALL: Role[] = [
  Role.SUPER_ADMIN, Role.ADMIN, Role.CEO, Role.COO, Role.CFO,
  Role.BOARD_MEMBER, Role.BOARD_SECRETARY, Role.PROGRAM_DIRECTOR,
  Role.HR_MANAGER, Role.DEVELOPMENT_DIRECTOR, Role.GRANTS_MANAGER,
  Role.SUPERVISOR, Role.CASE_WORKER, Role.SOCIAL_WORKER,
  Role.INTAKE_SPECIALIST, Role.HOUSING_SPECIALIST, Role.RECEPTIONIST,
  Role.VOLUNTEER, Role.CLIENT,
]

export default function RoleSwitcher() {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dev.roles')
      setSelected(raw ? JSON.parse(raw) : [Role.SUPER_ADMIN])
    } catch { setSelected([Role.SUPER_ADMIN]) }
  }, [])

  function toggle(role: Role) {
    setSelected(prev => {
      const next = prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
      localStorage.setItem('dev.roles', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="opacity-70">Roles:</span>
      <div className="flex flex-wrap gap-1 max-w-[56rem]">
        {ALL.map(r => (
          <button
            key={r}
            onClick={() => toggle(r)}
            className={`px-2 py-1 rounded border ${selected.includes(r) ? 'bg-white/10 border-white/40' : 'border-white/10 hover:bg-white/5'}`}
            title={r}
          >
            {r.replace(/_/g,' ')}
          </button>
        ))}
      </div>
    </div>
  )
}
