import React, { useMemo, useState } from 'react'
import { listEvents, exportCSV } from '@/services/audit'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function AuditLogViewer() {
  const [scope, setScope] = useState('')
  const [user, setUser] = useState('')
  const [since, setSince] = useState('')
  const rows = useMemo(() => listEvents({ scope: scope || undefined, user: user || undefined, since: since || undefined }), [scope, user, since])

  const onExport = () => {
    const csv = exportCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'audit.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end sticky top-0 bg-[var(--color-surface,#0E0F13)] p-2 border-b border-white/10">
        <Input value={scope} onChange={e => setScope(e.target.value)} placeholder="Scope" />
        <Input value={user} onChange={e => setUser(e.target.value)} placeholder="User" />
        <Input type="datetime-local" value={since} onChange={e => setSince(e.target.value)} placeholder="Since" />
        <Button onClick={onExport}>Export CSV</Button>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-[56px] bg-black/40 backdrop-blur">
            <tr className="text-left">
              <th className="px-2 py-1">Time</th>
              <th className="px-2 py-1">User</th>
              <th className="px-2 py-1">Scope</th>
              <th className="px-2 py-1">Action</th>
              <th className="px-2 py-1">Details</th>
              <th className="px-2 py-1">Hash</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="px-2 py-1 whitespace-nowrap">{r.ts}</td>
                <td className="px-2 py-1">{r.user || ''}</td>
                <td className="px-2 py-1">{r.scope}</td>
                <td className="px-2 py-1">{r.action}</td>
                <td className="px-2 py-1 font-mono text-xs break-all">{typeof r.details === 'object' ? JSON.stringify(r.details) : (r.details as any) || ''}</td>
                <td className="px-2 py-1 font-mono text-[10px] text-white/60">{r.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

