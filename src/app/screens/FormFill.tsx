/**
 * @fileoverview FormFill - Form filling interface
 * @description Renders FormEngine for completing forms with autosave and submission
 * @version 1.0.0 - Production implementation
 */

import React, { useState, useEffect } from 'react'
import { FormEngine } from '@/forms/FormEngine'
import { formsService, auditFormAction } from '@/services/forms'
import { FormSchema } from '@/forms/schema'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface FormFillProps {
  templateSlug: string
  userEmail?: string
  onComplete?: (responseId: string) => void
  onCancel?: () => void
}

export default function FormFill({ templateSlug, userEmail, onComplete, onCancel }: FormFillProps) {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTemplate()
  }, [templateSlug])

  const loadTemplate = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const template = await formsService.getTemplate(templateSlug)
      if (!template) {
        setError('Form not found')
        return
      }
      
      setSchema(template.schema)
    } catch (err) {
      console.error('Failed to load form template:', err)
      setError('Failed to load form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      const responseId = await formsService.submit(templateSlug, formData)

      // Log audit event
      await auditFormAction('submit', responseId, templateSlug, userEmail)

      // Auto-sign if template requires signature and a signature field is present
      if (schema?.requiresSignature) {
        const sigField = schema.fields.find(f => f.type === 'signature')
        const sigData = sigField ? formData[sigField.id] : undefined
        if (typeof sigData === 'string' && sigData.length > 0) {
          try {
            await formsService.sign(responseId, sigData, {
              by: 'user',
              userId: undefined
            })
            await auditFormAction('sign', responseId, templateSlug, userEmail)
          } catch (e) {
            console.warn('Auto-sign failed:', e)
          }
        }
      }

      onComplete?.(responseId)
    } catch (error) {
      console.error('Form submission failed:', error)
      throw error
    }
  }

  const handleSaveDraft = async (formData: Record<string, any>) => {
    try {
      const responseId = await formsService.saveDraft(templateSlug, formData)
      
      // Log audit event
      await auditFormAction('draft', responseId, templateSlug, userEmail)
      
      return
    } catch (error) {
      console.error('Failed to save draft:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="page-transition">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-2 rounded w-64"></div>
            <div className="h-48 bg-surface-2 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-surface-2 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-transition">
        <div className="max-w-4xl mx-auto p-6">
          <Card className="glass-card border-error-500">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-text mb-2">Form Not Available</h2>
              <p className="text-muted mb-4">{error}</p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="ghost" onClick={onCancel}>
                  Go Back
                </Button>
                <Button onClick={loadTemplate} className="motion-safe-fast">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!schema) {
    return null
  }

  return (
    <div className="page-transition">
      <FormEngine
        schema={schema}
        onSubmit={handleSubmit}
        onSaveDraft={schema.allowDrafts ? handleSaveDraft : undefined}
        onCancel={onCancel}
        className="p-6"
      />
    </div>
  )
}

