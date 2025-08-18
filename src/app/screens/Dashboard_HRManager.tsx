import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CsvExport } from '@/components/common/CsvExport'

type HRRow = { name: string; role: string; status: string; training: string }

export default function Dashboard_HRManager() {
  const [q, setQ] = useState('')
  const rows: HRRow[] = [
    { name: 'Alex Rivera', role: 'Case Worker', status: 'Active', training: 'HIPAA ✅' },
    { name: 'Dana Kapoor', role: 'Program Director', status: 'Onboarding', training: 'Pending' },
  ]
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 sticky top-0 bg-black/40 p-2">
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter..." />
        <CsvExport rows={filtered} columns={[
          { key: 'name', header: 'name' },
          { key: 'role', header: 'role' },
          { key: 'status', header: 'status' },
          { key: 'training', header: 'training' },
        ]} />
      </div>
      <Card>
        <CardHeader><CardTitle>Headcount & Compliance</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-[56px] bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Role</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Training</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-2 py-1">{r.name}</td>
                    <td className="px-2 py-1">{r.role}</td>
                    <td className="px-2 py-1 text-center">{r.status}</td>
                    <td className="px-2 py-1 text-center">{r.training}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

