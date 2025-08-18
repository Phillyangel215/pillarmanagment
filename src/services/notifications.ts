import { supabase } from '@/lib/supabase'

export type Notification = {
	id: string
	title: string
	body?: string
	read: boolean
	created_at: string
}

export async function listNotifications(signal?: AbortSignal): Promise<Notification[]> {
	// TODO: replace with real table name 'notifications'
	let query = supabase
		.from('notifications')
		.select('id, title, body, read, created_at')
		.order('created_at', { ascending: false })

	if (signal) {
		query = query.abortSignal(signal)
	}

	const { data, error } = await query
	if (error) throw error
	return data ?? []
}

export async function unreadCount(signal?: AbortSignal): Promise<number> {
	let query = supabase
		.from('notifications')
		.select('id', { count: 'exact', head: true })
		.eq('read', false)

	if (signal) {
		query = query.abortSignal(signal)
	}

	const { error, count } = await query
	if (error) throw error
	return count ?? 0
}

export async function markRead(id: string): Promise<void> {
	const { error } = await supabase
		.from('notifications')
		.update({ read: true })
		.eq('id', id)
	if (error) throw error
}
