export type DemoNotification = {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  timestamp: string
}

export type DemoSummary = {
  fundraising: { raised: number; pledges: number; donors: number; avgGift: number }
  hr: { headcount: number; openPositions: number }
  programs: { activeClients: number; completionRate: number }
  governance: { upcomingMeetings: number; openMotions: number }
}

export function buildSeedData() {
  const notifications: DemoNotification[] = [
    {
      id: '1',
      title: 'New client intake',
      message: 'Sarah Johnson has been assigned to your caseload',
      type: 'info',
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      title: 'Housing placement confirmed',
      message: 'Michael Chen has been successfully placed in transitional housing',
      type: 'success',
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      title: 'Compliance deadline approaching',
      message: 'Monthly reports due in 3 days',
      type: 'warning',
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ]

  const summary: DemoSummary = {
    fundraising: { raised: 125000, pledges: 35000, donors: 247, avgGift: 508 },
    hr: { headcount: 42, openPositions: 3 },
    programs: { activeClients: 186, completionRate: 78 },
    governance: { upcomingMeetings: 2, openMotions: 1 },
  }

  return { notifications, summary }
}
