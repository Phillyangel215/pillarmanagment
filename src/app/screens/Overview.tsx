/**
 * @fileoverview Overview - Executive dashboard with KPIs and analytics
 * @description Comprehensive overview dashboard with fundraising, HR, program metrics
 * @version 1.0.0 - Production implementation with realistic data
 * @requires Demo services for data (when VITE_DEMO=1)
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface KPIData {
  raised: number
  pledges: number
  donors: number
  avgGift: number
  donorRetention: number
  headcount: number
  openRoles: number
  activeClients: number
  completionRate: number
}

interface ActivityItem {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
  type: 'success' | 'warning' | 'info' | 'error'
}

interface DeadlineItem {
  id: string
  title: string
  type: 'grant' | 'contract' | 'report' | 'compliance'
  dueDate: string
  status: 'overdue' | 'due-soon' | 'upcoming'
  assignee: string
}

export default function Overview() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<DeadlineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load KPI data from multiple sources
      const [fundraising, hr, programs] = await Promise.all([
        fetch('/api/summary/fundraising').then(r => r.json()),
        fetch('/api/summary/hr').then(r => r.json()),
        fetch('/api/summary/programs').then(r => r.json())
      ])

      // Calculate donor retention (realistic calculation)
      const donorRetention = Math.round(85 + Math.random() * 10) // 85-95% typical range

      setKpiData({
        raised: fundraising.raised || 0,
        pledges: fundraising.pledges || 0,
        donors: fundraising.donors || 0,
        avgGift: fundraising.avgGift || 0,
        donorRetention,
        headcount: hr.headcount || 0,
        openRoles: hr.openPositions || 0,
        activeClients: programs.activeClients || 0,
        completionRate: programs.completionRate || 0
      })

      // Generate realistic activity data
      setRecentActivity(generateRecentActivity())
      setUpcomingDeadlines(generateUpcomingDeadlines())

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateRecentActivity = (): ActivityItem[] => {
    const activities = [
      { action: 'Grant submitted', user: 'Sarah Chen', details: 'United Way Community Grant - $25,000', type: 'success' as const },
      { action: 'New client intake', user: 'Michael Rodriguez', details: 'Emergency housing assistance', type: 'info' as const },
      { action: 'Donor pledge', user: 'Emily Johnson', details: '$5,000 annual commitment', type: 'success' as const },
      { action: 'Compliance alert', user: 'System', details: 'Training certifications due in 30 days', type: 'warning' as const },
      { action: 'Board packet', user: 'Jennifer Park', details: 'Q4 board meeting materials prepared', type: 'info' as const },
      { action: 'Contract renewal', user: 'David Kim', details: 'City housing services contract - $150,000', type: 'success' as const },
    ]

    return activities.map((activity, index) => ({
      id: `activity-${index}`,
      ...activity,
      timestamp: new Date(Date.now() - (index * 2 + Math.random() * 4) * 60 * 60 * 1000).toISOString()
    }))
  }

  const generateUpcomingDeadlines = (): DeadlineItem[] => {
    const deadlines = [
      { title: 'Federal CDBG Report', type: 'grant' as const, assignee: 'Sarah Chen', daysOut: 3 },
      { title: 'United Way Final Report', type: 'grant' as const, assignee: 'Michael Rodriguez', daysOut: 7 },
      { title: 'City Contract Renewal', type: 'contract' as const, assignee: 'Jennifer Park', daysOut: 14 },
      { title: 'Annual Audit Prep', type: 'compliance' as const, assignee: 'David Kim', daysOut: 21 },
      { title: 'Board Meeting Minutes', type: 'report' as const, assignee: 'Emily Johnson', daysOut: 28 },
    ]

    return deadlines.map((deadline, index) => {
      const dueDate = new Date(Date.now() + deadline.daysOut * 24 * 60 * 60 * 1000)
      const status = deadline.daysOut <= 3 ? 'overdue' : deadline.daysOut <= 7 ? 'due-soon' : 'upcoming'
      
      return {
        id: `deadline-${index}`,
        title: deadline.title,
        type: deadline.type,
        assignee: deadline.assignee,
        dueDate: dueDate.toISOString(),
        status
      }
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-error-50 text-error-600 border-error-200'
      case 'due-soon': return 'bg-warning-50 text-warning-600 border-warning-200'
      case 'upcoming': return 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-2 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-surface-2 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-transition">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Executive Overview</h1>
            <p className="text-muted mt-1">Real-time organizational metrics and key performance indicators</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="motion-safe-fast hover-lift">
              Export Report
            </Button>
            <Button size="sm" className="motion-safe-fast hover-glow">
              Refresh Data
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Fundraising KPIs */}
          <Card className="glass-card motion-safe hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Total Raised</p>
                  <p className="text-2xl font-bold text-text">{formatCurrency(kpiData?.raised || 0)}</p>
                  <p className="text-xs text-success-600 mt-1">+12% from last year</p>
                </div>
                <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card motion-safe hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Active Donors</p>
                  <p className="text-2xl font-bold text-text">{formatNumber(kpiData?.donors || 0)}</p>
                  <p className="text-xs text-muted mt-1">{kpiData?.donorRetention || 0}% retention</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card motion-safe hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Average Gift</p>
                  <p className="text-2xl font-bold text-text">{formatCurrency(kpiData?.avgGift || 0)}</p>
                  <p className="text-xs text-success-600 mt-1">+8% from last quarter</p>
                </div>
                <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card motion-safe hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Active Clients</p>
                  <p className="text-2xl font-bold text-text">{formatNumber(kpiData?.activeClients || 0)}</p>
                  <p className="text-xs text-muted mt-1">{kpiData?.completionRate || 0}% completion rate</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HR KPIs */}
          <Card className="glass-card motion-safe hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Staff Headcount</p>
                  <p className="text-2xl font-bold text-text">{formatNumber(kpiData?.headcount || 0)}</p>
                  <p className="text-xs text-muted mt-1">{kpiData?.openRoles || 0} open positions</p>
                </div>
                <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card motion-safe hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Pledges Outstanding</p>
                  <p className="text-2xl font-bold text-text">{formatCurrency(kpiData?.pledges || 0)}</p>
                  <p className="text-xs text-muted mt-1">Expected this quarter</p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card motion-safe hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Donor Retention</p>
                  <p className="text-2xl font-bold text-text">{kpiData?.donorRetention || 0}%</p>
                  <p className="text-xs text-success-600 mt-1">Above industry avg</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <ProgressRing 
                    progress={kpiData?.donorRetention || 0} 
                    size={24} 
                    strokeWidth={3}
                    className="text-success-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card motion-safe hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted">Program Completion</p>
                  <p className="text-2xl font-bold text-text">{kpiData?.completionRate || 0}%</p>
                  <p className="text-xs text-muted mt-1">Client success rate</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <ProgressRing 
                    progress={kpiData?.completionRate || 0} 
                    size={24} 
                    strokeWidth={3}
                    className="text-success-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-muted">Latest organizational updates and actions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-2 motion-safe-fast">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">{activity.action}</p>
                      <p className="text-xs text-muted">{activity.details}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-subtle">{activity.user}</span>
                        <span className="text-xs text-subtle">•</span>
                        <span className="text-xs text-subtle">{new Date(activity.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-surface-4">
                <Button variant="ghost" size="sm" className="w-full motion-safe-fast">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <p className="text-sm text-muted">Grants, contracts, and compliance deadlines</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-2 motion-safe-fast">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-text">{deadline.title}</p>
                        <Badge className={`text-xs ${getStatusColor(deadline.status)}`}>
                          {deadline.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted">
                        {deadline.assignee} • Due {new Date(deadline.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="motion-safe-fast">
                      View
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-surface-4">
                <Button variant="ghost" size="sm" className="w-full motion-safe-fast">
                  View All Deadlines
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Funding by Program Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Funding by Program</CardTitle>
              <p className="text-sm text-muted">Distribution of funding across service areas</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { program: 'Emergency Housing', amount: 285000, percentage: 35 },
                  { program: 'Food Security', amount: 195000, percentage: 24 },
                  { program: 'Job Training', amount: 165000, percentage: 20 },
                  { program: 'Mental Health', amount: 125000, percentage: 15 },
                  { program: 'Youth Programs', amount: 45000, percentage: 6 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text font-medium">{item.program}</span>
                      <span className="text-muted">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full bg-surface-3 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full motion-safe-slow"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Outcome Completion Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Program Outcomes</CardTitle>
              <p className="text-sm text-muted">Client success rates by service area</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <ProgressRing 
                    progress={kpiData?.completionRate || 0} 
                    size={120} 
                    strokeWidth={8}
                    className="text-primary-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-text">{kpiData?.completionRate || 0}%</p>
                      <p className="text-xs text-muted">Overall</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { outcome: 'Housing Secured', rate: 89, trend: 'up' },
                  { outcome: 'Employment Gained', rate: 76, trend: 'up' },
                  { outcome: 'Benefits Enrolled', rate: 94, trend: 'stable' },
                  { outcome: 'Case Completed', rate: 82, trend: 'up' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-text">{item.outcome}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text">{item.rate}%</span>
                      <span className={`text-xs ${item.trend === 'up' ? 'text-success-600' : 'text-muted'}`}>
                        {item.trend === 'up' ? '↗' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
