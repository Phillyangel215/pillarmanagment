import React, { useMemo, useRef, useState } from 'react'
import { putObject } from '@/services/uploads'

type Item = { file: File; status: 'queued'|'scanned'|'ready'|'error'; message?: string; key?: string }

export default function UploadBox({ accept = '*/*' }: { accept?: string }) {
  const [items, setItems] = useState<Item[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onFiles = (files: FileList | null) => {
    if (!files) return
    const newItems: Item[] = Array.from(files).map(f => ({ file: f, status: 'queued' }))
    setItems(prev => [...prev, ...newItems])
    newItems.forEach(async (it) => {
      try {
        const res = await putObject(it.file)
        setItems(prev => prev.map(p => p === it ? { ...p, status: 'ready', key: res.key } : p))
      } catch (e: any) {
        setItems(prev => prev.map(p => p === it ? { ...p, status: 'error', message: String(e?.message || e) } : p))
      }
    })
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onFiles(e.dataTransfer.files)
  }

  const remove = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx))

  const acceptPretty = useMemo(() => accept.split(',').map(s => s.trim()).join(', '), [accept])

  return (
    <div className="space-y-2">
      <div
        className="border border-dashed border-white/20 rounded-md p-6 text-center cursor-pointer hover:bg-white/5"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
      >
        <div>Drag & drop files here, or click to select</div>
        <div className="text-xs opacity-70">Allowed: {acceptPretty}. Max 25MB</div>
        <input ref={inputRef} type="file" multiple accept={accept} className="hidden" onChange={e => onFiles(e.target.files)} />
      </div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between border border-white/10 rounded px-2 py-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="opacity-80">{it.file.name}</span>
              <span className="text-xs opacity-60">{(it.file.size/1024).toFixed(1)} KB</span>
              <span className="text-xs">{it.status}</span>
              {it.message && <span className="text-xs text-red-400">{it.message}</span>}
            </div>
            <button onClick={() => remove(i)} className="px-2 py-1 rounded-md border border-white/10 hover:bg-white/5">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

