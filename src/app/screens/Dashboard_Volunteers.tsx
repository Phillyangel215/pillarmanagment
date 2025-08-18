import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CsvExport } from '@/components/common/CsvExport'

type VolRow = { name: string; background: string; shift: string; hours: number; training: string }

export default function Dashboard_Volunteers() {
  const [q, setQ] = useState('')
  const rows: VolRow[] = [
    { name: 'Taylor Brooks', background: 'Cleared', shift: 'Wed 3-6', hours: 12, training: 'Completed' },
    { name: 'Jordan Miles', background: 'Pending', shift: 'Fri 9-12', hours: 4, training: 'Scheduled' },
  ]
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 sticky top-0 bg-black/40 p-2">
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter..." />
        <CsvExport rows={filtered} columns={[
          { key: 'name', header: 'name' },
          { key: 'background', header: 'background' },
          { key: 'shift', header: 'shift' },
          { key: 'hours', header: 'hours' },
          { key: 'training', header: 'training' },
        ]} />
      </div>
      <Card>
        <CardHeader><CardTitle>Volunteer Roster</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-[56px] bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1">Background</th>
                <th className="px-2 py-1">Shift</th>
                <th className="px-2 py-1">Hours</th>
                <th className="px-2 py-1">Training</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-2 py-1">{r.name}</td>
                    <td className="px-2 py-1 text-center">{r.background}</td>
                    <td className="px-2 py-1 text-center">{r.shift}</td>
                    <td className="px-2 py-1 text-right">{r.hours}</td>
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

