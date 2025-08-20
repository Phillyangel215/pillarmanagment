/**
 * @fileoverview Forms Service - Form data management for demo and production
 * @description Handles form templates, responses, signatures, and file uploads
 * @version 1.0.0 - Production implementation with demo fallback
 */

import { FormSchema, getEncryptionFields } from '@/forms/schema'
import { getAllTemplates, getTemplateBySlug, seedDemoTemplates } from '@/forms/templates'

export interface FormTemplate {
  id: string
  slug: string
  name: string
  category: string
  schema: FormSchema
  createdAt: string
  updatedAt: string
}

export interface FormResponse {
  id: string
  templateId: string
  templateSlug: string
  status: 'draft' | 'submitted' | 'signed' | 'archived'
  data: Record<string, any>
  signatures?: FormSignature[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface FormSignature {
  by: 'user' | 'client' | 'board'
  userId?: string
  timestamp: string
  ipAddress: string
  userAgent: string
  signatureData: string // Base64 signature image
}

export interface FormUpload {
  id: string
  fieldId: string
  responseId: string
  filename: string
  contentType: string
  size: number
  url: string
  uploadedAt: string
}

class FormsService {
  private isDemo = import.meta.env.VITE_DEMO === '1'

  // Template management
  async listTemplates(): Promise<FormTemplate[]> {
    if (this.isDemo) {
      // Seed and return templates from registry in demo mode
      try {
        seedDemoTemplates()
      } catch {
        // ignore
      }
      // Map registry entries to FormTemplate shape
      return getAllTemplates()
    }
    
    try {
      const response = await fetch('/api/forms/templates', {
        headers: this.getAuthHeaders()
      })
      const data = await response.json()
      return data.templates || []
    } catch (error) {
      console.error('Failed to load templates:', error)
      return []
    }
  }

  async getTemplate(slugOrId: string): Promise<FormTemplate | null> {
    if (this.isDemo) {
      // Allow local override in demo for builder edits
      try {
        const override = localStorage.getItem(`demo_form_template_override_${slugOrId}`)
        if (override) {
          const parsed = JSON.parse(override)
          return parsed
        }
      } catch {
        // ignore
      }
      const tpl = getTemplateBySlug(slugOrId) || getAllTemplates().find(t => t.id === slugOrId)
      return tpl || null
    }
    
    try {
      const response = await fetch(`/api/forms/templates/${slugOrId}`, {
        headers: this.getAuthHeaders()
      })
      const data = await response.json()
      return data.template || null
    } catch (error) {
      console.error('Failed to load template:', error)
      return null
    }
  }

  // Response management
  async submit(templateSlug: string, formData: Record<string, any>): Promise<string> {
    if (this.isDemo) {
      return this.submitDemo(templateSlug, formData)
    }
    
    try {
      // Load template to determine sensitive fields and handle files
      const template = await this.getTemplate(templateSlug)
      const schema = template?.schema
      const dataToSubmit = { ...formData }

      // Encrypt sensitive fields (production only)
      if (schema) {
        const sensitiveFieldIds = getEncryptionFields(schema)
        if (sensitiveFieldIds.length > 0) {
          await this.encryptFieldsInPlace(dataToSubmit, sensitiveFieldIds)
        }
      }

      // Files: upload any File instances before submit and replace with metadata
      if (schema) {
        const fileFieldIds = schema.fields.filter(f => f.type === 'file').map(f => f.id)
        for (const fieldId of fileFieldIds) {
          const value = dataToSubmit[fieldId]
          if (value instanceof File) {
            // We need a response id to associate upload; create a temporary draft response first
            // Fallback: upload with a temporary path and return signed URL
            const upload = await this.uploadFile('pending', fieldId, value)
            dataToSubmit[fieldId] = {
              filename: upload.filename,
              contentType: upload.contentType,
              size: upload.size,
              url: upload.url,
              uploadedAt: upload.uploadedAt
            }
          }
        }
      }

      const response = await fetch('/api/forms/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          templateSlug,
          data: dataToSubmit
        })
      })
      
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || 'Submission failed')
      }
      
      return result.responseId
    } catch (error) {
      console.error('Failed to submit form:', error)
      throw error
    }
  }

  async saveDraft(templateSlug: string, formData: Record<string, any>): Promise<string> {
    if (this.isDemo) {
      return this.saveDraftDemo(templateSlug, formData)
    }
    
    try {
      const response = await fetch('/api/forms/responses/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          templateSlug,
          data: formData
        })
      })
      
      const result = await response.json()
      return result.responseId
    } catch (error) {
      console.error('Failed to save draft:', error)
      throw error
    }
  }

  async listResponses(templateSlug?: string, filters?: Record<string, any>): Promise<FormResponse[]> {
    if (this.isDemo) {
      return this.getDemoResponses(templateSlug, filters)
    }
    
    try {
      const params = new URLSearchParams()
      if (templateSlug) params.set('template', templateSlug)
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.set(key, String(value))
          }
        })
      }
      
      const response = await fetch(`/api/forms/responses?${params}`, {
        headers: this.getAuthHeaders()
      })
      const data = await response.json()
      return data.responses || []
    } catch (error) {
      console.error('Failed to load responses:', error)
      return []
    }
  }

  async getResponse(responseId: string): Promise<FormResponse | null> {
    if (this.isDemo) {
      const responses = this.getDemoResponses()
      return responses.find(r => r.id === responseId) || null
    }
    
    try {
      const response = await fetch(`/api/forms/responses/${responseId}`, {
        headers: this.getAuthHeaders()
      })
      const data = await response.json()
      return data.response || null
    } catch (error) {
      console.error('Failed to load response:', error)
      return null
    }
  }

  // Signature management
  async sign(responseId: string, signatureData: string, metadata: Partial<FormSignature>): Promise<void> {
    if (this.isDemo) {
      return this.signDemo(responseId, signatureData, metadata)
    }
    
    try {
      await fetch(`/api/forms/responses/${responseId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          signatureData,
          metadata
        })
      })
    } catch (error) {
      console.error('Failed to sign form:', error)
      throw error
    }
  }

  // File upload management
  async uploadFile(responseId: string, fieldId: string, file: File): Promise<FormUpload> {
    if (this.isDemo) {
      return this.uploadFileDemo(responseId, fieldId, file)
    }
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fieldId', fieldId)
      formData.append('responseId', responseId)
      
      const response = await fetch('/api/forms/upload', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData
      })
      
      const result = await response.json()
      return result.upload
    } catch (error) {
      console.error('Failed to upload file:', error)
      throw error
    }
  }

  // Demo implementations
  private getDemoTemplates(): FormTemplate[] {
    try {
      seedDemoTemplates()
    } catch {
      // ignore
    }
    return getAllTemplates()
  }

  private async submitDemo(templateSlug: string, formData: Record<string, any>): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    
    const responseId = `demo-response-${Date.now()}`
    const template = getTemplateBySlug(templateSlug)
    const schema = template?.schema
    const dataToStore: Record<string, any> = { ...formData }

    // Handle file fields in demo by creating object URLs and storing metadata
    if (schema) {
      const fileFieldIds = schema.fields.filter(f => f.type === 'file').map(f => f.id)
      for (const fieldId of fileFieldIds) {
        const value = dataToStore[fieldId]
        if (value instanceof File) {
          const upload = await this.uploadFileDemo(responseId, fieldId, value)
          dataToStore[fieldId] = {
            filename: upload.filename,
            contentType: upload.contentType,
            size: upload.size,
            url: upload.url,
            uploadedAt: upload.uploadedAt
          }
        }
      }
    }
    const response: FormResponse = {
      id: responseId,
      templateId: `demo-template-${templateSlug}`,
      templateSlug,
      status: 'submitted',
      data: dataToStore,
      createdBy: 'demo-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Store in demo storage
    const responses = this.getDemoResponses()
    responses.push(response)
    localStorage.setItem('demo_form_responses', JSON.stringify(responses))
    
    return responseId
  }

  private async saveDraftDemo(templateSlug: string, formData: Record<string, any>): Promise<string> {
    const responseId = `demo-draft-${Date.now()}`
    const response: FormResponse = {
      id: responseId,
      templateId: `demo-template-${templateSlug}`,
      templateSlug,
      status: 'draft',
      data: formData,
      createdBy: 'demo-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const responses = this.getDemoResponses()
    responses.push(response)
    localStorage.setItem('demo_form_responses', JSON.stringify(responses))
    
    return responseId
  }

  private getDemoResponses(templateSlug?: string, filters?: Record<string, any>): FormResponse[] {
    const stored = localStorage.getItem('demo_form_responses')
    let responses: FormResponse[] = []
    
    if (stored) {
      try {
        responses = JSON.parse(stored)
      } catch (e) {
        console.warn('Failed to parse demo responses:', e)
      }
    }
    
    // Apply filters
    if (templateSlug) {
      responses = responses.filter(r => r.templateSlug === templateSlug)
    }
    
    if (filters) {
      responses = responses.filter(response => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null) return true
          return response[key as keyof FormResponse] === value
        })
      })
    }
    
    return responses
  }

  private async signDemo(responseId: string, signatureData: string, metadata: Partial<FormSignature>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const responses = this.getDemoResponses()
    const responseIndex = responses.findIndex(r => r.id === responseId)
    
    if (responseIndex >= 0) {
      const signature: FormSignature = {
        by: metadata.by || 'user',
        userId: metadata.userId,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1', // Demo IP
        userAgent: navigator.userAgent,
        signatureData
      }
      
      responses[responseIndex].signatures = responses[responseIndex].signatures || []
      // push without non-null assertion
      const arr = responses[responseIndex].signatures
      arr.push(signature)
      responses[responseIndex].status = 'signed'
      responses[responseIndex].updatedAt = new Date().toISOString()
      
      localStorage.setItem('demo_form_responses', JSON.stringify(responses))
    }
  }

  private async uploadFileDemo(responseId: string, fieldId: string, file: File): Promise<FormUpload> {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload time
    
    return {
      id: `demo-upload-${Date.now()}`,
      fieldId,
      responseId,
      filename: file.name,
      contentType: file.type,
      size: file.size,
      url: URL.createObjectURL(file), // Demo URL
      uploadedAt: new Date().toISOString()
    }
  }

  private getAuthHeaders(): Record<string, string> {
    // In production, get JWT token from auth context
    const token = localStorage.getItem('supabase.auth.token') // Simplified
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Encryption helpers (AES-GCM) for production path
  private async encryptFieldsInPlace(data: Record<string, any>, fieldIds: string[]): Promise<void> {
    const keyString = (import.meta.env.VITE_ENCRYPTION_KEY as string) || ''
    if (!keyString) return
    const cryptoKey = await this.importAesKey(keyString)
    for (const fieldId of fieldIds) {
      const plaintext = data[fieldId]
      if (!plaintext) continue
      const encoder = new TextEncoder()
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encoder.encode(String(plaintext))
      )
      data[fieldId] = {
        alg: 'AES-GCM',
        nonce: this.arrayBufferToBase64(iv),
        ciphertext: this.arrayBufferToBase64(ciphertext)
      }
    }
  }

  private async importAesKey(keyMaterialBase64: string): Promise<CryptoKey> {
    const raw = this.base64ToArrayBuffer(keyMaterialBase64)
    return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt'])
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i)
    return bytes.buffer
  }

  private arrayBufferToBase64(buffer: ArrayBuffer | ArrayBufferLike): string {
    const bytes = new Uint8Array(buffer as ArrayBuffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary)
  }
}

export const formsService = new FormsService()

// Audit logging helper
export async function auditFormAction(action: 'submit' | 'sign' | 'draft', responseId: string, templateSlug: string, userEmail?: string) {
  try {
    const auditEvent = {
      scope: 'forms',
      action,
      target: {
        type: 'form',
        id: responseId,
        label: templateSlug
      },
      actor: {
        email: userEmail || 'anonymous',
        roles: ['USER'] // Would get from auth context
      },
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    }

    if (import.meta.env.VITE_DEMO === '1') {
      // Store in demo audit log
      const auditLog = JSON.parse(localStorage.getItem('demo_audit_log') || '[]')
      auditLog.push(auditEvent)
      localStorage.setItem('demo_audit_log', JSON.stringify(auditLog))
    } else {
      // Send to production audit endpoint
      await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify(auditEvent)
      })
    }
  } catch (error) {
    console.error('Failed to log audit event:', error)
  }
}

