import { useCallback, useEffect, useMemo, useState } from 'react'
import { listNotifications, unreadCount, type Notification } from '@/services/notifications'
import { useInterval } from '@/lib/useInterval'

export function useUnreadCount() {
	const [count, setCount] = useState<number>(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<unknown>(null)

	const refetch = useCallback(async () => {
		const c = new AbortController()
		try { setCount(await unreadCount(c.signal)) } finally { c.abort() }
	}, [])

	useEffect(() => {
		const c = new AbortController()
		setLoading(true)
		unreadCount(c.signal)
			.then(setCount)
			.catch(setError)
			.finally(() => setLoading(false))
		return () => c.abort()
	}, [])

	// Poll every 30 seconds after initial load
	useInterval(() => refetch(), loading ? null : 30000)

	// Refetch on visibility change and focus
	useEffect(() => {
		const onFocus = () => document.visibilityState === 'visible' && refetch()
		window.addEventListener('visibilitychange', onFocus)
		window.addEventListener('focus', onFocus)
		return () => {
			window.removeEventListener('visibilitychange', onFocus)
			window.removeEventListener('focus', onFocus)
		}
	}, [refetch])

	return { count, loading, error, refetch }
}

export function useNotifications() {
	const [items, setItems] = useState<Notification[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<unknown>(null)

	useEffect(() => {
		const c = new AbortController()
		setLoading(true)
		listNotifications(c.signal)
			.then(setItems)
			.catch(setError)
			.finally(() => setLoading(false))
		return () => c.abort()
	}, [])

	return useMemo(() => ({ items, loading, error, setItems }), [items, loading, error])
}
