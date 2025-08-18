import { seedPRNG } from './prng'

export type ScenarioKey = 'happy_path' | 'empty_org' | 'fire_drill' | 'board_meeting' | 'audit_mode'
export type DemoClock = { nowISO?: string; tz?: string }

export function buildScenario(key: ScenarioKey, clock?: DemoClock) {
  const rand = seedPRNG(1337 + key.length)
  const now = clock?.nowISO ? new Date(clock.nowISO) : new Date()

  return {
    notifications: [
      {
        id: 'n1',
        title: 'New intake submitted',
        body: 'Client: J. Rivera',
        read: false,
        created_at: new Date(+now - 60 * 60e3).toISOString(),
      },
      {
        id: 'n2',
        title: 'Grant report due',
        body: 'HUD Q4 draft',
        read: key === 'empty_org',
        created_at: new Date(+now - 2 * 24 * 60 * 60e3).toISOString(),
      },
      {
        id: 'n3',
        title: 'Training expiring',
        body: 'HIPAA cert – 7 days',
        read: true,
        created_at: new Date(+now - 5 * 24 * 60 * 60e3).toISOString(),
      },
    ],
    fundraising: {
      goal: 250000,
      raised: Math.round(150000 + 50000 * rand()),
      donors: 600 + Math.floor(50 * rand()),
      avgGift: 140 + 10 * rand(),
      lybunt: 80,
      sybunt: 45,
    },
    hr: {
      headcount: 56,
      openings: key === 'fire_drill' ? 12 : 7,
      onboarding: 9,
      complianceRate: key === 'audit_mode' ? 0.81 : 0.92,
      expiringCerts: key === 'audit_mode' ? 14 : 5,
    },
    programs: {
      active: 11,
      capacityUsed: key === 'fire_drill' ? 0.93 : 0.78,
      waitlist: key === 'empty_org' ? 0 : 43,
      outcomesYtd: 0.66,
    },
    governance: {
      meetingsThisQuarter: key === 'board_meeting' ? 4 : 3,
      agendaReady: true,
      minutesPending: key === 'board_meeting' ? 2 : 1,
      packetsOut: 2,
    },
    tasks: [
      { id: 't1', title: 'Follow up with landlord', done: false },
      { id: 't2', title: 'Review intake docs', done: key === 'happy_path' },
    ],
    clock,
  }
}

