/**
 * @fileoverview Form Templates Index - Registry of all form templates
 * @description Central registry for form templates with metadata
 * @version 1.0.0 - Production implementation
 */

import { FormTemplate } from '@/services/forms'
import { FormSchema } from '@/forms/schema'

// Import template JSON files
import clientIntakeTemplate from './client-intake.json'
import hipaaConsentTemplate from './hipaa-consent.json'
import incidentReportTemplate from './incident-report.json'
import volunteerApplicationTemplate from './volunteer-application.json'

// Template registry with metadata
export const FORM_TEMPLATES: Record<string, FormTemplate> = {
  'client-intake': {
    id: 'client-intake-v1',
    slug: 'client-intake',
    name: 'Client Intake & Eligibility Assessment',
    category: 'CLIENT',
    schema: clientIntakeTemplate as FormSchema,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  
  'hipaa-consent': {
    id: 'hipaa-consent-v1',
    slug: 'hipaa-consent',
    name: 'Release of Information / HIPAA Consent',
    category: 'COMPLIANCE',
    schema: hipaaConsentTemplate as FormSchema,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  
  'incident-report': {
    id: 'incident-report-v1',
    slug: 'incident-report',
    name: 'Incident Report',
    category: 'COMPLIANCE',
    schema: incidentReportTemplate as FormSchema,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  
  'volunteer-application': {
    id: 'volunteer-application-v1',
    slug: 'volunteer-application',
    name: 'Volunteer Application & Waiver',
    category: 'HR',
    schema: volunteerApplicationTemplate as FormSchema,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
}

// Quick access functions
export function getAllTemplates(): FormTemplate[] {
  return Object.values(FORM_TEMPLATES)
}

export function getTemplateBySlug(slug: string): FormTemplate | undefined {
  return FORM_TEMPLATES[slug]
}

export function getTemplatesByCategory(category: string): FormTemplate[] {
  return getAllTemplates().filter(template => template.category === category)
}

export function getTemplatesForRole(userRoles: string[]): FormTemplate[] {
  return getAllTemplates().filter(template => 
    template.schema.allowedRoles.some(role => userRoles.includes(role))
  )
}

// Template categories for organization
export const TEMPLATE_CATEGORIES = {
  CLIENT: {
    name: 'Client Services',
    description: 'Forms for client intake, assessments, and service delivery',
    icon: '👥'
  },
  HR: {
    name: 'Human Resources',
    description: 'Employee and volunteer management forms',
    icon: '👔'
  },
  GOVERNANCE: {
    name: 'Board & Governance',
    description: 'Board meetings, resolutions, and governance documents',
    icon: '🏛️'
  },
  COMPLIANCE: {
    name: 'Compliance & Reporting',
    description: 'Incident reports, compliance documentation, and audits',
    icon: '📋'
  },
  FINANCE: {
    name: 'Finance & Development',
    description: 'Financial forms, donor management, and grants',
    icon: '💰'
  },
  OPERATIONS: {
    name: 'Operations & Safety',
    description: 'Equipment, safety, and operational forms',
    icon: '⚙️'
  }
} as const

// Form template validation
export function validateTemplate(template: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!template.slug) errors.push('Template must have a slug')
  if (!template.name) errors.push('Template must have a name')
  if (!template.category) errors.push('Template must have a category')
  if (!template.fields || !Array.isArray(template.fields)) errors.push('Template must have fields array')
  if (!template.allowedRoles || !Array.isArray(template.allowedRoles)) errors.push('Template must specify allowed roles')
  
  // Validate fields
  if (template.fields) {
    template.fields.forEach((field: any, index: number) => {
      if (!field.id) errors.push(`Field ${index} must have an id`)
      if (!field.type) errors.push(`Field ${index} must have a type`)
      if (!field.label) errors.push(`Field ${index} must have a label`)
    })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Demo data seeding
export function seedDemoTemplates(): void {
  const templates = getAllTemplates()
  localStorage.setItem('demo_form_templates', JSON.stringify(templates))
  
  // Seed some demo responses
  const demoResponses = [
    {
      id: 'demo-response-1',
      templateId: 'client-intake-v1',
      templateSlug: 'client-intake',
      status: 'submitted',
      data: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '(555) 123-4567',
        email: 'sarah.j@email.com',
        servicesNeeded: ['emergency_housing', 'food_assistance'],
        urgency: 'urgent'
      },
      createdBy: 'demo-user',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-response-2',
      templateId: 'volunteer-application-v1',
      templateSlug: 'volunteer-application',
      status: 'signed',
      data: {
        firstName: 'Michael',
        lastName: 'Chen',
        phone: '(555) 987-6543',
        email: 'michael.chen@email.com',
        interests: ['direct_service', 'food_service'],
        availability: ['weekday_evening', 'weekend_morning']
      },
      signatures: [{
        by: 'user',
        userId: 'demo-user',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      }],
      createdBy: 'demo-user',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
  
  localStorage.setItem('demo_form_responses', JSON.stringify(demoResponses))
}

