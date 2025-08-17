/**
 * @fileoverview TextArea - Production-ready textarea component
 * @description Accessible multi-line text input with auto-resize and character counting
 * @accessibility WCAG AA+ compliant with proper labeling and announcements
 * @version 1.0.0
 */

import React, { useRef, useEffect } from 'react'

export interface TextAreaProps {
  label: string
  id: string
  placeholder?: string
  value?: string
  defaultValue?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: string
  helpText?: string
  rows?: number
  maxLength?: number
  minLength?: number
  autoResize?: boolean
  showCharCount?: boolean
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  className?: string
  'aria-describedby'?: string
}

export function TextArea({
  label,
  id,
  placeholder,
  value,
  defaultValue,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  helpText,
  rows = 4,
  maxLength,
  minLength,
  autoResize = false,
  showCharCount = false,
  onChange,
  onBlur,
  onFocus,
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasError = Boolean(error)
  const currentLength = value?.length || 0
  
  const helpTextId = helpText ? `${id}-help` : undefined
  const errorId = hasError ? `${id}-error` : undefined
  const charCountId = showCharCount ? `${id}-char-count` : undefined
  
  // Combine all describedby IDs
  const describedByIds = [
    ariaDescribedBy,
    helpTextId,
    errorId,
    charCountId
  ].filter(Boolean).join(' ')

  // Auto-resize functionality
  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea && autoResize) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  // Adjust height on value change
  useEffect(() => {
    if (autoResize) {
      adjustHeight()
    }
  }, [value, autoResize])

  const textareaClasses = [
    // Base textarea styling
    'w-full px-4 py-3 text-base',
    'bg-surface-2 text-text placeholder-muted',
    'border border-surface-4 rounded-md',
    'transition-all duration-200',
    'resize-none', // Disable manual resize if auto-resize is enabled
    
    // Focus states
    'focus:outline-none focus:ring-4 focus:ring-primary-500/50',
    'focus:border-primary-500',
    
    // Hover states
    'hover:border-surface-4',
    
    // Disabled states
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:bg-surface disabled:border-surface-3',
    
    // ReadOnly states
    'read-only:bg-surface read-only:border-surface-3',
    
    // Error states
    hasError ? [
      'border-error',
      'focus:border-error',
      'focus:ring-error/50'
    ] : [],
    
    // Auto-resize specific styling
    autoResize ? 'overflow-hidden' : 'overflow-auto',
    
    className
  ].flat().join(' ')

  const labelClasses = [
    'block text-sm font-medium text-text mb-2',
    hasError ? 'text-error' : '',
    disabled ? 'opacity-50' : ''
  ].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    
    // Respect maxLength if set
    if (maxLength && newValue.length > maxLength) {
      return
    }
    
    onChange?.(newValue)
    
    if (autoResize) {
      adjustHeight()
    }
  }

  const handleInput = () => {
    if (autoResize) {
      adjustHeight()
    }
  }

  // Character count color based on usage
  const getCharCountColor = () => {
    if (!maxLength) return 'text-muted'
    
    const usage = currentLength / maxLength
    if (usage >= 1) return 'text-error'
    if (usage >= 0.8) return 'text-warning'
    return 'text-muted'
  }

  return (
    <div className="w-full">
      {/* Label */}
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && (
          <span className="text-error ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Textarea field */}
      <textarea
        ref={textareaRef}
        id={id}
        className={textareaClasses}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        rows={autoResize ? undefined : rows}
        maxLength={maxLength}
        minLength={minLength}
        onChange={handleChange}
        onInput={handleInput}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-describedby={describedByIds || undefined}
        aria-invalid={hasError}
        aria-required={required}
        {...props}
      />

      {/* Character count and help text container */}
      <div className="mt-2 flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Help text */}
          {helpText && (
            <p 
              id={helpTextId}
              className="text-sm text-muted"
            >
              {helpText}
            </p>
          )}

          {/* Error message */}
          {hasError && (
            <p 
              id={errorId}
              className="text-sm text-error flex items-center gap-1 mt-1"
              role="alert"
              aria-live="polite"
            >
              <svg 
                className="h-4 w-4 flex-shrink-0" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" 
                  clipRule="evenodd" 
                />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Character count */}
        {showCharCount && (
          <div 
            id={charCountId}
            className={`text-sm font-medium ${getCharCountColor()}`}
            aria-live="polite"
            aria-label={`${currentLength}${maxLength ? ` of ${maxLength}` : ''} characters`}
          >
            {currentLength}
            {maxLength && `/${maxLength}`}
          </div>
        )}
      </div>
    </div>
  )
}

// Usage examples for documentation:
/*
<TextArea
  id="description"
  label="Project Description"
  placeholder="Describe your project..."
  rows={6}
  maxLength={500}
  showCharCount
  required
  helpText="Provide a detailed description of your project goals and requirements"
/>

<TextArea
  id="feedback"
  label="Feedback"
  autoResize
  placeholder="Share your thoughts..."
  error="Feedback is required to proceed"
/>

<TextArea
  id="notes"
  label="Notes"
  value={notes}
  onChange={setNotes}
  readOnly={isReadOnly}
  className="min-h-[120px]"
/>
*/