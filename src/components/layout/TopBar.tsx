/**
 * @fileoverview TopBar - Production-ready application header
 * @description Top navigation bar with user menu, notifications, and global actions
 * @accessibility WCAG AA+ compliant with keyboard navigation and screen reader support
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react'
import NotificationBell from '@/components/common/NotificationBell'
import RoleSwitcher from '@/components/common/RoleSwitcher'
import CreateUserButton from '@/components/common/CreateUserButton'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  avatar?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  timestamp: string
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

export function TopBar({
  user,
  notifications = [],
  unreadCount = 0,
  onLogout,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  showSearch = false,
  onSearch,
  className = ''
}: TopBarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim())
    }
  }

  // Handle keyboard navigation for dropdowns
  const handleKeyDown = (e: React.KeyboardEvent, type: 'user' | 'notifications') => {
    if (e.key === 'Escape') {
      if (type === 'user') setIsUserMenuOpen(false)
      if (type === 'notifications') setIsNotificationsOpen(false)
    }
  }

  // Format notification timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  // Get notification icon
  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      info: (
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      success: (
        <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5 text-error" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    }
    return icons[type]
  }

  const topBarClasses = [
    'flex items-center justify-between',
    'h-16 px-6 bg-surface border-b border-surface-4',
    'sticky top-0 z-40',
    className
  ].join(' ')

  return (
    <header className={topBarClasses} role="banner">
      {/* Left section - Search */}
      <div className="flex items-center gap-4 flex-1">
        {showSearch && (
          <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-muted" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                className={[
                  'block w-full pl-10 pr-3 py-2',
                  'bg-surface-2 border border-surface-4 rounded-lg',
                  'text-text placeholder-muted',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                  'transition-colors duration-200'
                ].join(' ')}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
              />
            </div>
          </form>
        )}
      </div>

      {/* Right section - Notifications and User Menu */}
      <div className="flex items-center gap-2">
        {/* Dev Tools */}
        <CreateUserButton />
        <RoleSwitcher />
        
        {/* Notifications */}
        <NotificationBell />

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            onKeyDown={(e) => handleKeyDown(e, 'user')}
            className={[
              'flex items-center gap-3 p-2 rounded-lg',
              'text-text hover:bg-surface-2 transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50'
            ].join(' ')}
            aria-label="User menu"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            {/* User avatar */}
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* User info */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-text">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted">
                {user.role.replace(/_/g, ' ')}
              </p>
            </div>

            {/* Chevron */}
            <svg 
              className={`w-4 h-4 text-muted transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* User dropdown menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-2 border border-surface-4 rounded-lg shadow-lg z-50">
              {/* User info header */}
              <div className="p-4 border-b border-surface-4">
                <p className="text-sm font-medium text-text">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted">{user.email}</p>
                <p className="text-xs text-muted mt-1">
                  {user.role.replace(/_/g, ' ')}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    onProfileClick?.()
                    setIsUserMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text hover:bg-surface-3 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>

                <button
                  onClick={() => {
                    onSettingsClick?.()
                    setIsUserMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text hover:bg-surface-3 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>

                <div className="border-t border-surface-4 my-2" />

                <button
                  onClick={() => {
                    onLogout?.()
                    setIsUserMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-error hover:bg-surface-3 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// Usage examples for documentation:
/*
<TopBar
  user={{
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@pillar.org',
    role: 'PROGRAM_DIRECTOR',
    avatar: '/avatars/john-doe.jpg'
  }}
  notifications={[
    {
      id: '1',
      title: 'New client intake',
      message: 'Sarah Johnson has completed the intake process',
      type: 'info',
      isRead: false,
      timestamp: '2024-01-15T10:30:00Z'
    }
  ]}
  unreadCount={3}
  showSearch
  onSearch={(query) => console.log('Search:', query)}
  onLogout={() => console.log('Logout')}
  onProfileClick={() => console.log('Profile')}
  onSettingsClick={() => console.log('Settings')}
  onNotificationClick={(notification) => console.log('Notification:', notification)}
/>
*/