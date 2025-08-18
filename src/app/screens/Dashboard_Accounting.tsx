import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CsvExport } from '@/components/common/CsvExport'

type Line = { program: string; grant: string; actual: number; budget: number }

export default function Dashboard_Accounting() {
  const [q, setQ] = useState('')
  const rows: Line[] = [
    { program: 'Outreach', grant: 'City-2025', budget: 200000, actual: 95000 },
    { program: 'Shelter', grant: 'HHS-2025', budget: 500000, actual: 210000 },
  ]
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 sticky top-0 bg-black/40 p-2">
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter..." />
        <CsvExport rows={filtered} columns={[
          { key: 'program', header: 'program' },
          { key: 'grant', header: 'grant' },
          { key: 'budget', header: 'budget' },
          { key: 'actual', header: 'actual' },
        ]} filename="gl_netsuite.csv" />
      </div>
      <Card>
        <CardHeader><CardTitle>Program Budgets</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-[56px] bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Program</th>
                <th className="px-2 py-1 text-left">Grant/Contract</th>
                <th className="px-2 py-1">Budget</th>
                <th className="px-2 py-1">Actual</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-2 py-1">{r.program}</td>
                    <td className="px-2 py-1">{r.grant}</td>
                    <td className="px-2 py-1 text-right">${r.budget.toLocaleString()}</td>
                    <td className="px-2 py-1 text-right">${r.actual.toLocaleString()}</td>
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

