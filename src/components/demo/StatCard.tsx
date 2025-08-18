import React from 'react'

type StatCardProps = {
  label: string
  value: string | number
  sublabel?: string
}

export default function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <div className="rounded-md border border-white/10 p-3 bg-white/5">
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {sublabel && <div className="text-xs opacity-60">{sublabel}</div>}
    </div>
  )
}

