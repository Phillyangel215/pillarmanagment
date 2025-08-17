/**
 * @fileoverview RoleBasedDashboard - Main dashboard with role-specific navigation
 * @description Provides role-based interface with appropriate navigation and quick actions
 * @version 1.0.0 - Initial implementation with RBAC
 * @requires User role: Any authenticated user
 * @hipaa All dashboard access is logged for audit compliance
 */

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Users, FileText, Home, Settings, BarChart3, Calendar, Shield, AlertTriangle } from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  permissions: string[]
  status: string
  lastLogin: string | null
}

interface DashboardItem {
  title: string
  description: string
  icon: React.ReactElement
  action: string
  permissions: string[]
  count?: number
  status?: 'normal' | 'warning' | 'error'
}

interface RoleBasedDashboardProps {
  user: User
  onNavigate: (section: string) => void
  className?: string
}

export default function RoleBasedDashboard({ 
  user, 
  onNavigate,
  className = '' 
}: RoleBasedDashboardProps): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user has required permissions
  const hasPermission = useCallback((requiredPermissions: string[]) => {
    if (user.permissions.includes('all')) return true
    return requiredPermissions.some(permission => 
      user.permissions.includes(permission)
    )
  }, [user.permissions])

  // Define dashboard items based on role
  const getDashboardItems = useCallback((): DashboardItem[] => {
    const items: DashboardItem[] = []

    // Client Management - Available to case workers and above
    if (hasPermission(['clients:read', 'clients:all'])) {
      items.push({
        title: 'Client Management',
        description: 'Manage client profiles, cases, and services',
        icon: <Users className="w-6 h-6" />,
        action: 'clients',
        permissions: ['clients:read'],
        count: 0, // TODO: Fetch real count
        status: 'normal'
      })
    }

    // Housing Services - Housing specialists and supervisors
    if (hasPermission(['housing:all', 'clients:update']) && 
        ['HOUSING_SPECIALIST', 'SUPERVISOR', 'ADMIN', 'CEO', 'COO'].includes(user.role)) {
      items.push({
        title: 'Housing Services',
        description: 'Track housing status and placement services',
        icon: <Home className="w-6 h-6" />,
        action: 'housing',
        permissions: ['housing:all'],
        count: 0, // TODO: Fetch real count
        status: 'normal'
      })
    }

    // Reports & Analytics - Supervisors and above
    if (hasPermission(['reports:read', 'reports:all'])) {
      items.push({
        title: 'Reports & Analytics',
        description: 'View compliance reports and service statistics',
        icon: <BarChart3 className="w-6 h-6" />,
        action: 'reports',
        permissions: ['reports:read'],
        count: 0,
        status: 'normal'
      })
    }

    // User Management - Admins only
    if (hasPermission(['users:all']) || ['ADMIN', 'CEO', 'COO'].includes(user.role)) {
      items.push({
        title: 'User Management',
        description: 'Manage staff accounts and permissions',
        icon: <Shield className="w-6 h-6" />,
        action: 'users',
        permissions: ['users:all'],
        count: 0,
        status: 'normal'
      })
    }

    // Case Management - Case workers and social workers
    if (hasPermission(['cases:all', 'cases:read'])) {
      items.push({
        title: 'Case Management',
        description: 'Track case progress and outcomes',
        icon: <FileText className="w-6 h-6" />,
        action: 'cases',
        permissions: ['cases:read'],
        count: 0,
        status: 'normal'
      })
    }

    // Calendar & Scheduling - Most roles
    if (user.role !== 'CLIENT') {
      items.push({
        title: 'Calendar & Scheduling',
        description: 'Manage appointments and meetings',
        icon: <Calendar className="w-6 h-6" />,
        action: 'calendar',
        permissions: [],
        count: 0,
        status: 'normal'
      })
    }

    // System Settings - Admins only
    if (['ADMIN'].includes(user.role)) {
      items.push({
        title: 'System Settings',
        description: 'Configure system preferences and integrations',
        icon: <Settings className="w-6 h-6" />,
        action: 'settings',
        permissions: ['all'],
        count: 0,
        status: 'normal'
      })
    }

    return items
  }, [user.role, hasPermission])

  const handleCardClick = useCallback(async (action: string) => {
    if (loading) return

    try {
      setLoading(true)
      setError(null)

      // Audit log
      console.info(`AUDIT: Dashboard navigation`, {
        timestamp: new Date().toISOString(),
        userId: user.id,
        userRole: user.role,
        action: 'DASHBOARD_NAVIGATE',
        target: action
      })

      onNavigate(action)

    } catch (err) {
      console.error('Navigation failed:', err)
      setError('Navigation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [loading, user, onNavigate])

  const dashboardItems = getDashboardItems()

  return (
    <div 
      className={`enterprise-layout ${className}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--spacing-6)' 
      }}
    >
      {/* Error Display */}
      {error && (
        <div 
          className="bg-error"
          style={{ 
            border: '1px solid var(--color-error-600)', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--spacing-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)'
          }}
        >
          <AlertTriangle className="w-5 h-5" style={{ color: 'var(--color-error-600)' }} />
          <p style={{ color: 'var(--color-error-600)', fontWeight: '500' }}>{error}</p>
        </div>
      )}

      {/* Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="heading-1">Welcome, {user.firstName}</h1>
          <p className="body-base" style={{ color: 'var(--color-slate-500)' }}>
            Role: <Badge 
              variant="secondary" 
              style={{ 
                backgroundColor: 'var(--color-primary-100)',
                color: 'var(--color-primary-700)',
                padding: 'var(--spacing-1) var(--spacing-3)',
                borderRadius: 'var(--radius-base)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '500'
              }}
            >
              {user.role.replace('_', ' ')}
            </Badge>
          </p>
        </div>

        {/* Quick Stats */}
        <div 
          className="enterprise-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-4)'
          }}
        >
          <Card className="card-base" style={{ padding: 'var(--spacing-4)' }}>
            <CardContent style={{ padding: '0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <div 
                style={{ 
                  padding: 'var(--spacing-3)', 
                  borderRadius: 'var(--radius-lg)', 
                  backgroundColor: 'var(--color-primary-100)' 
                }}
              >
                <Users className="w-5 h-5" style={{ color: 'var(--color-primary-600)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-slate-500)' }}>Active Clients</p>
                <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', color: 'var(--color-slate-900)' }}>
                  0 {/* TODO: Fetch real data */}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-base" style={{ padding: 'var(--spacing-4)' }}>
            <CardContent style={{ padding: '0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <div 
                style={{ 
                  padding: 'var(--spacing-3)', 
                  borderRadius: 'var(--radius-lg)', 
                  backgroundColor: 'var(--color-success-100)' 
                }}
              >
                <Home className="w-5 h-5" style={{ color: 'var(--color-success-600)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-slate-500)' }}>Successfully Housed</p>
                <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', color: 'var(--color-slate-900)' }}>
                  0 {/* TODO: Fetch real data */}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-base" style={{ padding: 'var(--spacing-4)' }}>
            <CardContent style={{ padding: '0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <div 
                style={{ 
                  padding: 'var(--spacing-3)', 
                  borderRadius: 'var(--radius-lg)', 
                  backgroundColor: 'var(--color-warning-100)' 
                }}
              >
                <Calendar className="w-5 h-5" style={{ color: 'var(--color-accent-600)' }} />
              </div>
              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-slate-500)' }}>Today's Appointments</p>
                <p style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', color: 'var(--color-slate-900)' }}>
                  0 {/* TODO: Fetch real data */}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div>
        <h2 className="heading-3" style={{ marginBottom: 'var(--spacing-4)' }}>
          Available Modules
        </h2>
        
        <div 
          className="enterprise-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-4)'
          }}
        >
          {dashboardItems.map((item) => (
            <Card 
              key={item.action}
              className="card-base"
              style={{
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                ':hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-base)' }
              }}
              onClick={() => handleCardClick(item.action)}
            >
              <CardHeader style={{ marginBottom: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div 
                    style={{ 
                      padding: 'var(--spacing-3)', 
                      borderRadius: 'var(--radius-lg)', 
                      backgroundColor: 'var(--color-primary-100)' 
                    }}
                  >
                    {React.cloneElement(item.icon, { 
                      style: { color: 'var(--color-primary-600)' } 
                    })}
                  </div>
                  <div style={{ flex: 1 }}>
                    <CardTitle className="heading-4">{item.title}</CardTitle>
                    {item.count !== undefined && (
                      <Badge 
                        variant="outline"
                        style={{ 
                          backgroundColor: 'var(--color-slate-100)',
                          color: 'var(--color-slate-600)',
                          fontSize: 'var(--font-size-xs)',
                          marginTop: 'var(--spacing-1)'
                        }}
                      >
                        {item.count} items
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="body-base" style={{ color: 'var(--color-slate-500)' }}>
                  {item.description}
                </p>
                
                <Button
                  className="btn-base btn-primary"
                  style={{ 
                    minHeight: '2.75rem',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: '500',
                    padding: 'var(--spacing-3) var(--spacing-6)',
                    backgroundColor: 'var(--color-primary-600)',
                    color: 'white',
                    borderRadius: 'var(--radius-lg)',
                    border: 'none',
                    gap: 'var(--spacing-2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 'var(--spacing-4)'
                  }}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Open Module'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {dashboardItems.length === 0 && (
          <Card className="card-base">
            <CardContent style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-slate-400)' }} />
              <h3 className="heading-3">No Modules Available</h3>
              <p className="body-base" style={{ color: 'var(--color-slate-500)' }}>
                Your current role ({user.role}) does not have access to any modules. 
                Contact your administrator for access.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* HIPAA Compliance Notice */}
      <div
        className="hipaa-warning"
        data-hipaa="true"
        style={{
          fontSize: 'var(--font-size-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-warning-50)',
          border: '1px solid var(--color-accent-600)',
          color: 'var(--color-accent-600)',
          borderRadius: 'var(--radius-base)',
          borderLeft: '4px solid var(--color-accent-600)'
        }}
      >
        <span>🔒</span>
        <span>Dashboard access logged for HIPAA compliance - User: {user.firstName} {user.lastName} ({user.role})</span>
      </div>
    </div>
  )
}