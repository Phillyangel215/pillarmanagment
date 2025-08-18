import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'

export function Dashboard_DevelopmentDirector() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text">Development Director Dashboard</h1>
            <p className="text-muted mt-1">Fundraising & Donor Management Overview</p>
          </div>
          <div className="flex gap-3">
                         <Button variant="secondary">Export Report</Button>
            <Button>New Campaign</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">$847,392</div>
              <p className="text-xs text-success mt-1">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Active Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">1,247</div>
              <p className="text-xs text-success mt-1">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">12</div>
              <p className="text-xs text-muted mt-1">3 active, 9 completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Grant Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">8</div>
              <p className="text-xs text-warning mt-1">2 pending review</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Holiday Giving Drive</h4>
                    <p className="text-sm text-muted">Goal: $500,000</p>
                  </div>
                                     <ProgressRing value={75} size="xl" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Corporate Sponsorship</h4>
                    <p className="text-sm text-muted">Goal: $200,000</p>
                  </div>
                                     <ProgressRing value={45} size="xl" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Emergency Fund</h4>
                    <p className="text-sm text-muted">Goal: $100,000</p>
                  </div>
                                     <ProgressRing value={90} size="xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Anonymous Donor</p>
                    <p className="text-sm text-muted">2 hours ago</p>
                  </div>
                  <Badge variant="success">$25,000</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Acme Corporation</p>
                    <p className="text-sm text-muted">1 day ago</p>
                  </div>
                  <Badge variant="success">$50,000</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Sarah Johnson</p>
                    <p className="text-sm text-muted">3 days ago</p>
                  </div>
                  <Badge variant="success">$1,000</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">📧</span>
                <span className="text-sm">Send Newsletter</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">📊</span>
                <span className="text-sm">Generate Report</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">🎯</span>
                <span className="text-sm">New Campaign</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">👥</span>
                <span className="text-sm">Donor Outreach</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
