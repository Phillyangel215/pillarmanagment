/**
 * @fileoverview Form Schema - Schema-driven form system with Zod validation
 * @description Lightweight DSL for defining forms with accessibility and validation
 * @version 1.0.0 - Production implementation
 * @accessibility Every field renders with proper labels and ARIA attributes
 */

import { z } from 'zod'

export type FieldType = 
  | 'text' | 'textarea' | 'number' | 'date' | 'select' | 'multiselect' 
  | 'radio' | 'checkbox' | 'file' | 'signature' | 'address' | 'phone' 
  | 'email' | 'currency' | 'ssn' | 'rating' | 'nps'

export interface FieldOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ConditionalRule {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  help?: string
  required?: boolean
  placeholder?: string
  defaultValue?: any
  
  // Validation
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  
  // Options for select/radio/multiselect
  options?: FieldOption[]
  
  // File upload
  accept?: string
  maxFileSize?: number // bytes
  
  // Conditional visibility
  dependsOn?: ConditionalRule[]
  
  // Sensitive data encryption
  sensitive?: boolean
  
  // Accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
  
  // Layout
  width?: 'full' | 'half' | 'third' | 'quarter'
  section?: string
}

export interface FormSection {
  id: string
  title: string
  description?: string
  fields: string[] // Field IDs
}

export interface FormSchema {
  id: string
  slug: string
  name: string
  description?: string
  version: number
  category: string
  
  // Form structure
  fields: FormField[]
  sections?: FormSection[]
  multiStep?: boolean
  
  // Permissions
  allowedRoles: string[]
  requiresSignature?: boolean
  
  // Behavior
  autosave?: boolean
  allowDrafts?: boolean
  
  // Audit
  auditLevel: 'basic' | 'detailed' | 'sensitive'
  
  // Notifications/Escalations
  escalations?: EscalationRule[]
}

export interface EscalationRule {
  condition: ConditionalRule
  action: 'notify' | 'assign' | 'flag'
  target: string // email, role, or flag name
  message?: string
}

// Zod schema generators
export function createFieldValidation(field: FormField): z.ZodType<any> {
  let schema: z.ZodType<any>

  switch (field.type) {
    case 'text':
    case 'textarea': {
      let s = z.string()
      if (field.minLength) s = (s as unknown as z.ZodString).min(field.minLength)
      if (field.maxLength) s = (s as unknown as z.ZodString).max(field.maxLength)
      if (field.pattern) s = (s as unknown as z.ZodString).regex(new RegExp(String(field.pattern)))
      schema = s
      break
    }

    case 'email':
      schema = z.string().email('Please enter a valid email address')
      break

    case 'phone':
      schema = z.string().regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number')
      break

    case 'number':
    case 'currency': {
      let s = z.number()
      if (field.min !== undefined) s = (s as unknown as z.ZodNumber).min(field.min)
      if (field.max !== undefined) s = (s as unknown as z.ZodNumber).max(field.max)
      schema = s
      break
    }

    case 'date':
      schema = z.string().refine(val => !isNaN(Date.parse(val)), 'Please enter a valid date')
      break

    case 'select':
    case 'radio': {
      if (field.options?.length) {
        const validValues = field.options.map(opt => opt.value)
        schema = z.enum(validValues as [string, ...string[]])
      } else {
        schema = z.string()
      }
      break
    }

    case 'multiselect': {
      if (field.options?.length) {
        const validValues = field.options.map(opt => opt.value)
        schema = z.array(z.enum(validValues as [string, ...string[]]))
      } else {
        schema = z.array(z.string())
      }
      break
    }

    case 'checkbox':
      schema = z.boolean()
      break

    case 'file':
      schema = z.instanceof(File).optional()
      break

    case 'signature':
      schema = z.string().min(1, 'Signature is required')
      break

    case 'ssn':
      schema = z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'Please enter SSN in format XXX-XX-XXXX')
      break

    case 'rating':
      schema = z.number().min(1).max(5)
      break

    case 'nps':
      schema = z.number().min(0).max(10)
      break

    case 'address':
      schema = z.object({
        street: z.string().min(1, 'Street address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(2, 'State is required'),
        zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code')
      })
      break

    default:
      schema = z.string()
  }

  // Apply required/optional
  if (!field.required) {
    schema = schema.optional()
  }

  return schema
}

export function createFormValidation(formSchema: FormSchema): z.ZodObject<any> {
  const shape: Record<string, z.ZodType<any>> = {}

  formSchema.fields.forEach(field => {
    shape[field.id] = createFieldValidation(field)
  })

  return z.object(shape)
}

// Field validation helpers
export function validateField(field: FormField, value: any): { isValid: boolean; error?: string } {
  try {
    const schema = createFieldValidation(field)
    schema.parse(value)
    return { isValid: true }
  } catch (error) {
    const zerr = error as unknown as z.ZodError
    const anyErr = zerr as unknown as { issues?: Array<{ message?: string }>; errors?: Array<{ message?: string }> }
    const firstMsg = anyErr.issues?.[0]?.message || anyErr.errors?.[0]?.message
    if (firstMsg) return { isValid: false, error: firstMsg }
    return { isValid: false, error: 'Validation failed' }
  }
}

// Conditional visibility evaluation
export function evaluateCondition(rule: ConditionalRule, formData: Record<string, any>): boolean {
  const fieldValue = formData[rule.field]
  
  switch (rule.operator) {
    case 'equals':
      return fieldValue === rule.value
    case 'not_equals':
      return fieldValue !== rule.value
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(rule.value).toLowerCase())
    case 'greater_than':
      return Number(fieldValue) > Number(rule.value)
    case 'less_than':
      return Number(fieldValue) < Number(rule.value)
    default:
      return true
  }
}

export function isFieldVisible(field: FormField, formData: Record<string, any>): boolean {
  if (!field.dependsOn || field.dependsOn.length === 0) {
    return true
  }
  
  // All conditions must be true for field to be visible
  return field.dependsOn.every(rule => evaluateCondition(rule, formData))
}

// Form categories for organization
export const FORM_CATEGORIES = {
  CLIENT: 'Client Services',
  HR: 'Human Resources', 
  GOVERNANCE: 'Board & Governance',
  COMPLIANCE: 'Compliance & Reporting',
  FINANCE: 'Finance & Development',
  OPERATIONS: 'Operations & Safety'
} as const

export type FormCategory = keyof typeof FORM_CATEGORIES

// Role-based access helpers
export function canUserAccessForm(formSchema: FormSchema, userRoles: string[]): boolean {
  return formSchema.allowedRoles.some(role => userRoles.includes(role))
}

export function canUserManageForms(userRoles: string[]): boolean {
  return userRoles.some(role => ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'PROGRAM_DIRECTOR', 'BOARD_SECRETARY'].includes(role))
}

export function canUserBuildForms(userRoles: string[]): boolean {
  return userRoles.some(role => ['SUPER_ADMIN', 'ADMIN'].includes(role))
}

// Sensitive field encryption helpers (production only)
export function shouldEncryptField(field: FormField): boolean {
  return field.sensitive === true && field.type === 'ssn'
}

export function getEncryptionFields(formSchema: FormSchema): string[] {
  return formSchema.fields
    .filter(shouldEncryptField)
    .map(field => field.id)
}

