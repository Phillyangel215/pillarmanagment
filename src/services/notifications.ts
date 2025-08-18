export type NotificationItem = {
	id: string
	title: string
	message: string
	type: 'info' | 'success' | 'warning' | 'error'
	isRead: boolean
	timestamp: string
}

const isDemo = import.meta.env.VITE_DEMO === '1'
import { apiJson } from '@/lib/http'

export async function listNotifications(): Promise<NotificationItem[]> {
	if (isDemo) {
		const data = await apiJson<{ items: NotificationItem[] }>(`/notifications`)
		return data.items
	}
	const data = await apiJson<{ items: NotificationItem[] }>(`/notifications`)
	return data.items
}

export async function getUnreadCount(): Promise<number> {
	if (isDemo) {
		const data = await apiJson<{ count: number }>(`/notifications/unreadCount`)
		return data.count
	}
	const data = await apiJson<{ count: number }>(`/notifications/unread-count`)
	return data.count
}

export async function markRead(ids: string[]): Promise<void> {
	if (isDemo) {
		await apiJson<{ ok: boolean }>(`/notifications/markRead`, { method: 'POST', body: { ids } })
		return
	}
	for (const id of ids) {
		await apiJson<{ ok: boolean }>(`/notifications/mark-read/${encodeURIComponent(id)}`, { method: 'POST' })
	}
}
