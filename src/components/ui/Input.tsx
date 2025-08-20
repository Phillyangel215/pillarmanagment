/**
 * @fileoverview Input - Production-ready input component
 * @description Accessible text input with validation states and proper labeling
 * @accessibility WCAG AA+ compliant with proper labeling and error announcements
 * @version 1.0.0
 */

import React from 'react'

export interface InputProps {
  label: string
  id: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number' | 'date'
  placeholder?: string
  value?: string
  defaultValue?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: string
  helpText?: string
  autoComplete?: string
  autoFocus?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  min?: number
  max?: number
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  className?: string
  'aria-describedby'?: string
}

export function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  helpText,
  autoComplete,
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  min,
  max,
  onChange,
  onBlur,
  onFocus,
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...props
}: InputProps) {
  const hasError = Boolean(error)
  const helpTextId = helpText ? `${id}-help` : undefined
  const errorId = hasError ? `${id}-error` : undefined
  
  // Combine all describedby IDs
  const describedByIds = [
    ariaDescribedBy,
    helpTextId,
    errorId
  ].filter(Boolean).join(' ')

  const inputClasses = [
    // Base input styling
    'w-full px-4 py-3 text-base',
    'bg-surface-2 text-text placeholder-muted',
    'border border-surface-4 rounded-md',
    'min-h-[44px]', // 44px minimum touch target
    'transition-all duration-200',
    
    // Focus states - Enhanced for visibility
    'focus:outline-none focus:ring-4 focus:ring-primary-500/60',
    'focus:border-primary-500',
    
    // Hover states
    'hover:border-surface-4',
    
    // Disabled states
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:bg-surface disabled:border-surface-3',
    
    // ReadOnly states
    'read-only:bg-surface read-only:border-surface-3',
    
    // Error states with enhanced focus ring
    hasError ? [
      'border-error',
      'focus:border-error',
      'focus:ring-error/60' // Enhanced error focus ring
    ] : [],
    
    className
  ].flat().join(' ')

  const labelClasses = [
    'block text-sm font-medium text-text mb-2',
    hasError ? 'text-error' : '',
    disabled ? 'opacity-50' : ''
  ].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
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

      {/* Input field */}
      <input
        id={id}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        min={min as any}
        max={max as any}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-describedby={describedByIds || undefined}
        aria-invalid={hasError}
        aria-required={required}
        {...props}
      />

      {/* Help text */}
      {helpText && (
        <p 
          id={helpTextId}
          className="mt-2 text-sm text-muted"
        >
          {helpText}
        </p>
      )}

      {/* Error message */}
      {hasError && (
        <p 
          id={errorId}
          className="mt-2 text-sm text-error flex items-center gap-1"
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
  )
}

// Usage examples for documentation:
/*
<Input
  id="email"
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
  autoComplete="email"
  helpText="We'll never share your email address"
/>

<Input
  id="password"
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  required
/>

<Input
  id="search"
  label="Search"
  type="search"
  placeholder="Search for anything..."
  aria-describedby="search-instructions"
/>
*/