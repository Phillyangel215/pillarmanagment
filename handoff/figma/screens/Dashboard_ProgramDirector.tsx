/**
 * @fileoverview Program Director Dashboard - Role-specific dashboard
 * @description Dashboard view for Program Directors with programs overview, capacity tracking, and outcomes
 * @accessibility WCAG AA+ compliant with proper heading hierarchy and data tables
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, StatsCard } from '../components/Card'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { ProgressRing } from '../components/ProgressRing'

// Mock data interfaces
interface Program {
  id: string
  name: string
  capacity: number
  enrolled: number
  waitlist: number
  completionRate: number
  status: 'active' | 'full' | 'waitlist' | 'suspended'
}

interface Outcome {
  metric: string
  current: number
  target: number
  trend: 'up' | 'down' | 'stable'
  period: string
}

interface Risk {
  id: string
  client: string
  program: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  description: string
  daysOverdue: number
}

export function Dashboard_ProgramDirector() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month')

  // Mock data
  const programs: Program[] = [
    {
      id: '1',
      name: 'Housing First Initiative',
      capacity: 50,
      enrolled: 47,
      waitlist: 12,
      completionRate: 78,
      status: 'active'
    },
    {
      id: '2',
      name: 'Job Training Program',
      capacity: 30,
      enrolled: 30,
      waitlist: 8,
      completionRate: 85,
      status: 'full'
    },
    {
      id: '3',
      name: 'Mental Health Support',
      capacity: 25,
      enrolled: 22,
      waitlist: 15,
      completionRate: 92,
      status: 'waitlist'
    }
  ]

  const outcomes: Outcome[] = [
    {
      metric: 'Housing Placement Rate',
      current: 73,
      target: 75,
      trend: 'up',
      period: 'This Month'
    },
    {
      metric: 'Job Placement Rate',
      current: 68,
      target: 70,
      trend: 'down',
      period: 'This Month'
    },
    {
      metric: 'Program Completion Rate',
      current: 82,
      target: 80,
      trend: 'up',
      period: 'This Quarter'
    }
  ]

  const risks: Risk[] = [
    {
      id: '1',
      client: 'Sarah Johnson',
      program: 'Housing First Initiative',
      riskLevel: 'critical',
      description: 'Missed 3 consecutive appointments',
      daysOverdue: 5
    },
    {
      id: '2',
      client: 'Michael Chen',
      program: 'Job Training Program',
      riskLevel: 'high',
      description: 'Housing instability affecting attendance',
      daysOverdue: 2
    },
    {
      id: '3',
      client: 'Jennifer Davis',
      program: 'Mental Health Support',
      riskLevel: 'medium',
      description: 'Requires additional case management',
      daysOverdue: 1
    }
  ]

  const getStatusColor = (status: Program['status']) => {
    switch (status) {
      case 'active': return 'success'
      case 'full': return 'warning'
      case 'waitlist': return 'warning'
      case 'suspended': return 'error'
      default: return 'default'
    }
  }

  const getRiskColor = (level: Risk['riskLevel']) => {
    switch (level) {
      case 'low': return 'success'
      case 'medium': return 'warning'
      case 'high': return 'error'
      case 'critical': return 'error'
      default: return 'default'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <span className="text-success">↗</span>
      case 'down':
        return <span className="text-error">↘</span>
      case 'stable':
        return <span className="text-muted">→</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Program Director Dashboard</h1>
          <p className="text-muted mt-1">
            Monitor program performance, capacity, and participant outcomes
          </p>
        </div>
        
        {/* Timeframe selector */}
        <div className="flex bg-surface-2 rounded-lg p-1 border border-surface-4">
          {(['week', 'month', 'quarter'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={[
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                selectedTimeframe === timeframe
                  ? 'bg-primary-500 text-white'
                  : 'text-muted hover:text-text'
              ].join(' ')}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Programs"
          value="8"
          change={{ value: "+2 this month", trend: "up" }}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        
        <StatsCard
          title="Total Participants"
          value="247"
          change={{ value: "+18 this month", trend: "up" }}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Waitlist Total"
          value="35"
          change={{ value: "+5 this week", trend: "up" }}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatsCard
          title="Completion Rate"
          value="78%"
          change={{ value: "+3% this quarter", trend: "up" }}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Programs Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Programs Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {programs.map((program) => (
              <div key={program.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-surface-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-text">{program.name}</h3>
                    <Badge variant={getStatusColor(program.status)} size="sm">
                      {program.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted">Enrolled:</span>
                      <span className="ml-2 font-medium text-text">
                        {program.enrolled}/{program.capacity}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted">Waitlist:</span>
                      <span className="ml-2 font-medium text-text">{program.waitlist}</span>
                    </div>
                    <div>
                      <span className="text-muted">Completion:</span>
                      <span className="ml-2 font-medium text-text">{program.completionRate}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Capacity visualization */}
                  <ProgressRing
                    value={(program.enrolled / program.capacity) * 100}
                    size="sm"
                    variant={program.enrolled >= program.capacity ? 'warning' : 'primary'}
                    showValue={false}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium">
                        {Math.round((program.enrolled / program.capacity) * 100)}%
                      </div>
                    </div>
                  </ProgressRing>
                  
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outcomes vs Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Outcomes vs Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {outcomes.map((outcome, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-text">{outcome.metric}</h4>
                  {getTrendIcon(outcome.trend)}
                </div>
                
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-text">{outcome.current}%</span>
                  <span className="text-sm text-muted">of {outcome.target}% target</span>
                </div>
                
                <div className="w-full bg-surface-4 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      outcome.current >= outcome.target ? 'bg-success' : 'bg-primary-500'
                    }`}
                    style={{ width: `${Math.min((outcome.current / outcome.target) * 100, 100)}%` }}
                  />
                </div>
                
                <p className="text-xs text-muted">{outcome.period}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Management & Escalations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Risk Management & Escalations</CardTitle>
            <Button variant="secondary" size="sm">
              View All Risks
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {risks.map((risk) => (
              <div 
                key={risk.id} 
                className="flex items-center justify-between p-3 bg-surface rounded-lg border border-surface-4 hover:border-primary-500/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge variant={getRiskColor(risk.riskLevel)} size="sm">
                      {risk.riskLevel}
                    </Badge>
                    <span className="font-medium text-text">{risk.client}</span>
                    <span className="text-sm text-muted">• {risk.program}</span>
                  </div>
                  <p className="text-sm text-muted">{risk.description}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-text">{risk.daysOverdue} days</div>
                  <div className="text-xs text-muted">overdue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="primary" className="h-16 flex items-center justify-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Program
        </Button>
        
        <Button variant="secondary" className="h-16 flex items-center justify-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Generate Report
        </Button>
        
        <Button variant="secondary" className="h-16 flex items-center justify-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-4.5-4.5c-.4-.4-1-.4-1.4 0L10.5 17H15zm-9-4c0-3.5 2.5-6.5 6-7v-1a1 1 0 112 0v1c3.5.5 6 3.5 6 7v4.5l2 2v.5H4v-.5l2-2V13z" />
          </svg>
          Review Alerts
        </Button>
      </div>
    </div>
  )
}

export default Dashboard_ProgramDirector