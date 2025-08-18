import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'

export interface ProvisionUserDialogProps {
  open: boolean
  onClose: () => void
  availableRoles: { label: string; value: string }[]
  onSubmit: (email: string, password: string, roles: string[]) => void | Promise<void>
}

export function ProvisionUserDialog({ open, onClose, availableRoles, onSubmit }: ProvisionUserDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(email, password, roles)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle level={2}>Create User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input id="email" label="Email" type="email" value={email} onChange={setEmail} required aria-describedby="email-help" helpText="User's work email" />
              <Input id="password" label="Password" type="password" value={password} onChange={setPassword} required aria-describedby="password-help" helpText="Temporary password" />
              <div>
                <span id="roles-label" className="block text-sm font-medium mb-1">Roles</span>
                <div className="grid gap-2" aria-labelledby="roles-label" aria-describedby="roles-help">
                  {availableRoles.map(r => (
                    <Checkbox
                      key={r.value}
                      id={`role-${r.value}`}
                      label={r.label}
                      checked={roles.includes(r.value)}
                      onChange={(checked) => {
                        setRoles(prev => checked ? [...prev, r.value] : prev.filter(v => v !== r.value))
                      }}
                    />
                  ))}
                </div>
                <p id="roles-help" className="text-xs text-muted mt-1">Select one or more roles</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProvisionUserDialog

