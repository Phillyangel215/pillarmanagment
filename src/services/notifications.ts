type NotificationItem = {
	id: string
	title: string
	message: string
	type: 'info' | 'success' | 'warning' | 'error'
	isRead: boolean
	timestamp: string
}

const isDemo = import.meta.env.VITE_DEMO === '1'

type RequestInitLike = { method?: string; headers?: Record<string,string>; body?: string }
async function getJson<T>(url: string, init?: RequestInitLike): Promise<T> {
	const res = await fetch(url as unknown as Parameters<typeof window.fetch>[0], init as unknown as Parameters<typeof window.fetch>[1])
	if (!res.ok) throw new Error(`Request failed: ${res.status}`)
	return res.json() as Promise<T>
}

export async function listNotifications(): Promise<NotificationItem[]> {
	const url = isDemo ? '/api/notifications' : '/api/notifications'
	const data = await getJson<{ items: NotificationItem[] }>(url)
	return data.items
}

export async function getUnreadCount(): Promise<number> {
	const url = isDemo ? '/api/notifications/unreadCount' : '/api/notifications/unreadCount'
	const data = await getJson<{ count: number }>(url)
	return data.count
}

export async function markRead(ids: string[]): Promise<void> {
	const url = isDemo ? '/api/notifications/markRead' : '/api/notifications/markRead'
	await getJson<{ ok: boolean }>(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids }),
	})
}

