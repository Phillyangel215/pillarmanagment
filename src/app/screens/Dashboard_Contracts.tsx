import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CsvExport } from '@/components/common/CsvExport'

type Contract = { program: string; funder: string; start: string; end: string; budget: number; status: string }

export default function Dashboard_Contracts() {
  const [q, setQ] = useState('')
  const rows: Contract[] = [
    { program: 'Family Services', funder: 'HHS', start: '2025-01-01', end: '2025-12-31', budget: 500000, status: 'Active' },
    { program: 'Shelter Ops', funder: 'City', start: '2025-07-01', end: '2026-06-30', budget: 750000, status: 'Pending' },
  ]
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 sticky top-0 bg-black/40 p-2">
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter..." />
        <CsvExport rows={filtered} columns={[
          { key: 'program', header: 'program' },
          { key: 'funder', header: 'funder' },
          { key: 'start', header: 'start' },
          { key: 'end', header: 'end' },
          { key: 'budget', header: 'budget' },
          { key: 'status', header: 'status' },
        ]} />
      </div>
      <Card>
        <CardHeader><CardTitle>Contract Registry</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-[56px] bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Program</th>
                <th className="px-2 py-1 text-left">Funder</th>
                <th className="px-2 py-1">Start</th>
                <th className="px-2 py-1">End</th>
                <th className="px-2 py-1">Budget</th>
                <th className="px-2 py-1">Status</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-2 py-1">{r.program}</td>
                    <td className="px-2 py-1">{r.funder}</td>
                    <td className="px-2 py-1 text-center">{r.start}</td>
                    <td className="px-2 py-1 text-center">{r.end}</td>
                    <td className="px-2 py-1 text-right">${r.budget.toLocaleString()}</td>
                    <td className="px-2 py-1">{r.status}</td>
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

