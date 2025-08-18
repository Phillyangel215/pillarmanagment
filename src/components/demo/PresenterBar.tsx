import React, { useMemo, useState } from 'react'
import RoleSwitcher from '@/components/common/RoleSwitcher'
import CreateUserButton from '@/components/common/CreateUserButton'

type DemoScenarioKey = 'happy_path'|'empty_org'|'fire_drill'|'board_meeting'|'audit_mode'

export default function PresenterBar() {
  if (import.meta.env.VITE_DEMO !== '1') return null
  const scenarios: Array<{ key: DemoScenarioKey; label: string }> = useMemo(() => ([
    { key: 'happy_path', label: 'Happy Path' },
    { key: 'empty_org', label: 'Empty Org' },
    { key: 'fire_drill', label: 'Fire Drill' },
    { key: 'board_meeting', label: 'Board Meeting' },
    { key: 'audit_mode', label: 'Audit Mode' },
  ]), [])
  const [latency, setLatency] = useState<number>(150)
  const [jitter, setJitter] = useState<number>(50)
  const [scenario, setScenario] = useState<DemoScenarioKey>('happy_path')
  const onReset = () => {
    (window as any).__DEMO_RESET__?.()
    // reload to reflect state reset
    window.location.reload()
  }
  const onApplyNet = () => {
    try { (window as any).__DEMO_LATENCY__?.(Math.max(0, Number(latency) || 0), Math.max(0, Number(jitter) || 0)) } catch {}
  }
  const onScenarioChange = (key: DemoScenarioKey) => {
    setScenario(key)
    try { (window as any).__DEMO_SCENARIO__?.(key) } catch {}
  }
  return (
    <div className="flex flex-col gap-2 rounded-md border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs rounded bg-amber-500/20 border border-amber-500/30">DEMO MODE</span>
          <button onClick={onReset} className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5">
            Reset
          </button>
          <label className="text-sm opacity-80">Scenario</label>
          <select
            className="px-2 py-1 rounded-md bg-transparent border border-white/10"
            value={scenario}
            onChange={(e) => onScenarioChange(e.target.value as DemoScenarioKey)}
          >
            {scenarios.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <CreateUserButton />
        </div>
        <RoleSwitcher />
      </div>
      <div className="flex items-center gap-2 text-sm opacity-90">
        <span>Network:</span>
        <label className="flex items-center gap-1">
          <span>Latency</span>
          <input type="number" className="w-20 px-2 py-1 rounded-md bg-transparent border border-white/10"
            value={latency}
            onChange={(e) => setLatency(Number(e.target.value))}
          />
          <span>ms</span>
        </label>
        <label className="flex items-center gap-1">
          <span>Jitter</span>
          <input type="number" className="w-20 px-2 py-1 rounded-md bg-transparent border border-white/10"
            value={jitter}
            onChange={(e) => setJitter(Number(e.target.value))}
          />
          <span>ms</span>
        </label>
        <button onClick={onApplyNet} className="px-3 py-1 rounded-md border border-white/10 hover:bg-white/5">
          Apply
        </button>
      </div>
    </div>
  )
}

