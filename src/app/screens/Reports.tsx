import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ProgressRing } from '@/components/ui/ProgressRing'

export function Reports() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text">Reports & Analytics</h1>
            <p className="text-muted mt-1">Generate and view organizational reports</p>
          </div>
          <div className="flex gap-3">
                         <Button variant="secondary">Export All</Button>
            <Button>Generate Report</Button>
          </div>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Client Demographics</CardTitle>
            </CardHeader>
            <CardContent>
                             <div className="text-2xl font-bold text-text">1,247</div>
               <p className="text-xs text-success mt-1">Active clients</p>
               <Button variant="secondary" size="sm" className="mt-3 w-full">View Report</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Service Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
                             <div className="text-2xl font-bold text-text">89%</div>
               <p className="text-xs text-success mt-1">Success rate</p>
               <Button variant="secondary" size="sm" className="mt-3 w-full">View Report</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
                             <div className="text-2xl font-bold text-text">$2.4M</div>
               <p className="text-xs text-success mt-1">Total budget</p>
               <Button variant="secondary" size="sm" className="mt-3 w-full">View Report</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Staff Performance</CardTitle>
            </CardHeader>
            <CardContent>
                             <div className="text-2xl font-bold text-text">47</div>
               <p className="text-xs text-muted mt-1">Staff members</p>
               <Button variant="secondary" size="sm" className="mt-3 w-full">View Report</Button>
            </CardContent>
          </Card>
        </div>

        {/* Report Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Custom Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                id="reportType"
                label="Report Type"
                options={[
                  { value: 'demographics', label: 'Client Demographics' },
                  { value: 'outcomes', label: 'Service Outcomes' },
                  { value: 'financial', label: 'Financial Summary' },
                  { value: 'performance', label: 'Staff Performance' },
                  { value: 'compliance', label: 'Compliance Report' }
                ]}
                placeholder="Select report type"
              />
              <Select
                id="dateRange"
                label="Date Range"
                options={[
                  { value: 'last-week', label: 'Last Week' },
                  { value: 'last-month', label: 'Last Month' },
                  { value: 'last-quarter', label: 'Last Quarter' },
                  { value: 'last-year', label: 'Last Year' },
                  { value: 'custom', label: 'Custom Range' }
                ]}
                placeholder="Select date range"
              />
              <Select
                id="format"
                label="Export Format"
                options={[
                  { value: 'pdf', label: 'PDF' },
                  { value: 'excel', label: 'Excel' },
                  { value: 'csv', label: 'CSV' },
                  { value: 'json', label: 'JSON' }
                ]}
                placeholder="Select format"
              />
            </div>
            <div className="flex justify-end">
              <Button>Generate Report</Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Client Intake</h4>
                    <p className="text-sm text-muted">New clients this month</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-text">156</div>
                                         <ProgressRing value={78} size="lg" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Case Resolution</h4>
                    <p className="text-sm text-muted">Cases closed this month</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-text">89</div>
                                         <ProgressRing value={65} size="lg" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Fundraising</h4>
                    <p className="text-sm text-muted">Funds raised this month</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-text">$847K</div>
                                         <ProgressRing value={92} size="lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Q4 Financial Report</p>
                    <p className="text-sm text-muted">Generated 2 hours ago</p>
                  </div>
                  <Badge variant="success">PDF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Client Demographics</p>
                    <p className="text-sm text-muted">Generated 1 day ago</p>
                  </div>
                  <Badge variant="default">Excel</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Staff Performance</p>
                    <p className="text-sm text-muted">Generated 3 days ago</p>
                  </div>
                  <Badge variant="default">PDF</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Compliance Report</p>
                    <p className="text-sm text-muted">Generated 1 week ago</p>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                <div>
                  <h4 className="font-medium text-text">Monthly Board Report</h4>
                  <p className="text-sm text-muted">Automatically generated on the 1st of each month</p>
                  <p className="text-sm text-muted">Recipients: Board Members, Executive Team</p>
                </div>
                <div className="text-right">
                  <Badge variant="success">Active</Badge>
                  <p className="text-xs text-muted mt-1">Next: Jan 1, 2025</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                <div>
                  <h4 className="font-medium text-text">Weekly Staff Report</h4>
                  <p className="text-sm text-muted">Generated every Monday at 9:00 AM</p>
                  <p className="text-sm text-muted">Recipients: All Staff</p>
                </div>
                <div className="text-right">
                  <Badge variant="success">Active</Badge>
                  <p className="text-xs text-muted mt-1">Next: Dec 16, 2024</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                <div>
                  <h4 className="font-medium text-text">Quarterly Compliance Report</h4>
                  <p className="text-sm text-muted">Generated quarterly for regulatory compliance</p>
                  <p className="text-sm text-muted">Recipients: Compliance Officer, CEO</p>
                </div>
                <div className="text-right">
                  <Badge variant="warning">Paused</Badge>
                  <p className="text-xs text-muted mt-1">Next: Jan 1, 2025</p>
                </div>
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
                 <span className="text-lg">📊</span>
                 <span className="text-sm">Dashboard</span>
               </Button>
               <Button variant="secondary" className="h-20 flex-col">
                 <span className="text-lg">📈</span>
                 <span className="text-sm">Analytics</span>
               </Button>
               <Button variant="secondary" className="h-20 flex-col">
                 <span className="text-lg">📅</span>
                 <span className="text-sm">Schedule</span>
               </Button>
               <Button variant="secondary" className="h-20 flex-col">
                 <span className="text-lg">⚙️</span>
                 <span className="text-sm">Settings</span>
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
