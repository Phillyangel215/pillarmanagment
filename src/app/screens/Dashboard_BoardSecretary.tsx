import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import AuditLogViewer from '@/components/admin/AuditLogViewer'
import { appendEvent } from '@/services/audit'
import { CsvExport } from '@/components/common/CsvExport'

type Motion = { id: string; title: string; status: 'open'|'passed'|'failed'; votes: { user: string; vote: 'aye'|'nay'|'abstain'|'proxy'; ts: string }[] }

export default function Dashboard_BoardSecretary() {
  const [agenda, setAgenda] = useState<string[]>(['Call to Order','Previous Minutes','New Business'])
  const [packet, setPacket] = useState<string[]>(['Directors','Counsel','Auditor'])
  const [motions, setMotions] = useState<Motion[]>([{ id: 'm1', title: 'Approve Q2 Budget', status: 'open', votes: [] }])
  const [newMotion, setNewMotion] = useState('')

  const onAddMotion = () => {
    if (!newMotion.trim()) return
    setMotions(m => [...m, { id: String(Date.now()), title: newMotion.trim(), status: 'open', votes: [] }])
    setNewMotion('')
  }

  const onVote = async (m: Motion, vote: Motion['votes'][number]) => {
    setMotions(prev => prev.map(x => x.id === m.id ? { ...x, votes: [...x.votes, vote] } : x))
    await appendEvent({ ts: new Date().toISOString(), scope: 'governance', action: 'vote_recorded', details: { motion: m.title, vote } })
  }

  const flatVotes = useMemo(() => motions.flatMap(m => m.votes.map(v => ({ motion: m.title, ...v }))), [motions])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Agenda Builder</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Input value={newMotion} onChange={e => setNewMotion(e.target.value)} placeholder="Add agenda item or motion" />
            <Button onClick={onAddMotion}>Add</Button>
          </div>
          <ul className="space-y-1">
            {agenda.map((a, i) => (<li key={i} className="border border-white/10 rounded px-2 py-1">{a}</li>))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Packet Distribution</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {packet.map((p, i) => (<li key={i} className="border border-white/10 rounded px-2 py-1 flex items-center justify-between"><span>{p}</span><Button>Send</Button></li>))}
          </ul>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader><CardTitle>Motions & Roll Call</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-black/40"><tr>
                <th className="px-2 py-1 text-left">Motion</th>
                <th className="px-2 py-1">Actions</th>
              </tr></thead>
              <tbody>
                {motions.map(m => (
                  <tr key={m.id} className="border-t border-white/10">
                    <td className="px-2 py-1">{m.title}</td>
                    <td className="px-2 py-1">
                      {['aye','nay','abstain','proxy'].map(v => (
                        <Button key={v} onClick={() => onVote(m, { user: 'demo', vote: v as any, ts: new Date().toISOString() })} className="mr-2">Record {v}</Button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3"><CsvExport rows={flatVotes} columns={[{ key: 'motion', header: 'motion' },{ key: 'user', header: 'user' },{ key: 'vote', header: 'vote' },{ key: 'ts', header: 'ts' }]} filename="votes.csv" /></div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader><CardTitle>Audit Log (read-only)</CardTitle></CardHeader>
        <CardContent>
          <AuditLogViewer />
        </CardContent>
      </Card>
    </div>
  )
}

