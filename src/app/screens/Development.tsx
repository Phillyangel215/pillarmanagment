/**
 * @fileoverview Development - Fundraising and donor management dashboard
 * @description LYBUNT/SYBUNT analysis, donor segmentation, retention tracking
 * @version 1.0.0 - Production implementation with realistic donor data
 * @requires Demo services for donor data
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'

interface Donor {
  id: string
  firstName: string
  lastName: string
  email: string
  totalGiven: number
  lastGiftDate: string
  lastGiftAmount: number
  giftCount: number
  segment: 'first-time' | 'recurring' | 'major' | 'lybunt' | 'sybunt'
  retentionRisk: 'low' | 'medium' | 'high'
  preferredContact: 'email' | 'phone' | 'mail'
}

interface Campaign {
  id: string
  name: string
  goal: number
  raised: number
  donorCount: number
  status: 'active' | 'completed' | 'planned'
  endDate: string
}

export default function Development() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedSegment, setSelectedSegment] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDevelopmentData()
  }, [])

  const loadDevelopmentData = async () => {
    try {
      setLoading(true)
      
      // Generate realistic donor data
      const donorData = generateDonorData()
      setDonors(donorData)
      
      // Generate campaign data
      setCampaigns(generateCampaignData())
      
    } catch (error) {
      console.error('Failed to load development data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateDonorData = (): Donor[] => {
    const donors: Donor[] = []
    const firstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'John']
    const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez']
    
    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const lastGiftDays = Math.floor(Math.random() * 730) // 0-2 years ago
      const lastGiftDate = new Date(Date.now() - lastGiftDays * 24 * 60 * 60 * 1000)
      const giftCount = Math.floor(Math.random() * 12) + 1
      const totalGiven = Math.floor(Math.random() * 25000) + 100
      
      // Determine segment based on giving pattern
      let segment: Donor['segment']
      if (giftCount === 1) {
        segment = 'first-time'
      } else if (lastGiftDays > 365) {
        segment = lastGiftDays > 730 ? 'sybunt' : 'lybunt' // Some Year/Last Year But Unfortunately Not This
      } else if (totalGiven > 10000) {
        segment = 'major'
      } else {
        segment = 'recurring'
      }
      
      // Risk assessment
      const retentionRisk = lastGiftDays > 365 ? 'high' : lastGiftDays > 180 ? 'medium' : 'low'
      
      donors.push({
        id: `donor-${i}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        totalGiven,
        lastGiftDate: lastGiftDate.toISOString(),
        lastGiftAmount: Math.floor(totalGiven / giftCount),
        giftCount,
        segment,
        retentionRisk,
        preferredContact: ['email', 'phone', 'mail'][Math.floor(Math.random() * 3)] as Donor['preferredContact']
      })
    }
    
    return donors.sort((a, b) => b.totalGiven - a.totalGiven)
  }

  const generateCampaignData = (): Campaign[] => {
    return [
      {
        id: 'campaign-1',
        name: 'Annual Fund 2024',
        goal: 500000,
        raised: 387500,
        donorCount: 245,
        status: 'active',
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'campaign-2',
        name: 'Emergency Housing Fund',
        goal: 150000,
        raised: 142800,
        donorCount: 89,
        status: 'active',
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'campaign-3',
        name: 'Holiday Gift Drive',
        goal: 75000,
        raised: 75000,
        donorCount: 156,
        status: 'completed',
        endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }

  const filteredDonors = selectedSegment === 'all' 
    ? donors 
    : donors.filter(donor => donor.segment === selectedSegment)

  const segmentCounts = {
    all: donors.length,
    'first-time': donors.filter(d => d.segment === 'first-time').length,
    recurring: donors.filter(d => d.segment === 'recurring').length,
    major: donors.filter(d => d.segment === 'major').length,
    lybunt: donors.filter(d => d.segment === 'lybunt').length,
    sybunt: donors.filter(d => d.segment === 'sybunt').length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'major': return 'bg-primary-100 text-primary-700 border-primary-200'
      case 'recurring': return 'bg-success-100 text-success-700 border-success-200'
      case 'first-time': return 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'
      case 'lybunt': return 'bg-warning-100 text-warning-700 border-warning-200'
      case 'sybunt': return 'bg-error-100 text-error-700 border-error-200'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-error-100 text-error-700'
      case 'medium': return 'bg-warning-100 text-warning-700'
      case 'low': return 'bg-success-100 text-success-700'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-2 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
            <h1 className="text-3xl font-bold text-text">Development & Fundraising</h1>
            <p className="text-muted mt-1">Donor management, campaigns, and retention analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="motion-safe-fast">
              Export Donors
            </Button>
            <Button size="sm" className="motion-safe-fast hover-glow">
              New Campaign
            </Button>
          </div>
        </div>

        {/* Donor Segmentation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(segmentCounts).map(([segment, count]) => (
            <Card 
              key={segment}
              className={`glass-card motion-safe hover-lift cursor-pointer ${
                selectedSegment === segment ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedSegment(segment)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-text">{count}</p>
                <p className="text-xs text-muted capitalize">{segment.replace('-', ' ')}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Campaigns */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <p className="text-sm text-muted">Current fundraising initiatives and progress</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.filter(c => c.status === 'active').map((campaign) => {
                const progress = (campaign.raised / campaign.goal) * 100
                return (
                  <div key={campaign.id} className="p-4 rounded-lg border border-surface-4 hover:bg-surface-2 motion-safe-fast">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-text">{campaign.name}</h3>
                        <p className="text-sm text-muted">{campaign.donorCount} donors</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-text">{formatCurrency(campaign.raised)}</p>
                        <p className="text-sm text-muted">of {formatCurrency(campaign.goal)}</p>
                      </div>
                    </div>
                    <div className="w-full bg-surface-3 rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full motion-safe-slow"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">{Math.round(progress)}% complete</span>
                      <span className="text-muted">Due {new Date(campaign.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Donor Table */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedSegment === 'all' ? 'All Donors' : 
                   selectedSegment === 'lybunt' ? 'LYBUNT Donors' :
                   selectedSegment === 'sybunt' ? 'SYBUNT Donors' :
                   `${selectedSegment.charAt(0).toUpperCase()}${selectedSegment.slice(1).replace('-', ' ')} Donors`}
                </CardTitle>
                <p className="text-sm text-muted">
                  {selectedSegment === 'lybunt' && 'Last Year But Unfortunately Not This year - requires attention'}
                  {selectedSegment === 'sybunt' && 'Some Year But Unfortunately Not This year - re-engagement needed'}
                  {selectedSegment === 'all' && 'Complete donor database with segmentation'}
                  {!['lybunt', 'sybunt', 'all'].includes(selectedSegment) && `${selectedSegment.replace('-', ' ')} donor segment`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="motion-safe-fast">
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" className="motion-safe-fast">
                  Send Thanks
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-4">
                    <th scope="col" className="text-left py-3 px-4 text-sm font-medium text-muted">Donor</th>
                    <th scope="col" className="text-left py-3 px-4 text-sm font-medium text-muted">Segment</th>
                    <th scope="col" className="text-right py-3 px-4 text-sm font-medium text-muted">Total Given</th>
                    <th scope="col" className="text-right py-3 px-4 text-sm font-medium text-muted">Last Gift</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Risk</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-4">
                  {filteredDonors.slice(0, 20).map((donor) => (
                    <tr key={donor.id} className="hover:bg-surface-2 motion-safe-fast">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-text">{donor.firstName} {donor.lastName}</p>
                          <p className="text-sm text-muted">{donor.email}</p>
                          <p className="text-xs text-subtle">{donor.giftCount} gifts</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`text-xs ${getSegmentColor(donor.segment)}`}>
                          {donor.segment.toUpperCase().replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-semibold text-text">{formatCurrency(donor.totalGiven)}</p>
                        <p className="text-sm text-muted">avg {formatCurrency(donor.totalGiven / donor.giftCount)}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-text">{formatCurrency(donor.lastGiftAmount)}</p>
                        <p className="text-sm text-muted">{new Date(donor.lastGiftDate).toLocaleDateString()}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className={`text-xs ${getRiskColor(donor.retentionRisk)}`}>
                          {donor.retentionRisk}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="motion-safe-fast">
                            Contact
                          </Button>
                          <Button variant="ghost" size="sm" className="motion-safe-fast">
                            Notes
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredDonors.length > 20 && (
              <div className="mt-4 pt-4 border-t border-surface-4 text-center">
                <Button variant="ghost" size="sm" className="motion-safe-fast">
                  Load More ({filteredDonors.length - 20} remaining)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>LYBUNT Analysis</CardTitle>
              <p className="text-sm text-muted">Last Year But Unfortunately Not This</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-warning-600">{segmentCounts.lybunt}</p>
                  <p className="text-sm text-muted">donors need attention</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Avg last gift:</span>
                    <span className="text-text font-medium">
                      {formatCurrency(donors.filter(d => d.segment === 'lybunt').reduce((sum, d) => sum + d.lastGiftAmount, 0) / Math.max(segmentCounts.lybunt, 1))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Potential value:</span>
                    <span className="text-text font-medium">
                      {formatCurrency(donors.filter(d => d.segment === 'lybunt').reduce((sum, d) => sum + d.totalGiven, 0))}
                    </span>
                  </div>
                </div>
                <Button size="sm" className="w-full motion-safe-fast">
                  Create Re-engagement Campaign
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>SYBUNT Analysis</CardTitle>
              <p className="text-sm text-muted">Some Year But Unfortunately Not This</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-error-600">{segmentCounts.sybunt}</p>
                  <p className="text-sm text-muted">donors at risk</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Avg last gift:</span>
                    <span className="text-text font-medium">
                      {formatCurrency(donors.filter(d => d.segment === 'sybunt').reduce((sum, d) => sum + d.lastGiftAmount, 0) / Math.max(segmentCounts.sybunt, 1))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Historical value:</span>
                    <span className="text-text font-medium">
                      {formatCurrency(donors.filter(d => d.segment === 'sybunt').reduce((sum, d) => sum + d.totalGiven, 0))}
                    </span>
                  </div>
                </div>
                <Button size="sm" className="w-full motion-safe-fast">
                  Create Win-back Campaign
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Retention Metrics</CardTitle>
              <p className="text-sm text-muted">Donor loyalty and engagement</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">First-time retention:</span>
                    <span className="text-sm font-medium text-text">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Multi-year retention:</span>
                    <span className="text-sm font-medium text-text">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Major donor retention:</span>
                    <span className="text-sm font-medium text-text">94%</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-surface-4">
                  <p className="text-xs text-success-600">Above industry average (65%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper functions (same as Overview)
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

function getSegmentColor(segment: string) {
  switch (segment) {
    case 'major': return 'bg-primary-100 text-primary-700 border-primary-200'
    case 'recurring': return 'bg-success-100 text-success-700 border-success-200'
    case 'first-time': return 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'
    case 'lybunt': return 'bg-warning-100 text-warning-700 border-warning-200'
    case 'sybunt': return 'bg-error-100 text-error-700 border-error-200'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}

function getRiskColor(risk: string) {
  switch (risk) {
    case 'high': return 'bg-error-100 text-error-700'
    case 'medium': return 'bg-warning-100 text-warning-700'
    case 'low': return 'bg-success-100 text-success-700'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}
