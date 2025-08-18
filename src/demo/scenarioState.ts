export type FaultMap = Record<string, { failRate?: number; status?: number }>
export type NetSim = { latencyMs: number; jitterMs: number; faults: FaultMap }
export type DemoState = {
  scenario: 'happy_path' | 'empty_org' | 'fire_drill' | 'board_meeting' | 'audit_mode'
  clock?: { nowISO?: string }
  net: NetSim
}

export const defaultState: DemoState = {
  scenario: 'happy_path',
  net: { latencyMs: 200, jitterMs: 100, faults: {} },
}

