import React from 'react'

type Column<Row> = { key: keyof Row; header: string }

export function CsvExport<Row extends Record<string, unknown>>({ rows, columns, filename = 'export.csv' }: { rows: Row[]; columns: Column<Row>[]; filename?: string }) {
  const onClick = () => {
    const header = columns.map(c => c.header).join(',')
    const body = rows.map(r => columns.map(c => {
      const v = r[c.key]
      if (v == null) return ''
      if (typeof v === 'object') return JSON.stringify(v)
      const s = String(v)
      return s.includes(',') ? `"${s.replace(/"/g, '""')}"` : s
    }).join(',')).join('\n')
    const csv = [header, body].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  return <button onClick={onClick} className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5">Export CSV</button>
}

