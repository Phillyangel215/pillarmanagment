/**
 * @fileoverview Governance - Board management and meeting tools
 * @description Agenda builder, voting system, minutes, board packets, and e-signature prep
 * @version 1.0.0 - Production implementation
 * @requires Demo services for governance data
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface BoardMeeting {
  id: string
  title: string
  date: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  attendees: BoardMember[]
  agenda: AgendaItem[]
  quorumMet: boolean
  minutesStatus: 'draft' | 'review' | 'approved'
  boardPacketReady: boolean
}

interface BoardMember {
  id: string
  name: string
  title: string
  attendance: 'present' | 'absent' | 'proxy'
  votingRights: boolean
}

interface AgendaItem {
  id: string
  title: string
  type: 'discussion' | 'motion' | 'report' | 'executive-session'
  duration: number
  presenter: string
  materials?: string[]
  motionText?: string
  voteRequired: boolean
  voteResults?: VoteResult
}

interface VoteResult {
  aye: number
  nay: number
  abstain: number
  proxy: number
  outcome: 'passed' | 'failed' | 'tabled'
}

interface Motion {
  id: string
  title: string
  text: string
  proposedBy: string
  secondedBy: string
  status: 'pending' | 'voted' | 'tabled' | 'withdrawn'
  voteResults?: VoteResult
  meetingId: string
}

export default function Governance() {
  const [meetings, setMeetings] = useState<BoardMeeting[]>([])
  const [motions, setMotions] = useState<Motion[]>([])
  const [selectedView, setSelectedView] = useState<'meetings' | 'motions' | 'minutes'>('meetings')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGovernanceData()
  }, [])

  const loadGovernanceData = async () => {
    try {
      setLoading(true)
      
      // Generate realistic governance data
      const meetingData = generateMeetingData()
      setMeetings(meetingData)
      
      // Generate motion data
      setMotions(generateMotionData(meetingData))
      
    } catch (error) {
      console.error('Failed to load governance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMeetingData = (): BoardMeeting[] => {
    const boardMembers: BoardMember[] = [
      { id: 'bm-1', name: 'Dr. Sarah Johnson', title: 'Board Chair', attendance: 'present', votingRights: true },
      { id: 'bm-2', name: 'Michael Chen', title: 'Vice Chair', attendance: 'present', votingRights: true },
      { id: 'bm-3', name: 'Jennifer Rodriguez', title: 'Treasurer', attendance: 'present', votingRights: true },
      { id: 'bm-4', name: 'David Park', title: 'Secretary', attendance: 'present', votingRights: true },
      { id: 'bm-5', name: 'Emily Williams', title: 'Board Member', attendance: 'proxy', votingRights: true },
      { id: 'bm-6', name: 'Robert Kim', title: 'Board Member', attendance: 'present', votingRights: true },
      { id: 'bm-7', name: 'Lisa Martinez', title: 'Board Member', attendance: 'absent', votingRights: true }
    ]

    return Array.from({ length: 6 }, (_, i) => {
      const meetingDate = new Date(Date.now() + (i - 2) * 90 * 24 * 60 * 60 * 1000) // Quarterly meetings
      const isPast = meetingDate < new Date()
      
      return {
        id: `meeting-${i}`,
        title: `${['Q1', 'Q2', 'Q3', 'Q4', 'Annual', 'Special'][i]} Board Meeting 2024`,
        date: meetingDate.toISOString(),
        status: isPast ? 'completed' : i === 2 ? 'in-progress' : 'scheduled',
        attendees: boardMembers.map(member => ({
          ...member,
          attendance: isPast ? member.attendance : 'present'
        })),
        agenda: generateAgendaItems(),
        quorumMet: isPast ? true : boardMembers.filter(m => m.attendance !== 'absent').length >= 4,
        minutesStatus: isPast ? (['approved', 'review', 'draft'][Math.floor(Math.random() * 3)] as any) : 'draft',
        boardPacketReady: isPast || i === 2
      }
    })
  }

  const generateAgendaItems = (): AgendaItem[] => {
    const items = [
      { title: 'Call to Order & Roll Call', type: 'discussion' as const, duration: 5, presenter: 'Board Chair' },
      { title: 'Approval of Previous Minutes', type: 'motion' as const, duration: 10, presenter: 'Board Secretary', voteRequired: true },
      { title: 'Executive Director Report', type: 'report' as const, duration: 20, presenter: 'Executive Director' },
      { title: 'Financial Report', type: 'report' as const, duration: 15, presenter: 'Treasurer' },
      { title: 'Program Outcomes Review', type: 'report' as const, duration: 25, presenter: 'Program Director' },
      { title: 'Budget Amendment Motion', type: 'motion' as const, duration: 20, presenter: 'Treasurer', voteRequired: true },
      { title: 'Executive Session', type: 'executive-session' as const, duration: 30, presenter: 'Board Chair' }
    ]

    return items.map((item, index) => ({
      id: `agenda-${index}`,
      ...item,
      voteRequired: item.voteRequired || false, // Ensure voteRequired is always defined
      materials: item.type === 'report' ? [`${item.title.replace(' ', '_')}.pdf`] : undefined,
      motionText: item.type === 'motion' ? `Motion to ${item.title.toLowerCase()}` : undefined,
      voteResults: item.voteRequired && Math.random() > 0.5 ? {
        aye: Math.floor(Math.random() * 5) + 4,
        nay: Math.floor(Math.random() * 2),
        abstain: Math.floor(Math.random() * 2),
        proxy: 1,
        outcome: 'passed' as const
      } : undefined
    }))
  }

  const generateMotionData = (meetings: BoardMeeting[]): Motion[] => {
    const motionTexts = [
      'Motion to approve the annual budget for fiscal year 2024',
      'Motion to authorize the Executive Director to sign the housing services contract',
      'Motion to establish a new program evaluation committee',
      'Motion to approve the board development policy',
      'Motion to authorize capital expenditure for facility improvements'
    ]

    return motionTexts.map((text, index) => ({
      id: `motion-${index}`,
      title: text.replace('Motion to ', '').charAt(0).toUpperCase() + text.replace('Motion to ', '').slice(1),
      text,
      proposedBy: 'Dr. Sarah Johnson',
      secondedBy: 'Michael Chen',
      status: ['voted', 'pending', 'voted', 'voted', 'pending'][index] as Motion['status'],
      voteResults: index % 2 === 0 ? {
        aye: 6,
        nay: 1,
        abstain: 0,
        proxy: 1,
        outcome: 'passed' as const
      } : undefined,
      meetingId: meetings[Math.floor(index / 2)]?.id || 'meeting-0'
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-700 border-success-200'
      case 'in-progress': return 'bg-primary-100 text-primary-700 border-primary-200'
      case 'scheduled': return 'bg-warning-100 text-warning-700 border-warning-200'
      case 'cancelled': return 'bg-error-100 text-error-700 border-error-200'
      default: return 'bg-charcoal-100 text-charcoal-600'
    }
  }

  const getMinutesColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success-100 text-success-700'
      case 'review': return 'bg-warning-100 text-warning-700'
      case 'draft': return 'bg-charcoal-100 text-charcoal-700'
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
                <div key={i} className="h-48 bg-surface-2 rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-text">Board Governance</h1>
            <p className="text-muted mt-1">Meeting management, voting, minutes, and board packet preparation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="motion-safe-fast">
              Build Board Book
            </Button>
            <Button size="sm" className="motion-safe-fast hover-glow">
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex items-center gap-2">
          {(['meetings', 'motions', 'minutes'] as const).map((view) => (
            <Button
              key={view}
              variant={selectedView === view ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedView(view)}
              className="motion-safe-fast"
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </div>

        {/* Meetings View */}
        {selectedView === 'meetings' && (
          <div className="space-y-6">
            {/* Next Meeting Card */}
            {meetings.filter(m => new Date(m.date) > new Date()).length > 0 && (
              <Card className="glass-card border-primary-500/20">
                <CardHeader>
                  <CardTitle className="text-primary-400">Next Board Meeting</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const nextMeeting = meetings.filter(m => new Date(m.date) > new Date())[0]
                    return (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-text">{nextMeeting.title}</h3>
                          <p className="text-muted">{formatDate(nextMeeting.date)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted">Quorum:</span>
                            <Badge className={nextMeeting.quorumMet ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}>
                              {nextMeeting.quorumMet ? 'Met' : 'Pending'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted">Board Packet:</span>
                            <Badge className={nextMeeting.boardPacketReady ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}>
                              {nextMeeting.boardPacketReady ? 'Ready' : 'In Progress'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" className="motion-safe-fast">
                            View Agenda
                          </Button>
                          <Button variant="outline" size="sm" className="motion-safe-fast">
                            Board Packet
                          </Button>
                          <Button variant="outline" size="sm" className="motion-safe-fast">
                            Join Meeting
                          </Button>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Meetings List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="glass-card motion-safe hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                      <Badge className={`text-xs ${getStatusColor(meeting.status)}`}>
                        {meeting.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted">{formatDate(meeting.date)}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Attendees:</span>
                        <span className="text-text">{meeting.attendees.filter(a => a.attendance === 'present').length}/{meeting.attendees.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Agenda Items:</span>
                        <span className="text-text">{meeting.agenda.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Minutes:</span>
                        <Badge className={`text-xs ${getMinutesColor(meeting.minutesStatus)}`}>
                          {meeting.minutesStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Button variant="ghost" size="sm" className="motion-safe-fast">
                          View Details
                        </Button>
                        {meeting.status === 'completed' && (
                          <Button variant="ghost" size="sm" className="motion-safe-fast">
                            Minutes
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Motions View */}
        {selectedView === 'motions' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Board Motions & Voting</CardTitle>
              <p className="text-sm text-muted">Track motions, voting results, and resolutions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {motions.map((motion) => (
                  <div key={motion.id} className="p-4 rounded-lg border border-surface-4 hover:bg-surface-2 motion-safe-fast">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text">{motion.title}</h3>
                        <p className="text-sm text-muted mt-1">{motion.text}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-subtle">
                          <span>Proposed by: {motion.proposedBy}</span>
                          <span>Seconded by: {motion.secondedBy}</span>
                        </div>
                      </div>
                      <Badge className={`text-xs ${
                        motion.status === 'voted' ? 'bg-success-100 text-success-700' :
                        motion.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                        'bg-charcoal-100 text-charcoal-700'
                      }`}>
                        {motion.status}
                      </Badge>
                    </div>
                    
                    {motion.voteResults && (
                      <div className="grid grid-cols-4 gap-4 p-3 bg-surface-2 rounded-lg">
                        <div className="text-center">
                          <p className="text-lg font-bold text-success-600">{motion.voteResults.aye}</p>
                          <p className="text-xs text-muted">Aye</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-error-600">{motion.voteResults.nay}</p>
                          <p className="text-xs text-muted">Nay</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-muted">{motion.voteResults.abstain}</p>
                          <p className="text-xs text-muted">Abstain</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary-500">{motion.voteResults.proxy}</p>
                          <p className="text-xs text-muted">Proxy</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="ghost" size="sm" className="motion-safe-fast">
                        View Details
                      </Button>
                      {motion.status === 'pending' && (
                        <Button size="sm" className="motion-safe-fast">
                          Record Vote
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Minutes View */}
        {selectedView === 'minutes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Meeting Minutes</CardTitle>
                <p className="text-sm text-muted">Draft, review, and approve meeting minutes</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meetings.filter(m => m.status === 'completed').map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-2 motion-safe-fast">
                      <div>
                        <p className="font-medium text-text">{meeting.title}</p>
                        <p className="text-sm text-muted">{new Date(meeting.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getMinutesColor(meeting.minutesStatus)}`}>
                          {meeting.minutesStatus}
                        </Badge>
                        <Button variant="ghost" size="sm" className="motion-safe-fast">
                          {meeting.minutesStatus === 'draft' ? 'Edit' : 'View'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <p className="text-sm text-muted">Governance actions and decisions (read-only)</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'Motion approved', details: 'Annual budget motion passed 6-1', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
                    { action: 'Minutes approved', details: 'Q3 meeting minutes approved', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
                    { action: 'Board packet distributed', details: 'Q4 materials sent to all members', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                    { action: 'eSignature completed', details: 'Contract authorization signed', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
                    { action: 'Meeting scheduled', details: 'Annual meeting scheduled for December', timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
                  ].map((entry, index) => (
                    <div key={index} className="p-3 rounded-lg bg-surface-2">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text">{entry.action}</p>
                          <p className="text-xs text-muted">{entry.details}</p>
                          <p className="text-xs text-subtle mt-1">{entry.timestamp.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Governance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-text">7</p>
              <p className="text-sm text-muted">Board Members</p>
              <p className="text-xs text-success-600 mt-1">Quorum: 4 members</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-text">94%</p>
              <p className="text-sm text-muted">Attendance Rate</p>
              <p className="text-xs text-success-600 mt-1">Above target (80%)</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-text">12</p>
              <p className="text-sm text-muted">Motions YTD</p>
              <p className="text-xs text-muted mt-1">92% approval rate</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-text">2</p>
              <p className="text-sm text-muted">Pending Actions</p>
              <p className="text-xs text-warning-600 mt-1">Require follow-up</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-success-100 text-success-700 border-success-200'
    case 'in-progress': return 'bg-primary-100 text-primary-700 border-primary-200'
    case 'scheduled': return 'bg-warning-100 text-warning-700 border-warning-200'
    case 'cancelled': return 'bg-error-100 text-error-700 border-error-200'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}

function getMinutesColor(status: string) {
  switch (status) {
    case 'approved': return 'bg-success-100 text-success-700'
    case 'review': return 'bg-warning-100 text-warning-700'
    case 'draft': return 'bg-charcoal-100 text-charcoal-700'
    default: return 'bg-charcoal-100 text-charcoal-600'
  }
}
