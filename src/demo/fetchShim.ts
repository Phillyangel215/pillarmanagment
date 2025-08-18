import { buildSeedData, type DemoNotification, type DemoSummary } from './seed'

type DemoState = {
	notifications: DemoNotification[]
	summary: DemoSummary
}

const STORAGE_KEY = '__demo_state__'

function loadState(): DemoState {
	const raw = localStorage.getItem(STORAGE_KEY)
	if (raw) {
		try {
			return JSON.parse(raw)
		} catch (e) {
			console.warn('Failed to parse demo state from storage', e)
		}
	}
	const seed = buildSeedData()
	const state: DemoState = { notifications: seed.notifications, summary: seed.summary }
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
	return state
}

function saveState(state: DemoState) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

type ResponseInitLike = { status?: number; headers?: Record<string,string> }
function jsonResponse(data: unknown, init?: ResponseInitLike): Response {
	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' },
		...init,
	})
}

export function installFetchShim() {
	const originalFetch = window.fetch.bind(window)
	let state = loadState()

	type RequestInfoLike = string | URL | { url: string; method?: string }
	type RequestInitLike = { method?: string; headers?: Record<string,string>; body?: string }
	async function handleRequest(input: RequestInfoLike, init?: RequestInitLike) {
		const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
		const method = (init?.method || (typeof input !== 'string' && !(input instanceof URL) ? input.method : 'GET')).toUpperCase()

		// Notifications endpoints (legacy + new)
		if (url.startsWith('/api/notifications') || url.startsWith('/notifications')) {
			if (method === 'GET') {
				if (url.endsWith('/unreadCount') || url.endsWith('/unread-count')) {
					const count = state.notifications.filter(n => !n.isRead).length
					return jsonResponse({ count })
				}
				return jsonResponse({ items: state.notifications })
			}
			if (method === 'POST' && (url.endsWith('/markRead') || url.endsWith('/mark-read') || /\/mark-read\//.test(url))) {
				let ids: string[] = []
				if (/\/mark-read\//.test(url)) {
					const id = url.split('/').pop() || ''
					ids = id ? [id] : []
				} else {
					const body = init?.body ? JSON.parse(String(init.body)) : { ids: [] as string[] }
					ids = Array.isArray((body as { ids?: unknown }).ids) ? (body as { ids: string[] }).ids : []
				}
				state.notifications = state.notifications.map(n => ids.includes(n.id) ? { ...n, isRead: true } : n)
				saveState(state)
				return jsonResponse({ ok: true })
			}
		}

		// Summary endpoints (legacy + new)
		if (url.startsWith('/api/summary/') || url.startsWith('/summary/')) {
			const segment = url.split('/').pop()
			switch (segment) {
				case 'fundraising':
					return jsonResponse(state.summary.fundraising)
				case 'hr':
					return jsonResponse(state.summary.hr)
				case 'programs':
					return jsonResponse(state.summary.programs)
				case 'governance':
					return jsonResponse(state.summary.governance)
			}
		}

		// Accounts provisioning (demo success)
		if ((url === '/api/accounts' || url === '/accounts') && method === 'POST') {
			return jsonResponse({ ok: true, id: 'demo-user-1' }, { status: 201 })
		}

		return originalFetch(
			input as unknown as Parameters<typeof window.fetch>[0],
			init as unknown as Parameters<typeof window.fetch>[1]
		)
	}

	window.fetch = handleRequest as unknown as typeof window.fetch

	return {
		reset() {
			state = loadState()
		}
	}
}

export function resetDemoState() {
	localStorage.removeItem(STORAGE_KEY)
}
