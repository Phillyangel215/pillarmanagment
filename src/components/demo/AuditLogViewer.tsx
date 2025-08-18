import React, { useEffect, useMemo, useState } from 'react'
import { auditList, auditValidate } from '@/services/audit'

function toCSV(rows: any[]): string {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc((r as Record<string, unknown>)[c])).join(','))].join('\n')
}

export default function AuditLogViewer() {
  const [scope, setScope] = useState('')
  const [action, setAction] = useState('')
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<any[]>([])
  const [valid, setValid] = useState<'checking' | 'ok' | 'bad'>('checking')

  useEffect(() => {
    let mounted = true
    auditList({ scope: scope || undefined, action: action || undefined, q: q || undefined }).then((r) => mounted && setRows(r))
    auditValidate().then((r) => mounted && setValid(r.ok ? 'ok' : 'bad'))
    return () => {
      mounted = false
    }
  }, [scope, action, q])

  const download = () => {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `audit_${Date.now()}.csv`
    a.click()
  }

  const badge = useMemo(() => {
    if (valid === 'checking')
      return <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/40">Validating…</span>
    if (valid === 'ok') return <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40">Chain OK</span>
    return <span className="text-xs px-2 py-1 rounded bg-rose-500/20 border border-rose-500/40">Chain Corrupt</span>
  }, [valid])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="font-medium">Audit Log</div>
        {badge}
        <div className="ml-auto flex gap-2">
          <select className="px-2 py-1 rounded border border-white/20 bg-transparent" value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="">Scope: any</option>
            <option value="governance">governance</option>
            <option value="accounts">accounts</option>
            <option value="roles">roles</option>
            <option value="uploads">uploads</option>
            <option value="auth">auth</option>
          </select>
          <input className="px-2 py-1 rounded border border-white/20 bg-transparent" placeholder="Action or text" value={q} onChange={(e) => setQ(e.target.value)} />
          <button onClick={download} className="px-2 py-1 rounded border border-white/20 hover:bg-white/10">Export CSV</button>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white/5">
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Scope</th>
              <th className="text-left p-2">Action</th>
              <th className="text-left p-2">Actor</th>
              <th className="text-left p-2">Target</th>
              <th className="text-left p-2">Hash</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-2">{new Date(r.ts).toLocaleString()}</td>
                <td className="p-2">{r.scope}</td>
                <td className="p-2">{r.action}</td>
                <td className="p-2">{r.actor?.email ?? r.actor?.id ?? '—'}</td>
                <td className="p-2">{r.target?.label ?? r.target?.id ?? '—'}</td>
                <td className="p-2 font-mono text-xs break-all">{String(r.hash || '').slice(0, 12)}…</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td className="p-4 opacity-70" colSpan={6}>
                  No audit entries match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { auditList, auditValidate } from '@/services/audit'

function toCSV(rows: any[]): string {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc((r as Record<string, unknown>)[c])).join(','))].join('\n')
}

export default function AuditLogViewer() {
  const [scope, setScope] = useState('')
  const [action, setAction] = useState('')
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<any[]>([])
  const [valid, setValid] = useState<'checking' | 'ok' | 'bad'>('checking')

  useEffect(() => {
    let mounted = true
    auditList({ scope: scope || undefined, action: action || undefined, q: q || undefined }).then((r) => mounted && setRows(r))
    auditValidate().then((r) => mounted && setValid(r.ok ? 'ok' : 'bad'))
    return () => {
      mounted = false
    }
  }, [scope, action, q])

  const download = () => {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `audit_${Date.now()}.csv`
    a.click()
  }

  const badge = useMemo(() => {
    if (valid === 'checking')
      return <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/40">Validating…</span>
    if (valid === 'ok') return <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40">Chain OK</span>
    return <span className="text-xs px-2 py-1 rounded bg-rose-500/20 border border-rose-500/40">Chain Corrupt</span>
  }, [valid])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="font-medium">Audit Log</div>
        {badge}
        <div className="ml-auto flex gap-2">
          <select className="px-2 py-1 rounded border border-white/20 bg-transparent" value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="">Scope: any</option>
            <option value="governance">governance</option>
            <option value="accounts">accounts</option>
            <option value="roles">roles</option>
            <option value="uploads">uploads</option>
            <option value="auth">auth</option>
          </select>
          <input className="px-2 py-1 rounded border border-white/20 bg-transparent" placeholder="Action or text" value={q} onChange={(e) => setQ(e.target.value)} />
          <button onClick={download} className="px-2 py-1 rounded border border-white/20 hover:bg-white/10">Export CSV</button>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white/5">
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Scope</th>
              <th className="text-left p-2">Action</th>
              <th className="text-left p-2">Actor</th>
              <th className="text-left p-2">Target</th>
              <th className="text-left p-2">Hash</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-2">{new Date(r.ts).toLocaleString()}</td>
                <td className="p-2">{r.scope}</td>
                <td className="p-2">{r.action}</td>
                <td className="p-2">{r.actor?.email ?? r.actor?.id ?? '—'}</td>
                <td className="p-2">{r.target?.label ?? r.target?.id ?? '—'}</td>
                <td className="p-2 font-mono text-xs break-all">{String(r.hash || '').slice(0, 12)}…</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td className="p-4 opacity-70" colSpan={6}>
                  No audit entries match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

