import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'

export function Dashboard_HRManager() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text">HR Manager Dashboard</h1>
            <p className="text-muted mt-1">Staff Management & Training Overview</p>
          </div>
          <div className="flex gap-3">
                         <Button variant="secondary">Export Report</Button>
            <Button>Add Employee</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">47</div>
              <p className="text-xs text-success mt-1">+3 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Active Trainings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">8</div>
              <p className="text-xs text-warning mt-1">3 due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">94%</div>
              <p className="text-xs text-success mt-1">+2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">5</div>
              <p className="text-xs text-muted mt-1">2 interviews scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Staff Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Case Management</h4>
                    <p className="text-sm text-muted">12 staff members</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Housing Services</h4>
                    <p className="text-sm text-muted">8 staff members</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Administration</h4>
                    <p className="text-sm text-muted">6 staff members</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Development</h4>
                    <p className="text-sm text-muted">4 staff members</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">HIPAA Compliance</h4>
                    <p className="text-sm text-muted">Due: Dec 15, 2024</p>
                  </div>
                                     <ProgressRing value={85} size="lg" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Safety Training</h4>
                    <p className="text-sm text-muted">Due: Dec 20, 2024</p>
                  </div>
                                     <ProgressRing value={60} size="lg" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Cultural Competency</h4>
                    <p className="text-sm text-muted">Due: Jan 5, 2025</p>
                  </div>
                                     <ProgressRing value={95} size="lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent HR Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text">New hire: Maria Rodriguez</p>
                  <p className="text-sm text-muted">Case Worker - Started today</p>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text">Training completed: John Smith</p>
                  <p className="text-sm text-muted">HIPAA Compliance - 2 hours ago</p>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text">Performance review scheduled</p>
                  <p className="text-sm text-muted">Sarah Johnson - Tomorrow 2:00 PM</p>
                </div>
                <Badge variant="warning">Pending</Badge>
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
                <span className="text-lg">👤</span>
                <span className="text-sm">Add Employee</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">📋</span>
                <span className="text-sm">Schedule Review</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">🎓</span>
                <span className="text-sm">Assign Training</span>
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <span className="text-lg">📊</span>
                <span className="text-sm">Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
