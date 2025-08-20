/**
 * @fileoverview FormEngine - Schema-driven form renderer with accessibility
 * @description Multi-step form wizard with validation, autosave, and WCAG AA compliance
 * @version 1.0.0 - Production implementation
 * @accessibility Full keyboard navigation, screen reader support, error management
 */

import React, { useState, useEffect, useRef } from 'react'
import { FormSchema, FormField, isFieldVisible, validateField } from './schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import SignaturePad from 'signature_pad'

// Respect prefers-reduced-motion
const useReducedMotionClass = () => {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduced(mq.matches)
    handler()
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])
  return reduced ? 'duration-0' : 'motion-safe-fast'
}

interface FormEngineProps {
  schema: FormSchema
  initialData?: Record<string, any>
  onSubmit: (data: Record<string, any>) => Promise<void>
  onSaveDraft?: (data: Record<string, any>) => Promise<void>
  onCancel?: () => void
  className?: string
  mode?: 'fill' | 'view' | 'print'
}

interface FormError {
  field: string
  message: string
}

export function FormEngine({
  schema,
  initialData = {},
  onSubmit,
  onSaveDraft,
  onCancel,
  className = '',
  mode = 'fill'
}: FormEngineProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [errors, setErrors] = useState<FormError[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const signaturePadRefs = useRef<Record<string, SignaturePad>>({})
  const motionClass = useReducedMotionClass()
  
  const sections = Array.isArray(schema.sections) ? schema.sections : []
  const isMultiStep = Boolean(schema.multiStep && sections.length > 1)
  const totalSteps = isMultiStep ? sections.length : 1
  const currentSection = isMultiStep ? sections[currentStep] : undefined
  const isReadOnly = mode === 'view' || mode === 'print'

  // Autosave functionality
  const autosaveUserId = formData.userId || 'anonymous'

  useEffect(() => {
    if (schema.autosave && !isReadOnly) {
      const autosaveKey = `form_autosave_${schema.slug}_${autosaveUserId}`
      const timeoutId = setTimeout(() => {
        localStorage.setItem(autosaveKey, JSON.stringify(formData))
      }, 2000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [formData, schema.autosave, schema.slug, isReadOnly, autosaveUserId])

  // Load autosaved data on mount
  useEffect(() => {
    if (schema.autosave && Object.keys(initialData).length === 0) {
      const autosaveKey = `form_autosave_${schema.slug}_${autosaveUserId}`
      const saved = localStorage.getItem(autosaveKey)
      if (saved) {
        try {
          const savedData = JSON.parse(saved)
          setFormData(savedData)
          setIsDraft(true)
        } catch (e) {
          console.warn('Failed to load autosaved data:', e)
        }
      }
    }
  }, [schema.autosave, schema.slug, initialData, autosaveUserId])

  // Get fields for current step
  const getCurrentFields = (): FormField[] => {
    if (isMultiStep && currentSection) {
      return schema.fields.filter(field => currentSection.fields.includes(field.id))
    }
    return schema.fields
  }

  // Get visible fields based on conditional logic
  const getVisibleFields = (): FormField[] => {
    return getCurrentFields().filter(field => isFieldVisible(field, formData))
  }

  // Update field value
  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    
    // Clear field error when user starts typing
    setErrors(prev => prev.filter(error => error.field !== fieldId))
  }

  // Validate current step
  const validateCurrentStep = (): FormError[] => {
    const currentFields = getVisibleFields()
    const stepErrors: FormError[] = []

    currentFields.forEach(field => {
      const value = formData[field.id]
      const validation = validateField(field, value)
      
      if (!validation.isValid) {
        stepErrors.push({
          field: field.id,
          message: validation.error || 'Invalid value'
        })
      }
    })

    return stepErrors
  }

  // Handle step navigation
  const goToStep = (step: number) => {
    if (step < 0 || step >= totalSteps) return
    
    // Validate current step before moving forward
    if (step > currentStep) {
      const stepErrors = validateCurrentStep()
      if (stepErrors.length > 0) {
        setErrors(stepErrors)
        // Focus error summary
        setTimeout(() => {
          errorSummaryRef.current?.focus()
        }, 100)
        return
      }
    }
    
    setCurrentStep(step)
    setErrors([])
    
    // Focus management - move to top of form
    setTimeout(() => {
      const stepHeader = document.querySelector(`[data-step="${step}"]`)
      if (stepHeader) {
        (stepHeader as HTMLElement).focus()
      }
    }, 100)
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      // Validate entire form
      const allErrors: FormError[] = []
      schema.fields.forEach(field => {
        if (isFieldVisible(field, formData)) {
          const validation = validateField(field, formData[field.id])
          if (!validation.isValid) {
            allErrors.push({
              field: field.id,
              message: validation.error || 'Invalid value'
            })
          }
        }
      })

      if (allErrors.length > 0) {
        setErrors(allErrors)
        setCurrentStep(0) // Go to first step with errors
        setTimeout(() => {
          errorSummaryRef.current?.focus()
        }, 100)
        return
      }

      // Process signature fields
      const processedData = { ...formData }
      Object.entries(signaturePadRefs.current).forEach(([fieldId, pad]) => {
        if (!pad.isEmpty()) {
          processedData[fieldId] = pad.toDataURL()
        }
      })

      await onSubmit(processedData)
      
      // Clear autosave on successful submit
      if (schema.autosave) {
        const autosaveKey = `form_autosave_${schema.slug}_${formData.userId || 'anonymous'}`
        localStorage.removeItem(autosaveKey)
      }
      
    } catch (error) {
      console.error('Form submission failed:', error)
      setErrors([{ field: '_form', message: 'Submission failed. Please try again.' }])
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle draft save
  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      try {
        await onSaveDraft(formData)
        setIsDraft(true)
      } catch (error) {
        console.error('Failed to save draft:', error)
      }
    }
  }

  // Render field based on type
  const renderField = (field: FormField) => {
    const value = formData[field.id] || field.defaultValue
    const fieldError = errors.find(e => e.field === field.id)
    const fieldId = `field-${field.id}`
    const helpId = field.help ? `${fieldId}-help` : undefined
    const errorId = fieldError ? `${fieldId}-error` : undefined
    
    const commonProps = {
      id: fieldId,
      name: field.id,
      'aria-label': field.ariaLabel || field.label,
      'aria-describedby': [helpId, errorId, field.ariaDescribedBy].filter(Boolean).join(' '),
      'aria-invalid': fieldError ? true : undefined,
      disabled: isReadOnly,
      className: `motion-safe-fast ${fieldError ? 'border-error-500 focus:ring-error-500/50' : ''}`
    }

    const fieldWrapper = (content: React.ReactNode) => (
      <div className={`space-y-2 ${field.width === 'half' ? 'md:col-span-1' : field.width === 'third' ? 'md:col-span-1' : field.width === 'quarter' ? 'md:col-span-1' : 'md:col-span-2'}`}>
        <label htmlFor={fieldId} className="block text-sm font-medium text-text">
          {field.label}
          {field.required && <span className="text-error-600 ml-1" aria-label="required">*</span>}
        </label>
        
        {field.help && (
          <p id={helpId} className="text-sm text-muted">
            {field.help}
          </p>
        )}
        
        {content}
        
        {fieldError && (
          <p id={errorId} className="text-sm text-error-600" role="alert">
            {fieldError.message}
          </p>
        )}
      </div>
    )

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return fieldWrapper(
          <Input
            {...commonProps}
            label={field.label}
            id={fieldId}
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={value || ''}
            onChange={(val) => updateField(field.id, val)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
          />
        )

      case 'textarea':
        return fieldWrapper(
          <TextArea
            {...commonProps}
            label={field.label}
            id={fieldId}
            value={value || ''}
            onChange={(val) => updateField(field.id, val)}
            placeholder={field.placeholder}
            rows={4}
            maxLength={field.maxLength}
          />
        )

      case 'number':
      case 'currency':
        return fieldWrapper(
          <Input
            {...commonProps}
            label={field.label}
            id={fieldId}
            type="number"
            value={value || ''}
            onChange={(val) => updateField(field.id, field.type === 'currency' ? parseFloat(val) : parseInt(val))}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
          />
        )

      case 'date':
        return fieldWrapper(
          <Input
            {...commonProps}
            label={field.label}
            id={fieldId}
            type="date"
            value={value || ''}
            onChange={(val) => updateField(field.id, val)}
          />
        )

      case 'select':
        return fieldWrapper(
          <Select
            {...commonProps}
            label={field.label}
            id={fieldId}
            value={value || ''}
            onChange={(val) => updateField(field.id, val)}
            options={field.options || []}
            placeholder={field.placeholder}
          />
        )

      case 'multiselect':
        return fieldWrapper(
          <Select
            {...commonProps}
            label={field.label}
            id={fieldId}
            value={Array.isArray(value) ? value.join(',') : ''}
            onChange={(val) => {
              const arr = val.split(',').filter(Boolean)
              updateField(field.id, arr)
            }}
            options={(field.options || []).map(o => ({ value: o.value, label: o.label }))}
            placeholder={field.placeholder}
          />
        )

      case 'radio':
        return fieldWrapper(
          <div className="space-y-2" role="radiogroup" aria-labelledby={fieldId}>
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  disabled={isReadOnly || option.disabled}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500/50"
                />
                <span className="text-sm text-text">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return fieldWrapper(
          <Checkbox
            {...commonProps}
            id={fieldId}
            checked={value || false}
            onChange={(checked) => updateField(field.id, checked)}
            label={field.label}
          />
        )

      case 'file':
        return fieldWrapper(
          <div className="space-y-2">
            <input
              {...commonProps}
              type="file"
              accept={field.accept}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  if (field.maxFileSize && file.size > field.maxFileSize) {
                    setErrors(prev => [...prev.filter(e => e.field !== field.id), {
                      field: field.id,
                      message: `File size must be less than ${Math.round(field.maxFileSize / 1024 / 1024)}MB`
                    }])
                    return
                  }
                  updateField(field.id, file)
                }
              }}
              className="block w-full text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {field.maxFileSize && (
              <p className="text-xs text-muted">
                Maximum file size: {Math.round(field.maxFileSize / 1024 / 1024)}MB
              </p>
            )}
          </div>
        )

      case 'signature':
        return fieldWrapper(
          <div className="space-y-2">
            <div className="border border-surface-4 rounded-lg p-4 bg-white">
              <canvas
                ref={(canvas) => {
                  if (canvas && !signaturePadRefs.current[field.id]) {
                    const pad = new SignaturePad(canvas, {
                      backgroundColor: 'rgb(255, 255, 255)',
                      penColor: 'rgb(0, 0, 0)'
                    })
                    signaturePadRefs.current[field.id] = pad
                    
                    // Load existing signature
                    if (value) {
                      pad.fromDataURL(value)
                    }
                    
                    pad.addEventListener('endStroke', () => {
                      updateField(field.id, pad.toDataURL())
                    })
                  }
                }}
                width={400}
                height={150}
                className="border border-charcoal-200 rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const pad = signaturePadRefs.current[field.id]
                  if (pad) {
                    pad.clear()
                    updateField(field.id, null)
                  }
                }}
                disabled={isReadOnly}
              >
                Clear Signature
              </Button>
              <p className="text-xs text-muted">Sign above with your mouse or touch</p>
            </div>
          </div>
        )

      case 'rating':
        return fieldWrapper(
          <div className="flex items-center gap-2" role="radiogroup" aria-labelledby={fieldId}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => updateField(field.id, rating)}
                disabled={isReadOnly}
                className={`w-8 h-8 rounded-full border-2 transition-colors ${motionClass} focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                  value === rating 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'border-surface-4 text-muted hover:border-primary-500'
                }`}
                aria-label={`Rating ${rating} out of 5`}
              >
                {rating}
              </button>
            ))}
          </div>
        )

      case 'nps':
        return fieldWrapper(
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>Not likely</span>
              <span>Extremely likely</span>
            </div>
            <div className="flex items-center gap-1" role="radiogroup" aria-labelledby={fieldId}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => updateField(field.id, score)}
                  disabled={isReadOnly}
                  className={`w-8 h-8 rounded border transition-colors ${motionClass} focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                    value === score 
                      ? 'bg-primary-500 border-primary-500 text-white' 
                      : 'border-surface-4 text-muted hover:border-primary-500'
                  }`}
                  aria-label={`Score ${score} out of 10`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        )

      case 'ssn':
        return fieldWrapper(
          <Input
            {...commonProps}
            label={field.label}
            id={fieldId}
            type="password"
            value={value || ''}
            onChange={(val) => {
              // Format SSN as XXX-XX-XXXX
              let formatted = val.replace(/\D/g, '')
              if (formatted.length >= 6) {
                formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 5)}-${formatted.slice(5, 9)}`
              } else if (formatted.length >= 4) {
                formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`
              }
              updateField(field.id, formatted)
            }}
            placeholder="XXX-XX-XXXX"
            maxLength={11}
          />
        )

      case 'address':
        return fieldWrapper(
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Street Address"
                label="Street Address"
                id={`${fieldId}-street`}
                value={value?.street || ''}
                onChange={(val) => updateField(field.id, { ...value, street: val })}
                disabled={isReadOnly}
              />
            </div>
            <Input
              placeholder="City"
              label="City"
              id={`${fieldId}-city`}
              value={value?.city || ''}
              onChange={(val) => updateField(field.id, { ...value, city: val })}
              disabled={isReadOnly}
            />
            <Input
              placeholder="State"
              label="State"
              id={`${fieldId}-state`}
              value={value?.state || ''}
              onChange={(val) => updateField(field.id, { ...value, state: val })}
              disabled={isReadOnly}
            />
            <Input
              placeholder="ZIP Code"
              label="ZIP Code"
              id={`${fieldId}-zip`}
              value={value?.zipCode || ''}
              onChange={(val) => updateField(field.id, { ...value, zipCode: val })}
              disabled={isReadOnly}
            />
          </div>
        )

      default:
        return fieldWrapper(
          <Input
            {...commonProps}
            value={value || ''}
            label={field.label}
            id={fieldId}
            onChange={(val) => updateField(field.id, val)}
            placeholder={field.placeholder}
          />
        )
    }
  }

  const visibleFields = getVisibleFields()
  const progress = isMultiStep ? ((currentStep + 1) / totalSteps) * 100 : 100

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Error Summary */}
      {errors.length > 0 && (
        <Card className="mb-6 border-error-500 bg-error-50">
          <CardContent className="p-4">
            <div
              ref={errorSummaryRef}
              tabIndex={-1}
              role="alert"
              aria-live="polite"
              className="focus:outline-none"
            >
              <h3 className="text-lg font-semibold text-error-700 mb-2">
                Please correct the following errors:
              </h3>
              <ul className="space-y-1">
                {errors.map((error) => (
                  <li key={error.field}>
                    <button
                      type="button"
                      onClick={() => {
                        const field = document.getElementById(`field-${error.field}`)
                        field?.focus()
                      }}
                      className="text-sm text-error-600 hover:text-error-700 underline focus:outline-none focus:ring-2 focus:ring-error-500/50"
                    >
                      {error.field === '_form' ? error.message : `${schema.fields.find(f => f.id === error.field)?.label}: ${error.message}`}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Header */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{schema.name}</CardTitle>
              {schema.description && (
                <p className="text-muted mt-1">{schema.description}</p>
              )}
            </div>
            {isDraft && (
              <Badge className="bg-warning-100 text-warning-700">
                Draft Saved
              </Badge>
            )}
          </div>
          
          {/* Progress indicator for multi-step forms */}
          {isMultiStep && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted mb-2">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="w-full bg-surface-3 rounded-full h-2">
                <div 
                  className={`bg-primary-500 h-2 rounded-full transition-all duration-500 ${motionClass}`}
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Form completion progress"
                />
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Form Content */}
      <Card className="glass-card">
        <CardContent className="p-6">
          {/* Section Header */}
          {isMultiStep && currentSection && (
            <div className="mb-6" data-step={currentStep} tabIndex={-1}>
              <h2 className="text-xl font-semibold text-text">{currentSection.title}</h2>
              {currentSection.description && (
                <p className="text-muted mt-1">{currentSection.description}</p>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleFields.map((field) => (
              <React.Fragment key={field.id}>
                {renderField(field)}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      {!isReadOnly && (
        <Card className="glass-card mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onCancel && (
                  <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                  </Button>
                )}
                
                {isMultiStep && currentStep > 0 && (
                  <Button 
                    variant="secondary" 
                    onClick={() => goToStep(currentStep - 1)}
                    disabled={isSubmitting}
                  >
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {schema.allowDrafts && onSaveDraft && (
                  <Button 
                    variant="ghost" 
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    Save Draft
                  </Button>
                )}

                {isMultiStep && currentStep < totalSteps - 1 ? (
                  <Button 
                    onClick={() => goToStep(currentStep + 1)}
                    disabled={isSubmitting}
                    className={`${motionClass} hover-glow`}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`${motionClass} hover-glow`}
                  >
                    {isSubmitting ? 'Submitting...' : schema.requiresSignature ? 'Submit & Sign' : 'Submit Form'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Usage examples:
/*
<FormEngine
  schema={clientIntakeSchema}
  onSubmit={async (data) => {
    await formsService.submit('client-intake', data)
  }}
  onSaveDraft={async (data) => {
    await formsService.saveDraft('client-intake', data)
  }}
  onCancel={() => navigate('/forms')}
/>
*/

