import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Select } from '@/components/ui/Select'
import { TextArea } from '@/components/ui/TextArea'
import { Badge } from '@/components/ui/Badge'

export function Intake() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text">Client Intake</h1>
            <p className="text-muted mt-1">New client registration and initial assessment</p>
          </div>
                     <div className="flex gap-3">
             <Button variant="secondary">Save Draft</Button>
             <Button>Complete Intake</Button>
           </div>
        </div>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                <span className="font-medium text-text">Personal Information</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted text-sm font-medium">2</div>
                <span className="text-muted">Housing Assessment</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted text-sm font-medium">3</div>
                <span className="text-muted">Service Needs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="firstName"
                label="First Name"
                placeholder="Enter first name"
                required
              />
              <Input
                id="lastName"
                label="Last Name"
                placeholder="Enter last name"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="dateOfBirth"
                label="Date of Birth"
                                 type="text"
                required
              />
              <Select
                id="gender"
                label="Gender"
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'non-binary', label: 'Non-binary' },
                  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                ]}
                placeholder="Select gender"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="phone"
                label="Phone Number"
                type="tel"
                placeholder="(555) 123-4567"
                required
              />
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="client@example.com"
              />
            </div>

            <Input
              id="address"
              label="Current Address"
              placeholder="Enter current address"
              required
            />
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="emergencyName"
                label="Emergency Contact Name"
                placeholder="Enter contact name"
                required
              />
              <Input
                id="emergencyPhone"
                label="Emergency Contact Phone"
                type="tel"
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <Input
              id="emergencyRelationship"
              label="Relationship"
              placeholder="e.g., Spouse, Parent, Friend"
              required
            />
          </CardContent>
        </Card>

        {/* Housing Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Housing Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select
              id="housingStatus"
              label="Housing Status"
              options={[
                { value: 'homeless', label: 'Homeless' },
                { value: 'at-risk', label: 'At Risk of Homelessness' },
                { value: 'temporary', label: 'Temporary Housing' },
                { value: 'permanent', label: 'Permanent Housing' }
              ]}
              placeholder="Select housing status"
              required
            />
            
            <TextArea
              id="housingDetails"
              label="Additional Housing Details"
              placeholder="Please provide additional details about your current housing situation..."
              rows={4}
            />

            <div className="space-y-3">
              <h4 className="font-medium text-text">Immediate Needs</h4>
              <div className="grid grid-cols-2 gap-3">
                <Checkbox
                  id="needShelter"
                  label="Emergency Shelter"
                />
                <Checkbox
                  id="needFood"
                  label="Food Assistance"
                />
                <Checkbox
                  id="needTransportation"
                  label="Transportation"
                />
                <Checkbox
                  id="needMedical"
                  label="Medical Care"
                />
                <Checkbox
                  id="needMentalHealth"
                  label="Mental Health Services"
                />
                <Checkbox
                  id="needSubstanceAbuse"
                  label="Substance Abuse Treatment"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <h4 className="font-medium text-text">Vulnerability Score</h4>
                  <p className="text-sm text-muted">Based on age, health, and circumstances</p>
                </div>
                <Badge variant="error">High Priority</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <h4 className="font-medium text-text">Service Match</h4>
                  <p className="text-sm text-muted">Available programs and services</p>
                </div>
                <Badge variant="success">Multiple Options</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
                     <Button variant="secondary">Save Draft</Button>
          <Button>Complete Intake</Button>
        </div>
      </div>
    </div>
  )
}
