type FundraisingSummary = { raised: number; pledges: number; donors: number; avgGift: number }
type HrSummary = { headcount: number; openPositions: number }
type ProgramsSummary = { activeClients: number; completionRate: number }
type GovernanceSummary = { upcomingMeetings: number; openMotions: number }

const isDemo = import.meta.env.VITE_DEMO === '1'

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export function getFundraisingSummary() {
  const url = isDemo ? '/api/summary/fundraising' : '/api/summary/fundraising'
  return getJson<FundraisingSummary>(url)
}

export function getHrSummary() {
  const url = isDemo ? '/api/summary/hr' : '/api/summary/hr'
  return getJson<HrSummary>(url)
}

export function getProgramsSummary() {
  const url = isDemo ? '/api/summary/programs' : '/api/summary/programs'
  return getJson<ProgramsSummary>(url)
}

export function getGovernanceSummary() {
  const url = isDemo ? '/api/summary/governance' : '/api/summary/governance'
  return getJson<GovernanceSummary>(url)
}

export type { FundraisingSummary, HrSummary, ProgramsSummary, GovernanceSummary }

