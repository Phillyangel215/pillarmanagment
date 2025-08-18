import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Table } from '@/components/ui/Table'

export function CaseManagement() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text">Case Management</h1>
            <p className="text-muted mt-1">Manage client cases and service delivery</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">Export Cases</Button>
            <Button>New Case</Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                id="search"
                label="Search"
                placeholder="Search cases..."
                className="md:col-span-2"
              />
              <Select
                id="status"
                label="Status"
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'closed', label: 'Closed' }
                ]}
                placeholder="Filter by status"
              />
              <Select
                id="priority"
                label="Priority"
                options={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'high', label: 'High Priority' },
                  { value: 'medium', label: 'Medium Priority' },
                  { value: 'low', label: 'Low Priority' }
                ]}
                placeholder="Filter by priority"
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Active Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">247</div>
              <p className="text-xs text-success mt-1">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">18</div>
              <p className="text-xs text-warning mt-1">5 overdue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Cases Closed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">156</div>
              <p className="text-xs text-success mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted">Avg. Resolution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">23 days</div>
              <p className="text-xs text-success mt-1">-2 days vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
          </CardHeader>
          <CardContent>
                                      <Table
               data={[
                 {
                   id: 'CM-2024-001',
                   clientName: 'Sarah Johnson',
                   caseType: 'Housing Assistance',
                   status: 'Active',
                   priority: 'High',
                   assignedTo: 'Maria Rodriguez',
                   lastUpdated: '2 hours ago'
                 },
                 {
                   id: 'CM-2024-002',
                   clientName: 'Michael Chen',
                   caseType: 'Employment Support',
                   status: 'Pending',
                   priority: 'Medium',
                   assignedTo: 'John Smith',
                   lastUpdated: '1 day ago'
                 },
                 {
                   id: 'CM-2024-003',
                   clientName: 'Emily Davis',
                   caseType: 'Mental Health',
                   status: 'Closed',
                   priority: 'Medium',
                   assignedTo: 'Lisa Thompson',
                   lastUpdated: '3 days ago'
                 },
                 {
                   id: 'CM-2024-004',
                   clientName: 'David Wilson',
                   caseType: 'Substance Abuse',
                   status: 'Active',
                   priority: 'High',
                   assignedTo: 'Robert Brown',
                   lastUpdated: '5 hours ago'
                 },
                 {
                   id: 'CM-2024-005',
                   clientName: 'Jennifer Lee',
                   caseType: 'Family Services',
                   status: 'Pending',
                   priority: 'Low',
                   assignedTo: 'Amanda Garcia',
                   lastUpdated: '1 week ago'
                 }
               ]}
               columns={[
                 { id: 'id', accessorKey: 'id', header: 'Case ID' },
                 { id: 'clientName', accessorKey: 'clientName', header: 'Client Name' },
                 { id: 'caseType', accessorKey: 'caseType', header: 'Case Type' },
                 { id: 'status', accessorKey: 'status', header: 'Status' },
                 { id: 'priority', accessorKey: 'priority', header: 'Priority' },
                 { id: 'assignedTo', accessorKey: 'assignedTo', header: 'Assigned To' },
                 { id: 'lastUpdated', accessorKey: 'lastUpdated', header: 'Last Updated' },
                 { id: 'actions', accessorKey: 'actions', header: 'Actions' }
               ]}
             />
          </CardContent>
        </Card>

        {/* Case Types Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Housing Assistance</h4>
                    <p className="text-sm text-muted">Emergency and transitional housing</p>
                  </div>
                  <Badge variant="default">89 cases</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Employment Support</h4>
                    <p className="text-sm text-muted">Job training and placement</p>
                  </div>
                  <Badge variant="default">67 cases</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Mental Health</h4>
                    <p className="text-sm text-muted">Counseling and therapy</p>
                  </div>
                  <Badge variant="default">45 cases</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Substance Abuse</h4>
                    <p className="text-sm text-muted">Treatment and recovery</p>
                  </div>
                  <Badge variant="default">32 cases</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Case CM-2024-001 updated</p>
                    <p className="text-sm text-muted">Housing application submitted</p>
                  </div>
                  <span className="text-xs text-muted">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">New case assigned</p>
                    <p className="text-sm text-muted">CM-2024-006 to Maria Rodriguez</p>
                  </div>
                  <span className="text-xs text-muted">4 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text">Case CM-2024-003 closed</p>
                    <p className="text-sm text-muted">Successfully completed</p>
                  </div>
                  <span className="text-xs text-muted">1 day ago</span>
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
                 <span className="text-lg">📝</span>
                 <span className="text-sm">New Case</span>
               </Button>
               <Button variant="secondary" className="h-20 flex-col">
                 <span className="text-lg">📊</span>
                 <span className="text-sm">Case Report</span>
               </Button>
               <Button variant="secondary" className="h-20 flex-col">
                 <span className="text-lg">📅</span>
                 <span className="text-sm">Schedule Review</span>
               </Button>
               <Button variant="secondary" className="h-20 flex-col">
                 <span className="text-lg">📋</span>
                 <span className="text-sm">Assign Case</span>
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
