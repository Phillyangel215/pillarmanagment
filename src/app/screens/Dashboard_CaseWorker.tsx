import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CsvExport } from '@/components/common/CsvExport'

type CaseRow = { client: string; task: string; due: string; status: string }

export default function Dashboard_CaseWorker() {
  const [q, setQ] = useState('')
  const rows: CaseRow[] = [
    { client: 'Sam Carter', task: 'Intake assessment', due: '2025-08-21', status: 'Overdue' },
    { client: 'Kim Lee', task: 'Housing referral', due: '2025-08-25', status: 'Due' },
  ]
  const filtered = useMemo(() => rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2 sticky top-0 bg-black/40 p-2">
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter..." />
        <CsvExport rows={filtered} columns={[
          { key: 'client', header: 'client' },
          { key: 'task', header: 'task' },
          { key: 'due', header: 'due' },
          { key: 'status', header: 'status' },
        ]} />
      </div>
      <Card>
        <CardHeader><CardTitle>Caseload</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-[56px] bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Client</th>
                <th className="px-2 py-1 text-left">Task</th>
                <th className="px-2 py-1">Due</th>
                <th className="px-2 py-1">Status</th>
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-2 py-1">{r.client}</td>
                    <td className="px-2 py-1">{r.task}</td>
                    <td className="px-2 py-1 text-center">{r.due}</td>
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

