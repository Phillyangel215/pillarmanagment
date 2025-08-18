type FundraisingSummary = { raised: number; pledges: number; donors: number; avgGift: number }
type HrSummary = { headcount: number; openPositions: number }
type ProgramsSummary = { activeClients: number; completionRate: number }
type GovernanceSummary = { upcomingMeetings: number; openMotions: number }

const isDemo = import.meta.env.VITE_DEMO === '1'
import { apiJson } from '@/lib/http'

async function getJson<T>(path: string): Promise<T> {
  return apiJson<T>(path)
}

export function getFundraisingSummary() {
  const path = isDemo ? '/summary/fundraising' : '/summary/fundraising'
  return getJson<FundraisingSummary>(path)
}

export function getHrSummary() {
  const path = isDemo ? '/summary/hr' : '/summary/hr'
  return getJson<HrSummary>(path)
}

export function getProgramsSummary() {
  const path = isDemo ? '/summary/programs' : '/summary/programs'
  return getJson<ProgramsSummary>(path)
}

export function getGovernanceSummary() {
  const path = isDemo ? '/summary/governance' : '/summary/governance'
  return getJson<GovernanceSummary>(path)
}

export type { FundraisingSummary, HrSummary, ProgramsSummary, GovernanceSummary }
