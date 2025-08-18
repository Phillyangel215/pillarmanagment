import { loadDB, saveDB, resetDB } from './store'
import { buildScenario, type ScenarioKey } from './scenarios'
import { defaultState, type DemoState } from './scenarioState'
import { bus } from './bus'

type NotificationItem = {
	id: string
	title: string
	message: string
	type: 'info' | 'success' | 'warning' | 'error'
	isRead: boolean
	timestamp: string
}

// Define stricter types for our in-memory demo DB
type TaskItem = { id: string; title: string; done: boolean }
type ScenarioShape = {
	notifications?: Array<{
		id?: string
		title?: string
		body?: string
		message?: string
		type?: NotificationItem['type']
		read?: boolean
		isRead?: boolean
		created_at?: string
		timestamp?: string
	}>
	tasks?: TaskItem[]
	fundraising?: { raised?: number; donors?: number; avgGift?: number }
	hr?: { headcount?: number; openings?: number }
	programs?: { active?: number; outcomesYtd?: number }
	governance?: { meetingsThisQuarter?: number; minutesPending?: number }
}
type InternalState = DemoState & { db: { scenario?: ScenarioShape; notifications?: NotificationItem[]; tasks?: TaskItem[] } }

function jitter(ms: number, j: number) {
	return ms + Math.floor(Math.random() * j - j / 2)
}

async function netHold(state: InternalState) {
	await new Promise((r) => setTimeout(r, jitter(state.net.latencyMs, state.net.jitterMs)))
}

function maybeFault(state: InternalState, url: string) {
	const entry = Object.entries(state.net.faults || {}).find(([k]) => url.includes(k))?.[1]
	if (entry && Math.random() <= (entry.failRate || 0)) return new Response('Injected fault', { status: entry.status || 500 })
}

function json(data: unknown, status = 200, state?: InternalState) {
	if (state) saveDB(state)
	return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

function scenarioToNotifications(sc: ScenarioShape): NotificationItem[] {
	const items: NotificationItem[] = (sc.notifications || []).map((n, idx: number) => ({
		id: n.id || `n-${idx + 1}`,
		title: n.title || 'Notification',
		message: n.body || n.message || '',
		type: n.type || 'info',
		isRead: Boolean(n.read ?? n.isRead),
		timestamp: n.created_at || n.timestamp || new Date().toISOString(),
	}))
	return items
}

function reseedFromScenario(state: InternalState) {
	const sc = buildScenario(state.scenario as ScenarioKey, state.clock) as ScenarioShape
	state.db = state.db || {}
	state.db.scenario = sc
	state.db.notifications = scenarioToNotifications(sc)
	state.db.tasks = Array.isArray(sc.tasks) ? sc.tasks.slice() : []
}

function fundraisingSummary(state: InternalState) {
	const f = state.db?.scenario?.fundraising || {}
	const raised = Math.round(Number(f.raised || 0))
	const donors = Number(f.donors || 0)
	const avgGift = Number(f.avgGift || 0)
	const pledges = Math.max(0, Math.round(raised * 0.22))
	return { raised, pledges, donors, avgGift }
}

function hrSummary(state: InternalState) {
	const h = state.db?.scenario?.hr || {}
	return { headcount: Number(h.headcount || 0), openPositions: Number(h.openings || 0) }
}

function programsSummary(state: InternalState) {
	const p = state.db?.scenario?.programs || {}
	const active = Number(p.active || 0)
	const activeClients = active * 30
	const completionRate = Number(p.outcomesYtd ?? 0)
	return { activeClients, completionRate }
}

function governanceSummary(state: InternalState) {
	const g = state.db?.scenario?.governance || {}
	return { upcomingMeetings: Number(g.meetingsThisQuarter || 0), openMotions: Number(g.minutesPending || 0) }
}

export function installFetchShim() {
	const original = window.fetch.bind(window)
	let state: InternalState = loadDB<InternalState>({ ...(defaultState as InternalState), db: buildScenario(defaultState.scenario) as unknown as InternalState['db'] })
	// On first install in this versioned store, ensure normalized db
	if (!state.db || !Array.isArray(state.db.notifications)) {
		reseedFromScenario(state)
		saveDB(state)
	}

	async function handleRequest(input: string | URL | { url: string; method?: string }, init?: { method?: string; headers?: Record<string, string>; body?: string }) {
		const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
		const method = (init?.method || (typeof input !== 'string' && !(input instanceof URL) ? input.method : 'GET')).toUpperCase()

		if (!url.startsWith('/api/')) {
			return original(input as unknown as Parameters<typeof window.fetch>[0], init as unknown as Parameters<typeof window.fetch>[1])
		}

		await netHold(state)
		const fault = maybeFault(state, url)
		if (fault) return fault

		// Notifications
		if (url.startsWith('/api/notifications')) {
			if (method === 'GET') {
				if (url.endsWith('/unreadCount') || url.endsWith('/unread-count')) {
					const count = (state.db.notifications as NotificationItem[]).filter((n) => !n.isRead).length
					return json({ count }, 200, state)
				}
				return json({ items: state.db.notifications as NotificationItem[] }, 200, state)
			}
			if (method === 'POST') {
				if (url.endsWith('/markRead')) {
					const body = init?.body ? (JSON.parse(String(init.body)) as Partial<{ ids: unknown }>) : { ids: [] as string[] }
					const maybeIds = body?.ids
					const ids: string[] = Array.isArray(maybeIds) ? (maybeIds as string[]) : []
					state.db.notifications = (state.db.notifications as NotificationItem[]).map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n))
					bus.emit({ type: 'notifications.changed' })
					return json({ ok: true }, 200, state)
				}
				if (/\/api\/notifications\/mark-read\/.+/.test(url)) {
					const id = url.split('/').pop() as string
					state.db.notifications = (state.db.notifications as NotificationItem[]).map((n) => (n.id === id ? { ...n, isRead: true } : n))
					bus.emit({ type: 'notifications.changed' })
					return json({ ok: true }, 200, state)
				}
			}
		}

		// Summaries
		if (url.startsWith('/api/summary/')) {
			const segment = url.split('/').pop()
			switch (segment) {
				case 'fundraising':
					return json(fundraisingSummary(state), 200, state)
				case 'hr':
					return json(hrSummary(state), 200, state)
				case 'programs':
					return json(programsSummary(state), 200, state)
				case 'governance':
					return json(governanceSummary(state), 200, state)
			}
		}

		// Accounts
		if (url === '/api/accounts' && method === 'POST') {
			const id = `demo-user-${Date.now()}`
			return json({ ok: true, id }, 201, state)
		}

		// Demo tasks
		if (url.endsWith('/api/tasks') && method === 'POST') {
			const body = init?.body ? (JSON.parse(String(init.body)) as Partial<{ title: unknown }>) : {}
			const id = `t${Date.now()}`
			state.db.tasks = Array.isArray(state.db.tasks) ? state.db.tasks : []
			state.db.tasks.push({ id, title: typeof body.title === 'string' ? body.title : 'New Task', done: false })
			bus.emit({ type: 'tasks.changed' })
			return json({ ok: true, id }, 201, state)
		}
		if (/\/api\/tasks\/complete\/.+/.test(url) && method === 'POST') {
			const id = url.split('/').pop() as string
			const task = (state.db.tasks || []).find((t: TaskItem) => t.id === id)
			if (task) task.done = true
			bus.emit({ type: 'tasks.changed' })
			return json({ ok: true }, 200, state)
		}

		return original(input as unknown as Parameters<typeof window.fetch>[0], init as unknown as Parameters<typeof window.fetch>[1])
	}

	window.fetch = handleRequest as unknown as typeof window.fetch

	// Expose lightweight controller
	;(window as unknown as { __DEMO__?: unknown }).__DEMO__ = {
		getState: () => JSON.parse(JSON.stringify(state)) as InternalState,
		setScenario: (key: ScenarioKey, clock?: { nowISO?: string }) => {
			state.scenario = key
			if (clock) state.clock = clock
			reseedFromScenario(state)
			saveDB(state)
			bus.emit({ type: 'demo.state.changed' })
		},
		setClock: (nowISO?: string) => {
			state.clock = { nowISO }
			reseedFromScenario(state)
			saveDB(state)
			bus.emit({ type: 'demo.state.changed' })
		},
		setNet: (net: Partial<InternalState['net']>) => {
			state.net = { ...state.net, ...(net as Partial<InternalState['net']>), faults: net.faults ?? state.net.faults }
			saveDB(state)
		},
		clearFaults: () => {
			state.net.faults = {}
			saveDB(state)
		},
		reset: () => {
			state = { ...(defaultState as InternalState), db: {} as InternalState['db'] }
			reseedFromScenario(state)
			saveDB(state)
			bus.emit({ type: 'demo.state.changed' })
		},
	}

	return {
		reset() {
			;(window as unknown as { __DEMO__?: { reset?: () => void } }).__DEMO__?.reset?.()
		},
	}
}

export function resetDemoState() {
	try {
		localStorage.removeItem('__demo_state__')
	} catch {
		// ignore storage errors
	}
	resetDB()
}
