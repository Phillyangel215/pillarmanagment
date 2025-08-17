export type DemoNotification = {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  timestamp: string
}

export type DemoSummary = {
  fundraising: {
    raised: number
    pledges: number
    donors: number
    avgGift: number
  }
  hr: {
    headcount: number
    openPositions: number
  }
  programs: {
    activeClients: number
    completionRate: number
  }
  governance: {
    upcomingMeetings: number
    openMotions: number
  }
}

export type DemoSeed = {
  notifications: DemoNotification[]
  summary: DemoSummary
}

function formatDate(date: Date): string {
  return new Date(date).toISOString()
}

export function buildSeedData(): DemoSeed {
  const now = new Date()
  const notifications: DemoNotification[] = [
    {
      id: 'n-1001',
      title: 'Board meeting scheduled',
      message: 'The quarterly board meeting has been scheduled for next Tuesday at 10:00 AM.',
      type: 'info',
      isRead: false,
      timestamp: formatDate(new Date(now.getTime() - 1 * 60 * 60 * 1000)),
    },
    {
      id: 'n-1002',
      title: 'New donor pledge',
      message: 'A major donor pledged $25,000 toward the capital campaign.',
      type: 'success',
      isRead: false,
      timestamp: formatDate(new Date(now.getTime() - 3 * 60 * 60 * 1000)),
    },
    {
      id: 'n-1003',
      title: 'Policy acknowledgement overdue',
      message: '3 staff members have not yet acknowledged the updated Code of Conduct.',
      type: 'warning',
      isRead: true,
      timestamp: formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
    },
    {
      id: 'n-1004',
      title: 'Grant report due',
      message: 'The annual foundation grant report is due Friday.',
      type: 'error',
      isRead: true,
      timestamp: formatDate(new Date(now.getTime() - 48 * 60 * 60 * 1000)),
    },
  ]

  const summary: DemoSummary = {
    fundraising: {
      raised: 184500,
      pledges: 42000,
      donors: 126,
      avgGift: 585,
    },
    hr: {
      headcount: 84,
      openPositions: 3,
    },
    programs: {
      activeClients: 312,
      completionRate: 0.78,
    },
    governance: {
      upcomingMeetings: 2,
      openMotions: 4,
    },
  }

  return { notifications, summary }
}

