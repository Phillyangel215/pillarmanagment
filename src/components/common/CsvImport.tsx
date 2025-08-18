import React, { useRef, useState } from 'react'
import Papa from 'papaparse'

export function CsvImport({ onValidate, onImport }: { onValidate: (rows: any[]) => Promise<string[] | void> | (string[] | void); onImport: (rows: any[]) => Promise<void> | void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [rows, setRows] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [mode, setMode] = useState<'validate' | 'import'>('validate')

  const onFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => setRows(res.data as any[]),
    })
  }

  const run = async () => {
    if (mode === 'validate') {
      const errs = (await onValidate(rows)) || []
      setErrors(errs)
      alert(errs.length ? `Found ${errs.length} issues` : 'Looks good')
    } else {
      await onImport(rows)
      alert('Imported (demo)')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <input ref={inputRef} type="file" accept=".csv" onChange={e => onFiles(e.target.files)} />
        <select value={mode} onChange={e => setMode(e.target.value as any)} className="px-2 py-1 rounded-md bg-white/5 border border-white/10">
          <option value="validate">Validate only</option>
          <option value="import">Import</option>
        </select>
        <button onClick={run} className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5">Run</button>
      </div>
      {rows.length > 0 && (
        <div className="text-xs opacity-80">Rows: {rows.length}. Columns: {Object.keys(rows[0] || {}).join(', ')}</div>
      )}
      {errors.length > 0 && (
        <ul className="text-xs text-red-400 list-disc pl-4">
          {errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      )}
    </div>
  )
}

