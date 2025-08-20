import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CsvExport } from '@/components/common/CsvExport'

type Row = { name: string; role: string; assets: string; access: string; finalPay: string }

export default function Dashboard_Offboarding() {
  const [q, setQ] = useState('')
  const rows: Row[] = [
    { name: 'Chris Doe', role: 'Supervisor', assets: 'Laptop returned', access: 'Deprovisioned', finalPay: 'Confirmed' },
  ]
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 sticky top-0 bg-black/40 p-2">
        <Input id="offboard-filter" label="Filter" value={q} onChange={setQ} placeholder="Search..." />
        <CsvExport rows={filtered} columns={[
          { key: 'name', header: 'name' },
          { key: 'role', header: 'role' },
          { key: 'assets', header: 'assets' },
          { key: 'access', header: 'access' },
          { key: 'finalPay', header: 'finalPay' },
        ]} />
      </div>
      <Card>
        <CardHeader><CardTitle>Offboarding</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-[56px] bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1">Role</th>
                <th className="px-2 py-1">Assets</th>
                <th className="px-2 py-1">Access</th>
                <th className="px-2 py-1">Final Pay</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-2 py-1">{r.name}</td>
                    <td className="px-2 py-1 text-center">{r.role}</td>
                    <td className="px-2 py-1 text-center">{r.assets}</td>
                    <td className="px-2 py-1 text-center">{r.access}</td>
                    <td className="px-2 py-1 text-center">{r.finalPay}</td>
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

