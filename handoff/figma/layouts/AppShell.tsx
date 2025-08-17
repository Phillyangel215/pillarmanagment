/**
 * @fileoverview AppShell - Production-ready application layout
 * @description Main application shell combining TopBar and Sidebar with responsive behavior
 * @accessibility WCAG AA+ compliant with proper landmark regions and skip links
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { TopBar, type User, type Notification } from './TopBar'
import { Sidebar, type UserRole } from './Sidebar'

export interface AppShellProps {
  user: User & { role: UserRole }
  children: React.ReactNode
  notifications?: Notification[]
  unreadCount?: number
  currentPath?: string
  showSearch?: boolean
  onLogout?: () => void
  onNotificationClick?: (notification: Notification) => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
  onNavigate?: (href: string) => void
  onSearch?: (query: string) => void
  className?: string
}

export function AppShell({
  user,
  children,
  notifications = [],
  unreadCount = 0,
  currentPath = '',
  showSearch = false,
  onLogout,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onNavigate,
  onSearch,
  className = ''
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarCollapsed(true)
        setSidebarOpen(false)
      }
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [currentPath, isMobile])

  // Handle navigation with mobile sidebar closing
  const handleNavigate = (href: string) => {
    onNavigate?.(href)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  // Toggle sidebar collapse/expand
  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const shellClasses = [
    'flex h-screen bg-surface text-text overflow-hidden',
    className
  ].join(' ')

  return (
    <div className={shellClasses}>
      {/* Skip links for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'relative z-50',
          isMobile ? [
            'fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          ] : [
            'flex-shrink-0 transition-all duration-300',
            sidebarCollapsed ? 'w-16' : 'w-64'
          ]
        ].flat().join(' ')}
        aria-label="Navigation sidebar"
      >
        <Sidebar
          currentUserRole={user.role}
          currentPath={currentPath}
          isCollapsed={sidebarCollapsed && !isMobile}
          onToggleCollapse={handleToggleSidebar}
          onNavigate={handleNavigate}
        />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <TopBar
          user={user}
          notifications={notifications}
          unreadCount={unreadCount}
          onLogout={onLogout}
          onNotificationClick={onNotificationClick}
          onProfileClick={onProfileClick}
          onSettingsClick={onSettingsClick}
          showSearch={showSearch}
          onSearch={onSearch}
        />

        {/* Mobile menu button */}
        {isMobile && (
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="fixed top-4 left-4 z-30 p-2 rounded-md bg-surface-2 border border-surface-4 text-text hover:bg-surface-3 transition-colors"
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sidebarOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {sidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        )}

        {/* Main content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto focus:outline-none"
          tabIndex={-1}
          role="main"
          aria-label="Main content"
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Screen reader announcements for navigation changes */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {currentPath && `Navigated to ${currentPath}`}
      </div>
    </div>
  )
}

// Responsive layout hook for child components
export function useAppShell() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  
  useEffect(() => {
    const checkBreakpoints = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    checkBreakpoints()
    window.addEventListener('resize', checkBreakpoints)
    return () => window.removeEventListener('resize', checkBreakpoints)
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet
  }
}

// Layout variants for different content types
export interface LayoutProps {
  children: React.ReactNode
  className?: string
}

// Standard content layout with max width
export function ContentLayout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  )
}

// Full width layout for dashboards
export function FullWidthLayout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  )
}

// Centered layout for forms and focused content
export function CenteredLayout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {children}
    </div>
  )
}

// Two column layout
export interface TwoColumnLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
  sidebarWidth?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TwoColumnLayout({ 
  sidebar, 
  children, 
  sidebarWidth = 'md',
  className = '' 
}: TwoColumnLayoutProps) {
  const sidebarWidthClasses = {
    sm: 'lg:w-64',
    md: 'lg:w-80',
    lg: 'lg:w-96'
  }

  return (
    <div className={`flex flex-col lg:flex-row gap-6 ${className}`}>
      <aside className={`lg:flex-shrink-0 ${sidebarWidthClasses[sidebarWidth]}`}>
        {sidebar}
      </aside>
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}

// Usage examples for documentation:
/*
<AppShell
  user={{
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@pillar.org',
    role: 'PROGRAM_DIRECTOR'
  }}
  currentPath="/programs/participants"
  showSearch
  onNavigate={(href) => router.push(href)}
  onLogout={() => auth.logout()}
  onSearch={(query) => setSearchQuery(query)}
>
  <ContentLayout>
    <h1>Program Participants</h1>
    <ParticipantList />
  </ContentLayout>
</AppShell>

// Using layout components:
<FullWidthLayout>
  <DashboardOverview />
</FullWidthLayout>

<CenteredLayout>
  <LoginForm />
</CenteredLayout>

<TwoColumnLayout
  sidebar={<FilterSidebar />}
  sidebarWidth="sm"
>
  <DataTable />
</TwoColumnLayout>

// Using responsive hook:
function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useAppShell()
  
  return (
    <div className={isMobile ? 'grid-cols-1' : 'grid-cols-3'}>
      Content
    </div>
  )
}
*/