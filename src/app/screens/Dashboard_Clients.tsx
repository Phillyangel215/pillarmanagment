import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CsvExport } from '@/components/common/CsvExport'
import UploadBox from '@/components/common/UploadBox'

type Client = { name: string; eligibility: string; services: string; notes: string; appt: string }

export default function Dashboard_Clients() {
  const [q, setQ] = useState('')
  const rows: Client[] = [
    { name: 'Sam Carter', eligibility: 'Pending', services: 'Shelter', notes: 'Needs ID', appt: '2025-08-22' },
    { name: 'Kim Lee', eligibility: 'Eligible', services: 'Outreach', notes: 'Follow-up', appt: '2025-08-27' },
  ]
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 sticky top-0 bg-black/40 p-2">
        <Input id="clients-filter" label="Filter" value={q} onChange={setQ} placeholder="Search..." />
        <CsvExport rows={filtered} columns={[
          { key: 'name', header: 'name' },
          { key: 'eligibility', header: 'eligibility' },
          { key: 'services', header: 'services' },
          { key: 'notes', header: 'notes' },
          { key: 'appt', header: 'appt' },
        ]} />
      </div>
      <Card>
        <CardHeader><CardTitle>Client Registry</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-[56px] bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1">Eligibility</th>
                <th className="px-2 py-1">Services</th>
                <th className="px-2 py-1 text-left">Notes</th>
                <th className="px-2 py-1">Appt</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-2 py-1">{r.name}</td>
                    <td className="px-2 py-1 text-center">{r.eligibility}</td>
                    <td className="px-2 py-1 text-center">{r.services}</td>
                    <td className="px-2 py-1">{r.notes}</td>
                    <td className="px-2 py-1 text-center">{r.appt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Documents (Demo Uploads)</CardTitle></CardHeader>
        <CardContent>
          <UploadBox accept=".pdf,.docx,.xlsx,.png,.jpg,.txt" />
        </CardContent>
      </Card>
    </div>
  )
}

