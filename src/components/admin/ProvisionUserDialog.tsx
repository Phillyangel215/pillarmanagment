import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { useProvisionUser } from '@/features/admin/useProvisionUser'

const ALL_ROLES = [
  'SUPER_ADMIN','ADMIN','CEO','COO','CFO','BOARD_MEMBER','BOARD_SECRETARY','PROGRAM_DIRECTOR','HR_MANAGER','DEVELOPMENT_DIRECTOR','GRANTS_MANAGER','SUPERVISOR','CASE_WORKER','SOCIAL_WORKER','INTAKE_SPECIALIST','HOUSING_SPECIALIST','RECEPTIONIST','VOLUNTEER','CLIENT'
]

export function ProvisionUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { provision, loading } = useProvisionUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roles, setRoles] = useState<string[]>(['CLIENT'])
  const [error, setError] = useState<string | null>(null)

  const toggleRole = (role: string) => {
    setRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role])
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await provision({ email, password, roles })
      onClose()
      alert('User provisioned')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} title="Provision User">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <div role="alert" className="p-2 text-error bg-error/10 border border-error/20 rounded">{error}</div>}
        <Input id="email" label="Email" type="email" value={email} onChange={setEmail} required />
        <Input id="password" label="Temporary password" type="password" value={password} onChange={setPassword} required />
        
        <div>
          <label className="block text-sm font-medium text-text mb-2">Roles</label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-surface-4 rounded p-3">
            {ALL_ROLES.map(role => (
              <Checkbox
                key={role}
                id={`role-${role}`}
                label={role}
                checked={roles.includes(role)}
                onChange={(checked) => checked ? setRoles(prev => [...prev, role]) : setRoles(prev => prev.filter(r => r !== role))}
              />
            ))}
          </div>
          <p className="text-xs text-muted mt-1">Select one or more roles for the user.</p>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={loading} disabled={loading}>Create</Button>
        </div>
      </form>
    </Modal>
  )
}

export default ProvisionUserDialog
