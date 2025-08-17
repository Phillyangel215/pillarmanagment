import React, { useEffect, useState } from 'react'
import StatCard from './StatCard'
import { getFundraisingSummary, getHrSummary, getProgramsSummary, getGovernanceSummary } from '@/services/summary'

export default function DemoDashboardRow() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getFundraisingSummary(),
      getHrSummary(),
      getProgramsSummary(),
      getGovernanceSummary(),
    ])
      .then(([fundraising, hr, programs, governance]) => {
        if (!cancelled) setData({ fundraising, hr, programs, governance })
      })
      .catch((e) => !cancelled && setError(String(e)))
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return <div className="text-error">{error}</div>
  if (!data) return <div className="opacity-60">Loading KPIs…</div>

  const kpis = [
    { label: 'Raised', value: `$${(data.fundraising.raised).toLocaleString()}` },
    { label: 'Pledges', value: `$${(data.fundraising.pledges).toLocaleString()}` },
    { label: 'Donors', value: data.fundraising.donors },
    { label: 'Avg Gift', value: `$${(data.fundraising.avgGift).toLocaleString()}` },
    { label: 'Headcount', value: data.hr.headcount },
    { label: 'Open Roles', value: data.hr.openPositions },
    { label: 'Active Clients', value: data.programs.activeClients },
    { label: 'Completion', value: `${Math.round(data.programs.completionRate * 100)}%` },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
      {kpis.map((kpi) => (
        <StatCard key={kpi.label} label={kpi.label} value={kpi.value} />
      ))}
    </div>
  )
}

