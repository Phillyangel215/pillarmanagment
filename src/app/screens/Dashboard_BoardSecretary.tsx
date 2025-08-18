import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'
import Logo from '@/components/common/Logo'

export function Dashboard_BoardSecretary() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo size="md" variant="default" animated={false} showText={false} />
            <div>
              <h1 className="text-3xl font-bold text-text">Board Secretary Dashboard</h1>
              <p className="text-muted mt-1">Governance & Board Meeting Management</p>
            </div>
          </div>
          <div className="flex gap-3">
                         <Button variant="secondary">Export Minutes</Button>
            <Button>Schedule Meeting</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Board Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">12</div>
              <p className="text-xs text-muted mt-1">2 new this quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Meetings This Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">24</div>
              <p className="text-xs text-success mt-1">100% attendance rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">3</div>
              <p className="text-xs text-warning mt-1">Due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">98%</div>
              <p className="text-xs text-success mt-1">+1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Board Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <h4 className="font-medium text-text">Q4 Board Meeting</h4>
                    <p className="text-sm text-muted">Dec 20, 2024 • 2:00 PM</p>
                    <p className="text-sm text-muted">Budget Review & Strategic Planning</p>
                  </div>
                  <Badge variant="warning">Scheduled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <h4 className="font-medium text-text">Executive Committee</h4>
                    <p className="text-sm text-muted">Dec 15, 2024 • 10:00 AM</p>
                    <p className="text-sm text-muted">Leadership Updates</p>
                  </div>
                  <Badge variant="warning">Scheduled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <h4 className="font-medium text-text">Annual Retreat</h4>
                    <p className="text-sm text-muted">Jan 15, 2025 • 9:00 AM</p>
                    <p className="text-sm text-muted">Strategic Planning Session</p>
                  </div>
                  <Badge variant="default">Planning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Meeting Minutes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Q3 Board Meeting</p>
                    <p className="text-sm text-muted">Nov 15, 2024</p>
                  </div>
                  <Badge variant="success">Approved</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Finance Committee</p>
                    <p className="text-sm text-muted">Nov 10, 2024</p>
                  </div>
                  <Badge variant="success">Approved</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Governance Committee</p>
                    <p className="text-sm text-muted">Nov 5, 2024</p>
                  </div>
                  <Badge variant="warning">Pending Review</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Governance Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Governance Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text">Bylaws Review</h4>
                  <p className="text-sm text-muted">Annual review of organizational bylaws</p>
                </div>
                                 <ProgressRing value={75} size="lg" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text">Conflict of Interest Forms</h4>
                  <p className="text-sm text-muted">Collect annual conflict of interest disclosures</p>
                </div>
                                 <ProgressRing value={90} size="lg" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text">Board Evaluation</h4>
                  <p className="text-sm text-muted">Annual board self-assessment</p>
                </div>
                                 <ProgressRing value={30} size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">📅</span>
                <span className="text-sm">Schedule Meeting</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">📝</span>
                <span className="text-sm">Draft Minutes</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">📋</span>
                <span className="text-sm">Send Agenda</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">📊</span>
                <span className="text-sm">Board Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
