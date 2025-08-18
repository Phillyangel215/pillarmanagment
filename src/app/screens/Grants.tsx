/**
 * @fileoverview Grants - Grant pipeline and compliance management
 * @description Grant lifecycle tracking from LOI to reporting with calendar and compliance
 * @version 1.0.0 - Production implementation
 * @requires Demo services for grant data
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Grant {
  id: string
  title: string
  funder: string
  amount: number
  stage: 'loi' | 'submitted' | 'awarded' | 'reporting' | 'closed'
  submissionDate: string
  awardDate?: string
  reportingDue?: string
  programArea: string
  grantManager: string
  complianceScore: number
  budgetDrawn: number
  budgetTotal: number
}

interface Deadline {
  id: string
  grantId: string
  title: string
  type: 'report' | 'milestone' | 'budget' | 'compliance'
  dueDate: string
  status: 'overdue' | 'due-soon' | 'upcoming' | 'completed'
  assignee: string
}

export default function Grants() {
  const [grants, setGrants] = useState<Grant[]>([])
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [selectedStage, setSelectedStage] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGrantsData()
  }, [])

  const loadGrantsData = async () => {
    try {
      setLoading(true)
      
      // Generate realistic grant data
      const grantData = generateGrantData()
      setGrants(grantData)
      
      // Generate deadline data
      setDeadlines(generateDeadlineData(grantData))
      
    } catch (error) {
      console.error('Failed to load grants data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateGrantData = (): Grant[] => {
    const funders = [
      'United Way', 'Ford Foundation', 'Robert Wood Johnson Foundation', 
      'City Community Development', 'State Housing Authority', 'Federal HUD',
      'Annie E. Casey Foundation', 'Local Community Foundation', 'Corporate Foundation'
    ]
    
    const programAreas = [
      'Emergency Housing', 'Food Security', 'Job Training', 
      'Mental Health', 'Youth Programs', 'Senior Services'
    ]
    
    const managers = ['Sarah Chen', 'Michael Rodriguez', 'Jennifer Park', 'David Kim']
    const stages: Grant['stage'][] = ['loi', 'submitted', 'awarded', 'reporting', 'closed']
    
    return Array.from({ length: 25 }, (_, i) => {
      const stage = stages[Math.floor(Math.random() * stages.length)]
      const submissionDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      const amount = Math.floor(Math.random() * 500000) + 10000
      const budgetDrawn = stage === 'awarded' || stage === 'reporting' 
        ? Math.floor(amount * (0.2 + Math.random() * 0.6)) 
        : 0
      
      return {
        id: `grant-${i}`,
        title: `${programAreas[Math.floor(Math.random() * programAreas.length)]} Initiative`,
        funder: funders[Math.floor(Math.random() * funders.length)],
        amount,
        stage,
        submissionDate: submissionDate.toISOString(),
        awardDate: stage === 'awarded' || stage === 'reporting' || stage === 'closed' 
          ? new Date(submissionDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString() 
          : undefined,
        reportingDue: stage === 'reporting' 
          ? new Date(Date.now() + (30 + Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        programArea: programAreas[Math.floor(Math.random() * programAreas.length)],
        grantManager: managers[Math.floor(Math.random() * managers.length)],
        complianceScore: Math.floor(Math.random() * 30) + 70, // 70-100%
        budgetDrawn,
        budgetTotal: amount
      }
    })
  }

  const generateDeadlineData = (grants: Grant[]): Deadline[] => {
    const deadlines: Deadline[] = []
    
    grants.forEach((grant, index) => {
      if (grant.stage === 'awarded' || grant.stage === 'reporting') {
        // Add reporting deadlines
        const daysOut = Math.floor(Math.random() * 90) + 1
        const status = daysOut <= 7 ? 'due-soon' : daysOut <= 30 ? 'upcoming' : 'upcoming'
        
        deadlines.push({
          id: `deadline-${index}-report`,
          grantId: grant.id,
          title: `${grant.title} - Quarterly Report`,
          type: 'report',
          dueDate: new Date(Date.now() + daysOut * 24 * 60 * 60 * 1000).toISOString(),
          status,
          assignee: grant.grantManager
        })
        
        // Add compliance deadlines
        if (Math.random() > 0.7) {
          deadlines.push({
            id: `deadline-${index}-compliance`,
            grantId: grant.id,
            title: `${grant.title} - Compliance Review`,
            type: 'compliance',
            dueDate: new Date(Date.now() + (daysOut + 15) * 24 * 60 * 60 * 1000).toISOString(),
            status: 'upcoming',
            assignee: grant.grantManager
          })
        }
      }
    })
    
    return deadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  const filteredGrants = selectedStage === 'all' 
    ? grants 
    : grants.filter(grant => grant.stage === selectedStage)

  const stageCounts = {
    all: grants.length,
    loi: grants.filter(g => g.stage === 'loi').length,
    submitted: grants.filter(g => g.stage === 'submitted').length,
    awarded: grants.filter(g => g.stage === 'awarded').length,
    reporting: grants.filter(g => g.stage === 'reporting').length,
    closed: grants.filter(g => g.stage === 'closed').length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'loi': return 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'
      case 'submitted': return 'bg-warning-100 text-warning-700 border-warning-200'
      case 'awarded': return 'bg-success-100 text-success-700 border-success-200'
      case 'reporting': return 'bg-primary-100 text-primary-700 border-primary-200'
      case 'closed': return 'bg-charcoal-100 text-charcoal-600 border-charcoal-200'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  const getDeadlineColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-error-50 text-error-700 border-error-200'
      case 'due-soon': return 'bg-warning-50 text-warning-700 border-warning-200'
      case 'upcoming': return 'bg-primary-50 text-primary-700 border-primary-200'
      case 'completed': return 'bg-success-50 text-success-700 border-success-200'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-2 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-surface-2 rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-text">Grants Management</h1>
            <p className="text-muted mt-1">Pipeline tracking, compliance monitoring, and reporting</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="motion-safe-fast">
              Export Pipeline
            </Button>
            <Button size="sm" className="motion-safe-fast hover-glow">
              New Grant Application
            </Button>
          </div>
        </div>

        {/* Pipeline Stage Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(stageCounts).map(([stage, count]) => (
            <Card 
              key={stage}
              className={`glass-card motion-safe hover-lift cursor-pointer ${
                selectedStage === stage ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedStage(stage)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-text">{count}</p>
                <p className="text-xs text-muted capitalize">{stage === 'loi' ? 'LOI' : stage}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Grants Calendar/Deadlines */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <p className="text-sm text-muted">Grant reports, compliance reviews, and milestones</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deadlines.slice(0, 8).map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-2 motion-safe-fast">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-text">{deadline.title}</p>
                      <Badge className={`text-xs ${getDeadlineColor(deadline.status)}`}>
                        {deadline.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted">
                      {deadline.assignee} • Due {new Date(deadline.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="motion-safe-fast">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grants Table */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedStage === 'all' ? 'All Grants' : `${selectedStage.charAt(0).toUpperCase()}${selectedStage.slice(1)} Grants`}
                </CardTitle>
                <p className="text-sm text-muted">Grant applications and awards tracking</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="motion-safe-fast">
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="motion-safe-fast">
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-4">
                    <th scope="col" className="text-left py-3 px-4 text-sm font-medium text-muted">Grant</th>
                    <th scope="col" className="text-left py-3 px-4 text-sm font-medium text-muted">Funder</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Stage</th>
                    <th scope="col" className="text-right py-3 px-4 text-sm font-medium text-muted">Amount</th>
                    <th scope="col" className="text-right py-3 px-4 text-sm font-medium text-muted">Budget Status</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Compliance</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-4">
                  {filteredGrants.slice(0, 15).map((grant) => {
                    const budgetProgress = (grant.budgetDrawn / grant.budgetTotal) * 100
                    return (
                      <tr key={grant.id} className="hover:bg-surface-2 motion-safe-fast">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-text">{grant.title}</p>
                            <p className="text-sm text-muted">{grant.programArea}</p>
                            <p className="text-xs text-subtle">{grant.grantManager}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-text">{grant.funder}</p>
                          <p className="text-sm text-muted">
                            Submitted {new Date(grant.submissionDate).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge className={`text-xs ${getStageColor(grant.stage)}`}>
                            {grant.stage.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-semibold text-text">{formatCurrency(grant.amount)}</p>
                          {grant.awardDate && (
                            <p className="text-sm text-muted">
                              Awarded {new Date(grant.awardDate).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {grant.stage === 'awarded' || grant.stage === 'reporting' ? (
                            <div>
                              <p className="text-text">{formatCurrency(grant.budgetDrawn)}</p>
                              <p className="text-sm text-muted">of {formatCurrency(grant.budgetTotal)}</p>
                              <div className="w-16 bg-surface-3 rounded-full h-1 mt-1 ml-auto">
                                <div 
                                  className="bg-primary-500 h-1 rounded-full motion-safe-slow"
                                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted">—</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {grant.stage === 'awarded' || grant.stage === 'reporting' ? (
                            <div className="flex items-center justify-center">
                              <div className={`w-3 h-3 rounded-full ${
                                grant.complianceScore >= 90 ? 'bg-success-500' :
                                grant.complianceScore >= 75 ? 'bg-warning-500' :
                                'bg-error-500'
                              }`} />
                              <span className="ml-2 text-sm text-text">{grant.complianceScore}%</span>
                            </div>
                          ) : (
                            <p className="text-muted">—</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" className="motion-safe-fast">
                              View
                            </Button>
                            {grant.stage === 'reporting' && (
                              <Button variant="ghost" size="sm" className="motion-safe-fast">
                                Report
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Total Applied:</span>
                  <span className="font-semibold text-text">
                    {formatCurrency(grants.reduce((sum, g) => sum + g.amount, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Awarded:</span>
                  <span className="font-semibold text-success-600">
                    {formatCurrency(grants.filter(g => g.stage === 'awarded' || g.stage === 'reporting' || g.stage === 'closed').reduce((sum, g) => sum + g.amount, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Success Rate:</span>
                  <span className="font-semibold text-text">
                    {Math.round((grants.filter(g => g.stage === 'awarded' || g.stage === 'reporting' || g.stage === 'closed').length / grants.length) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Active Awards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Active Grants:</span>
                  <span className="font-semibold text-text">{stageCounts.awarded + stageCounts.reporting}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Budget Drawn:</span>
                  <span className="font-semibold text-text">
                    {formatCurrency(grants.reduce((sum, g) => sum + g.budgetDrawn, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Avg Compliance:</span>
                  <span className="font-semibold text-text">
                    {Math.round(grants.filter(g => g.stage === 'awarded' || g.stage === 'reporting').reduce((sum, g) => sum + g.complianceScore, 0) / Math.max(grants.filter(g => g.stage === 'awarded' || g.stage === 'reporting').length, 1))}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upcoming Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {deadlines.filter(d => d.type === 'report').slice(0, 4).map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between text-sm">
                    <span className="text-text truncate">{deadline.title.split(' - ')[0]}</span>
                    <Badge className={`text-xs ${getDeadlineColor(deadline.status)}`}>
                      {Math.ceil((new Date(deadline.dueDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))}d
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3 motion-safe-fast">
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

function getStageColor(stage: string) {
  switch (stage) {
    case 'loi': return 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'
    case 'submitted': return 'bg-warning-100 text-warning-700 border-warning-200'
    case 'awarded': return 'bg-success-100 text-success-700 border-success-200'
    case 'reporting': return 'bg-primary-100 text-primary-700 border-primary-200'
    case 'closed': return 'bg-charcoal-100 text-charcoal-600 border-charcoal-200'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}

function getDeadlineColor(status: string) {
  switch (status) {
    case 'overdue': return 'bg-error-50 text-error-700 border-error-200'
    case 'due-soon': return 'bg-warning-50 text-warning-700 border-warning-200'
    case 'upcoming': return 'bg-primary-50 text-primary-700 border-primary-200'
    case 'completed': return 'bg-success-50 text-success-700 border-success-200'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}
