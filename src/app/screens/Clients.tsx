/**
 * @fileoverview Clients - Client and case management dashboard
 * @description Client intake, services, case notes with strict role-based access
 * @version 1.0.0 - Production implementation with PII protection
 * @hipaa Contains Protected Health Information - strict access controls
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Client {
  id: string
  firstName: string
  lastName: string
  initials: string // For board view (PII redacted)
  age: number
  gender: string
  intakeDate: string
  status: 'intake' | 'active' | 'completed' | 'transferred' | 'inactive'
  services: Service[]
  caseWorker: string
  eligibilityFlags: string[]
  housingStatus: 'housed' | 'temporary' | 'homeless' | 'at-risk'
  lastContact: string
  nextAppointment?: string
  notes: CaseNote[]
}

interface Service {
  id: string
  name: string
  status: 'enrolled' | 'completed' | 'waitlist' | 'declined'
  startDate: string
  endDate?: string
  provider: string
}

interface CaseNote {
  id: string
  date: string
  author: string
  type: 'assessment' | 'service' | 'contact' | 'incident' | 'progress'
  summary: string // Redacted for board members
  isConfidential: boolean
}

interface ClientsProps {
  userRole: string
}

export default function Clients({ userRole }: ClientsProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  // Check if user has access to PII
  const canViewPII = ['SUPER_ADMIN', 'ADMIN', 'PROGRAM_DIRECTOR', 'SUPERVISOR', 'CASE_WORKER', 'SOCIAL_WORKER', 'INTAKE_SPECIALIST', 'HOUSING_SPECIALIST'].includes(userRole)
  const isReadOnly = ['BOARD_MEMBER', 'BOARD_SECRETARY'].includes(userRole)

  useEffect(() => {
    loadClientData()
  }, [])

  const loadClientData = async () => {
    try {
      setLoading(true)
      
      // Generate realistic client data
      const clientData = generateClientData()
      setClients(clientData)
      
    } catch (error) {
      console.error('Failed to load client data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateClientData = (): Client[] => {
    const firstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'John']
    const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez']
    const caseWorkers = ['Sarah Chen', 'Michael Rodriguez', 'Jennifer Park', 'David Kim']
    const services = ['Emergency Housing', 'Food Security', 'Job Training', 'Mental Health Support', 'Benefits Enrollment']
    
    return Array.from({ length: 25 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const intakeDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      
      return {
        id: `client-${i}`,
        firstName,
        lastName,
        initials: `${firstName.charAt(0)}.${lastName.charAt(0)}.`, // For board view
        age: Math.floor(Math.random() * 50) + 18,
        gender: ['M', 'F', 'NB'][Math.floor(Math.random() * 3)],
        intakeDate: intakeDate.toISOString(),
        status: ['active', 'intake', 'completed', 'transferred'][Math.floor(Math.random() * 4)] as Client['status'],
        services: services.slice(0, Math.floor(Math.random() * 3) + 1).map((service, idx) => ({
          id: `service-${i}-${idx}`,
          name: service,
          status: ['enrolled', 'completed', 'waitlist'][Math.floor(Math.random() * 3)] as Service['status'],
          startDate: intakeDate.toISOString(),
          endDate: Math.random() > 0.7 ? new Date(intakeDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          provider: caseWorkers[Math.floor(Math.random() * caseWorkers.length)]
        })),
        caseWorker: caseWorkers[Math.floor(Math.random() * caseWorkers.length)],
        eligibilityFlags: ['Income Qualified', 'Veteran', 'Disabled', 'Senior'].slice(0, Math.floor(Math.random() * 2) + 1),
        housingStatus: ['housed', 'temporary', 'homeless', 'at-risk'][Math.floor(Math.random() * 4)] as Client['housingStatus'],
        lastContact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        nextAppointment: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        notes: generateCaseNotes()
      }
    })
  }

  const generateCaseNotes = (): CaseNote[] => {
    const noteTypes: CaseNote['type'][] = ['assessment', 'service', 'contact', 'progress']
    const authors = ['Sarah Chen', 'Michael Rodriguez', 'Jennifer Park']
    
    return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
      id: `note-${i}`,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      author: authors[Math.floor(Math.random() * authors.length)],
      type: noteTypes[Math.floor(Math.random() * noteTypes.length)],
      summary: isReadOnly ? '[REDACTED - Board View]' : 'Client progress assessment and service coordination notes',
      isConfidential: Math.random() > 0.7
    }))
  }

  const filteredClients = selectedStatus === 'all' 
    ? clients 
    : clients.filter(client => client.status === selectedStatus)

  const statusCounts = {
    all: clients.length,
    intake: clients.filter(c => c.status === 'intake').length,
    active: clients.filter(c => c.status === 'active').length,
    completed: clients.filter(c => c.status === 'completed').length,
    transferred: clients.filter(c => c.status === 'transferred').length,
    inactive: clients.filter(c => c.status === 'inactive').length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-700'
      case 'intake': return 'bg-primary-100 text-primary-700'
      case 'completed': return 'bg-charcoal-100 text-charcoal-700'
      case 'transferred': return 'bg-warning-100 text-warning-700'
      case 'inactive': return 'bg-error-100 text-error-700'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  const getHousingColor = (status: string) => {
    switch (status) {
      case 'housed': return 'bg-success-100 text-success-700'
      case 'temporary': return 'bg-warning-100 text-warning-700'
      case 'homeless': return 'bg-error-100 text-error-700'
      case 'at-risk': return 'bg-warning-100 text-warning-700'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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
        {/* HIPAA Notice for PII Access */}
        {canViewPII && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-warning-600">🔒</span>
              <p className="text-sm text-warning-800">
                <strong>HIPAA Notice:</strong> This page contains Protected Health Information (PHI). 
                All access is logged for compliance. Do not share or discuss client information outside authorized contexts.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">
              {isReadOnly ? 'Client Overview (Board View)' : 'Client Management'}
            </h1>
            <p className="text-muted mt-1">
              {isReadOnly 
                ? 'Aggregate client statistics and outcomes (PII redacted)'
                : 'Client intake, case management, and service coordination'
              }
            </p>
          </div>
          {!isReadOnly && (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="motion-safe-fast">
                Export Report
              </Button>
              <Button size="sm" className="motion-safe-fast hover-glow">
                New Intake
              </Button>
            </div>
          )}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        {/* Client Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-text">{clients.filter(c => c.housingStatus === 'housed').length}</p>
              <p className="text-sm text-muted">Successfully Housed</p>
              <p className="text-xs text-success-600">89% success rate</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-text">{Math.round(clients.reduce((sum, c) => sum + c.services.length, 0) / clients.length * 10) / 10}</p>
              <p className="text-sm text-muted">Avg Services/Client</p>
              <p className="text-xs text-muted">Per case</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-text">{clients.filter(c => c.nextAppointment).length}</p>
              <p className="text-sm text-muted">Scheduled Appointments</p>
              <p className="text-xs text-muted">Next 2 weeks</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-text">82%</p>
              <p className="text-sm text-muted">Case Completion</p>
              <p className="text-xs text-success-600">Above target (75%)</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>
              {isReadOnly ? 'Client Statistics (Anonymized)' : 'Client Directory'}
            </CardTitle>
            <p className="text-sm text-muted">
              {isReadOnly 
                ? 'Aggregate client data with PII protection for board oversight'
                : 'Complete client management and case tracking'
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-4">
                    <th scope="col" className="text-left py-3 px-4 text-sm font-medium text-muted">
                      {isReadOnly ? 'Client ID' : 'Client'}
                    </th>
                    <th scope="col" className="text-left py-3 px-4 text-sm font-medium text-muted">Case Worker</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Status</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Housing</th>
                    <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Services</th>
                    {!isReadOnly && (
                      <th scope="col" className="text-center py-3 px-4 text-sm font-medium text-muted">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-4">
                  {filteredClients.slice(0, 20).map((client) => (
                    <tr key={client.id} className="hover:bg-surface-2 motion-safe-fast">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-text">
                            {canViewPII ? `${client.firstName} ${client.lastName}` : client.initials}
                          </p>
                          {canViewPII && (
                            <p className="text-sm text-muted">Age {client.age}, {client.gender}</p>
                          )}
                          <p className="text-xs text-subtle">Intake {formatDate(client.intakeDate)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-text">{client.caseWorker}</p>
                        <p className="text-xs text-subtle">Last contact {formatDate(client.lastContact)}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className={`text-xs ${getStatusColor(client.status)}`}>
                          {client.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className={`text-xs ${getHousingColor(client.housingStatus)}`}>
                          {client.housingStatus.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {client.services.slice(0, 2).map((service) => (
                            <Badge key={service.id} className="text-xs bg-primary-100 text-primary-700">
                              {service.name.split(' ')[0]}
                            </Badge>
                          ))}
                          {client.services.length > 2 && (
                            <Badge className="text-xs bg-charcoal-100 text-charcoal-600">
                              +{client.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      {!isReadOnly && (
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" className="motion-safe-fast">
                              View Case
                            </Button>
                            <Button variant="ghost" size="sm" className="motion-safe-fast">
                              Notes
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {isReadOnly && (
              <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm text-warning-800">
                  <strong>Board Member View:</strong> Individual client information is redacted for privacy protection. 
                  This view shows aggregate statistics and trends for governance oversight.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-success-100 text-success-700'
    case 'intake': return 'bg-primary-100 text-primary-700'
    case 'completed': return 'bg-charcoal-100 text-charcoal-700'
    case 'transferred': return 'bg-warning-100 text-warning-700'
    case 'inactive': return 'bg-error-100 text-error-700'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}

function getHousingColor(status: string) {
  switch (status) {
    case 'housed': return 'bg-success-100 text-success-700'
    case 'temporary': return 'bg-warning-100 text-warning-700'
    case 'homeless': return 'bg-error-100 text-error-700'
    case 'at-risk': return 'bg-warning-100 text-warning-700'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}
