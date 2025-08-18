import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CsvExport } from '@/components/common/CsvExport'
import { CsvImport } from '@/components/common/CsvImport'

type Donor = { name: string; type: string; lastGift: string; status: string }

export default function Dashboard_Development() {
  const [q, setQ] = useState('')
  const rows: Donor[] = [
    { name: 'Acme Corp', type: 'Corporate', lastGift: '2025-06-01', status: 'LYBUNT' },
    { name: 'Jane Smith', type: 'Individual', lastGift: '2025-08-01', status: 'Active' },
  ]
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 sticky top-0 bg-black/40 p-2">
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter..." />
        <CsvExport rows={filtered} columns={[
          { key: 'name', header: 'name' },
          { key: 'type', header: 'type' },
          { key: 'lastGift', header: 'lastGift' },
          { key: 'status', header: 'status' },
        ]} />
      </div>
      <Card>
        <CardHeader><CardTitle>Fundraising Dashboard</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-[56px] bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Donor</th>
                <th className="px-2 py-1">Type</th>
                <th className="px-2 py-1">Last Gift</th>
                <th className="px-2 py-1">Status</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-2 py-1">{r.name}</td>
                    <td className="px-2 py-1 text-center">{r.type}</td>
                    <td className="px-2 py-1 text-center">{r.lastGift}</td>
                    <td className="px-2 py-1 text-center">{r.status}</td>
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

