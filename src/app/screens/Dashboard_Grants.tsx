import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CsvExport } from '@/components/common/CsvExport'
import { CsvImport } from '@/components/common/CsvImport'

type Grant = { stage: string; funder: string; title: string; submitted: string; awarded?: string; amount?: number }

export default function Dashboard_Grants() {
  const [q, setQ] = useState('')
  const rows: Grant[] = [
    { stage: 'LOI', funder: 'ABC Foundation', title: 'Youth Mentoring', submitted: '2025-03-10' },
    { stage: 'Submitted', funder: 'DEF Trust', title: 'Case Mgmt', submitted: '2025-04-15' },
    { stage: 'Awarded', funder: 'City', title: 'Outreach', submitted: '2025-01-05', awarded: '2025-02-01', amount: 150000 },
  ]
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 sticky top-0 bg-black/40 p-2">
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter..." />
        <CsvExport rows={filtered} columns={[
          { key: 'stage', header: 'stage' },
          { key: 'funder', header: 'funder' },
          { key: 'title', header: 'title' },
          { key: 'submitted', header: 'submitted' },
          { key: 'awarded', header: 'awarded' },
          { key: 'amount', header: 'amount' },
        ]} />
      </div>
      <Card>
        <CardHeader><CardTitle>Pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-[56px] bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Stage</th>
                <th className="px-2 py-1 text-left">Funder</th>
                <th className="px-2 py-1 text-left">Title</th>
                <th className="px-2 py-1">Submitted</th>
                <th className="px-2 py-1">Awarded</th>
                <th className="px-2 py-1">Amount</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-2 py-1">{r.stage}</td>
                    <td className="px-2 py-1">{r.funder}</td>
                    <td className="px-2 py-1">{r.title}</td>
                    <td className="px-2 py-1 text-center">{r.submitted}</td>
                    <td className="px-2 py-1 text-center">{r.awarded || ''}</td>
                    <td className="px-2 py-1 text-right">{r.amount ? `$${r.amount.toLocaleString()}` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>CSV Import (Demo)</CardTitle></CardHeader>
        <CardContent>
          <CsvImport onValidate={async rows => []} onImport={async rows => void rows.length} />
        </CardContent>
      </Card>
    </div>
  )
}

