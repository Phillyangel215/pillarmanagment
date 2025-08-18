/**
 * @fileoverview Contracts - Government contract performance and compliance
 * @description Contract registry, deliverables tracking, SLA metrics, renewal management
 * @version 1.0.0 - Production implementation
 * @requires Demo services for contract data
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'

interface Contract {
  id: string
  title: string
  agency: string
  value: number
  startDate: string
  endDate: string
  status: 'active' | 'renewal' | 'expired' | 'terminated'
  contractManager: string
  deliverables: Deliverable[]
  slaScore: number
  renewalDate?: string
  riskFlags: string[]
}

interface Deliverable {
  id: string
  title: string
  dueDate: string
  status: 'completed' | 'in-progress' | 'overdue' | 'upcoming'
  assignee: string
  completionDate?: string
}

interface SLAMetric {
  metric: string
  target: number
  actual: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [slaMetrics, setSlaMetrics] = useState<SLAMetric[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContractsData()
  }, [])

  const loadContractsData = async () => {
    try {
      setLoading(true)
      
      // Generate realistic contract data
      const contractData = generateContractData()
      setContracts(contractData)
      
      // Generate SLA metrics
      setSlaMetrics(generateSLAMetrics())
      
    } catch (error) {
      console.error('Failed to load contracts data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateContractData = (): Contract[] => {
    const agencies = [
      'City Housing Authority', 'State Department of Health', 'County Social Services',
      'Federal HUD', 'State Workforce Development', 'City Community Development',
      'Department of Veterans Affairs', 'State Department of Education'
    ]
    
    const contractTypes = [
      'Emergency Housing Services', 'Mental Health Services', 'Job Training Program',
      'Senior Services', 'Youth Development', 'Substance Abuse Treatment',
      'Homeless Outreach', 'Food Security Program'
    ]
    
    const managers = ['Sarah Chen', 'Michael Rodriguez', 'Jennifer Park', 'David Kim', 'Emily Johnson']
    const statuses: Contract['status'][] = ['active', 'renewal', 'expired', 'terminated']
    
    return Array.from({ length: 15 }, (_, i) => {
      const startDate = new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000) // Up to 2 years ago
      const endDate = new Date(startDate.getTime() + (365 + Math.random() * 365) * 24 * 60 * 60 * 1000) // 1-2 year terms
      const status = endDate < new Date() ? 'expired' : statuses[Math.floor(Math.random() * 2)] // Bias toward active
      const value = Math.floor(Math.random() * 2000000) + 50000 // $50K - $2M
      
      // Generate deliverables for active contracts
      const deliverables: Deliverable[] = status === 'active' ? Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, j) => {
        const deliverableDue = new Date(Date.now() + (j * 30 + Math.random() * 60) * 24 * 60 * 60 * 1000)
        const isOverdue = deliverableDue < new Date()
        
        return {
          id: `deliverable-${i}-${j}`,
          title: `${['Quarterly Report', 'Client Outcomes', 'Budget Report', 'Compliance Review', 'Site Visit'][j % 5]}`,
          dueDate: deliverableDue.toISOString(),
          status: isOverdue ? 'overdue' : Math.random() > 0.7 ? 'completed' : 'in-progress',
          assignee: managers[Math.floor(Math.random() * managers.length)],
          completionDate: Math.random() > 0.5 ? deliverableDue.toISOString() : undefined
        }
      }) : []
      
      // Risk assessment
      const riskFlags: string[] = []
      if (status === 'renewal') riskFlags.push('Renewal Required')
      if (deliverables.some(d => d.status === 'overdue')) riskFlags.push('Overdue Deliverables')
      if (Math.random() > 0.8) riskFlags.push('Budget Variance')
      if (endDate.getTime() - Date.now() < 90 * 24 * 60 * 60 * 1000) riskFlags.push('Expiring Soon')
      
      return {
        id: `contract-${i}`,
        title: contractTypes[Math.floor(Math.random() * contractTypes.length)],
        agency: agencies[Math.floor(Math.random() * agencies.length)],
        value,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status,
        contractManager: managers[Math.floor(Math.random() * managers.length)],
        deliverables,
        slaScore: Math.floor(Math.random() * 25) + 75, // 75-100%
        renewalDate: status === 'renewal' ? new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        riskFlags
      }
    })
  }

  const generateSLAMetrics = (): SLAMetric[] => {
    return [
      { metric: 'Response Time', target: 24, actual: 18, unit: 'hours', trend: 'up' },
      { metric: 'Client Satisfaction', target: 85, actual: 92, unit: '%', trend: 'up' },
      { metric: 'Report Timeliness', target: 95, actual: 88, unit: '%', trend: 'down' },
      { metric: 'Budget Variance', target: 5, actual: 3.2, unit: '%', trend: 'up' },
      { metric: 'Compliance Score', target: 90, actual: 94, unit: '%', trend: 'stable' },
      { metric: 'Renewal Success', target: 80, actual: 85, unit: '%', trend: 'up' }
    ]
  }

  const filteredContracts = selectedStatus === 'all' 
    ? contracts 
    : contracts.filter(contract => contract.status === selectedStatus)

  const statusCounts = {
    all: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    renewal: contracts.filter(c => c.status === 'renewal').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    terminated: contracts.filter(c => c.status === 'terminated').length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-700 border-success-200'
      case 'renewal': return 'bg-warning-100 text-warning-700 border-warning-200'
      case 'expired': return 'bg-error-100 text-error-700 border-error-200'
      case 'terminated': return 'bg-charcoal-100 text-charcoal-600 border-charcoal-200'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  const getDeliverableColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-700'
      case 'in-progress': return 'bg-primary-100 text-primary-700'
      case 'overdue': return 'bg-error-100 text-error-700'
      case 'upcoming': return 'bg-charcoal-100 text-charcoal-700'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-2 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
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
            <h1 className="text-3xl font-bold text-text">Government Contracts</h1>
            <p className="text-muted mt-1">Performance tracking, compliance monitoring, and renewal management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="motion-safe-fast">
              Export Registry
            </Button>
            <Button size="sm" className="motion-safe-fast hover-glow">
              New Contract
            </Button>
          </div>
        </div>

        {/* Contract Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Card 
              key={status}
              className={`glass-card motion-safe hover-lift cursor-pointer ${
                selectedStatus === status ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedStatus(status)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-text">{count}</p>
                <p className="text-xs text-muted capitalize">{status}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SLA Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slaMetrics.map((metric, index) => {
            const isGood = metric.actual >= metric.target
            const percentage = metric.unit === '%' ? metric.actual : (metric.actual / metric.target) * 100
            
            return (
              <Card key={index} className="glass-card motion-safe hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted">{metric.metric}</p>
                      <p className="text-2xl font-bold text-text">
                        {metric.actual}{metric.unit}
                      </p>
                      <p className="text-xs text-muted">Target: {metric.target}{metric.unit}</p>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center">
                      {metric.unit === '%' ? (
                        <ProgressRing 
                          progress={metric.actual} 
                          size={48} 
                          strokeWidth={4}
                          className={isGood ? 'text-success-500' : 'text-warning-500'}
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isGood ? 'bg-success-100' : 'bg-warning-100'
                        }`}>
                          <span className={`text-2xl ${metric.trend === 'up' ? '📈' : metric.trend === 'down' ? '📉' : '➡️'}`}>
                            {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Contracts Table */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedStatus === 'all' ? 'Contract Registry' : `${selectedStatus.charAt(0).toUpperCase()}${selectedStatus.slice(1)} Contracts`}
                </CardTitle>
                <p className="text-sm text-muted">Government contracts and performance tracking</p>
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
                    <th scope="col" className="text-left py-3 px-4 text-sm font-medium text-muted">Contract</th>
                    <th scope="col" className="text-left py-3 px-4 text-sm font-medium text-muted">Agency</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Status</th>
                    <th scope="col" className="text-right py-3 px-4 text-sm font-medium text-muted">Value</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">SLA Score</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Risk Flags</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-4">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-surface-2 motion-safe-fast">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-text">{contract.title}</p>
                          <p className="text-sm text-muted">{contract.contractManager}</p>
                          <p className="text-xs text-subtle">
                            {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-text">{contract.agency}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className={`text-xs ${getStatusColor(contract.status)}`}>
                          {contract.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-semibold text-text">{formatCurrency(contract.value)}</p>
                        <p className="text-sm text-muted">
                          {Math.round((Date.now() - new Date(contract.startDate).getTime()) / (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) * 100)}% elapsed
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <ProgressRing 
                            progress={contract.slaScore} 
                            size={32} 
                            strokeWidth={3}
                            className={contract.slaScore >= 90 ? 'text-success-500' : contract.slaScore >= 75 ? 'text-warning-500' : 'text-error-500'}
                          />
                          <span className="ml-2 text-sm font-medium text-text">{contract.slaScore}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {contract.riskFlags.slice(0, 2).map((flag, index) => (
                            <Badge key={index} className="text-xs bg-error-100 text-error-700">
                              {flag}
                            </Badge>
                          ))}
                          {contract.riskFlags.length > 2 && (
                            <Badge className="text-xs bg-charcoal-100 text-charcoal-600">
                              +{contract.riskFlags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="motion-safe-fast">
                            View
                          </Button>
                          {contract.status === 'renewal' && (
                            <Button variant="ghost" size="sm" className="motion-safe-fast">
                              Renew
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Contract Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <p className="text-sm text-muted">Key contract performance indicators</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Total Contract Value:</span>
                  <span className="font-semibold text-text">
                    {formatCurrency(contracts.reduce((sum, c) => sum + c.value, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Average SLA Score:</span>
                  <span className="font-semibold text-text">
                    {Math.round(contracts.reduce((sum, c) => sum + c.slaScore, 0) / contracts.length)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Contracts at Risk:</span>
                  <span className="font-semibold text-error-600">
                    {contracts.filter(c => c.riskFlags.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Renewal Success Rate:</span>
                  <span className="font-semibold text-success-600">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upcoming Deliverables</CardTitle>
              <p className="text-sm text-muted">Contract milestones and requirements</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contracts
                  .flatMap(c => c.deliverables.map(d => ({ ...d, contractTitle: c.title })))
                  .filter(d => d.status !== 'completed')
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 6)
                  .map((deliverable) => (
                    <div key={deliverable.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-2 motion-safe-fast">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-text">{deliverable.title}</p>
                          <Badge className={`text-xs ${getDeliverableColor(deliverable.status)}`}>
                            {deliverable.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted">
                          {deliverable.contractTitle} • {deliverable.assignee}
                        </p>
                        <p className="text-xs text-subtle">
                          Due {new Date(deliverable.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="motion-safe-fast">
                        Update
                      </Button>
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

// Helper functions
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-success-100 text-success-700 border-success-200'
    case 'renewal': return 'bg-warning-100 text-warning-700 border-warning-200'
    case 'expired': return 'bg-error-100 text-error-700 border-error-200'
    case 'terminated': return 'bg-charcoal-100 text-charcoal-600 border-charcoal-200'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}

function getDeliverableColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-success-100 text-success-700'
    case 'in-progress': return 'bg-primary-100 text-primary-700'
    case 'overdue': return 'bg-error-100 text-error-700'
    case 'upcoming': return 'bg-charcoal-100 text-charcoal-700'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}
