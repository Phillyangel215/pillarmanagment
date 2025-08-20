import React, { useState } from 'react'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export type Notification = {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  timestamp?: string
  actionUrl?: string
}

export interface TopBarProps {
  user: User
  notifications?: Notification[]
  unreadCount?: number
  onLogout?: () => void
  onNotificationClick?: (notification: Notification) => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  showSearch?: boolean
  onSearch?: (query: string) => void
  className?: string
}

export function TopBar({ user, notifications = [], unreadCount = 0, onLogout, showSearch = false, onSearch, className = '' }: TopBarProps) {
  const [query, setQuery] = useState('')
  return (
    <header className={[
      'flex items-center justify-between h-16 px-6 bg-surface border-b border-surface-4 sticky top-0 z-40',
      className
    ].join(' ')}>
      <div className="flex items-center gap-3 flex-1">
        {showSearch && (
          <form onSubmit={(e) => { e.preventDefault(); onSearch?.(query) }} className="max-w-md w-full">
            <input
              id="global-search"
              aria-label="Search"
              className="w-full px-3 py-2 bg-surface-2 border border-surface-4 rounded-md"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        )}
      </div>
      <nav className="hidden md:flex gap-3 text-sm text-muted mr-4">
        <a href="https://github.com/phillyangel215/pillarmanagment/issues" className="hover:text-text">Help & Status</a>
        <a href="#/legal/terms" className="hover:text-text">Terms</a>
        <a href="#/legal/privacy" className="hover:text-text">Privacy</a>
      </nav>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-md border border-surface-4 text-muted hover:text-text">
          <span className="sr-only">Notifications</span>
          {unreadCount ? <span className="absolute -top-1 -right-1 text-xs bg-error text-white rounded-full px-1">{unreadCount}</span> : null}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-4.5-4.5c-.4-.4-1-.4-1.4 0L10.5 17H15zm-9-4c0-3.5 2.5-6.5 6-7v-1a1 1 0 112 0v1c3.5.5 6 3.5 6 7v4.5l2 2v.5H4v-.5l2-2V13z" /></svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-muted">{user.role}</div>
          </div>
          <button onClick={onLogout} className="px-2 py-1 text-sm border border-surface-4 rounded-md hover:bg-surface-2">Logout</button>
        </div>
      </div>
    </header>
  )
}

