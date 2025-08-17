/**
 * @fileoverview Checkbox - Production-ready checkbox component
 * @description Accessible checkbox with indeterminate state and custom styling
 * @accessibility WCAG AA+ compliant with proper ARIA attributes and keyboard support
 * @version 1.0.0
 */

import React, { useRef, useEffect } from 'react'

export interface CheckboxProps {
  id: string
  label: string
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  onChange?: (checked: boolean) => void
  onBlur?: () => void
  onFocus?: () => void
  className?: string
  'aria-describedby'?: string
}

export function Checkbox({
  id,
  label,
  checked,
  defaultChecked,
  indeterminate = false,
  required = false,
  disabled = false,
  error,
  helpText,
  onChange,
  onBlur,
  onFocus,
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...props
}: CheckboxProps) {
  const checkboxRef = useRef<HTMLInputElement>(null)
  const hasError = Boolean(error)
  
  const helpTextId = helpText ? `${id}-help` : undefined
  const errorId = hasError ? `${id}-error` : undefined
  
  // Combine all describedby IDs
  const describedByIds = [
    ariaDescribedBy,
    helpTextId,
    errorId
  ].filter(Boolean).join(' ')

  // Handle indeterminate state
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const containerClasses = [
    'flex items-start gap-3',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className
  ].join(' ')

  const checkboxClasses = [
    // Base styling
    'w-5 h-5 mt-0.5 flex-shrink-0',
    'bg-surface-2 border-2 border-surface-4 rounded-md',
    'transition-all duration-200',
    'cursor-pointer',
    
    // Focus states
    'focus:outline-none focus:ring-4 focus:ring-primary-500/50',
    'focus:border-primary-500',
    
    // Checked/indeterminate states
    'checked:bg-primary-500 checked:border-primary-500',
    'checked:hover:bg-primary-600 checked:hover:border-primary-600',
    
    // Hover states
    'hover:border-surface-4',
    
    // Disabled states
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:bg-surface disabled:border-surface-3',
    
    // Error states
    hasError ? [
      'border-error',
      'focus:border-error',
      'focus:ring-error/50'
    ] : []
  ].flat().join(' ')

  const labelClasses = [
    'text-base text-text leading-relaxed',
    'cursor-pointer select-none',
    hasError ? 'text-error' : '',
    disabled ? 'cursor-not-allowed' : ''
  ].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  const handleLabelClick = () => {
    if (!disabled && checkboxRef.current) {
      checkboxRef.current.click()
    }
  }

  return (
    <div className="w-full">
      <div className={containerClasses}>
        {/* Checkbox input */}
        <div className="relative">
          <input
            ref={checkboxRef}
            id={id}
            type="checkbox"
            className={checkboxClasses}
            checked={checked}
            defaultChecked={defaultChecked}
            required={required}
            disabled={disabled}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            aria-describedby={describedByIds || undefined}
            aria-invalid={hasError}
            aria-required={required}
            {...props}
          />
          
          {/* Custom checkmark icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Checkmark for checked state */}
            {(checked || (checkboxRef.current?.checked && !indeterminate)) && (
              <svg 
                className="w-3.5 h-3.5 text-white" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
            
            {/* Dash for indeterminate state */}
            {indeterminate && (
              <svg 
                className="w-3.5 h-3.5 text-white" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
          </div>
        </div>

        {/* Label and content */}
        <div className="flex-1 min-w-0">
          <label 
            htmlFor={id} 
            className={labelClasses}
            onClick={handleLabelClick}
          >
            {label}
            {required && (
              <span className="text-error ml-1" aria-label="required">
                *
              </span>
            )}
          </label>

          {/* Help text */}
          {helpText && (
            <p 
              id={helpTextId}
              className="mt-1 text-sm text-muted"
            >
              {helpText}
            </p>
          )}

          {/* Error message */}
          {hasError && (
            <p 
              id={errorId}
              className="mt-1 text-sm text-error flex items-center gap-1"
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
      </div>
    </div>
  )
}

// Usage examples for documentation:
/*
<Checkbox
  id="terms"
  label="I agree to the Terms of Service and Privacy Policy"
  required
  helpText="You must agree to continue"
/>

<Checkbox
  id="notifications"
  label="Email Notifications"
  checked={emailEnabled}
  onChange={setEmailEnabled}
  helpText="Receive updates about your account activity"
/>

<Checkbox
  id="select-all"
  label="Select All Items"
  indeterminate={someSelected && !allSelected}
  checked={allSelected}
  onChange={handleSelectAll}
/>

<Checkbox
  id="disabled-option"
  label="This option is currently unavailable"
  disabled
  helpText="This feature will be available in a future update"
/>
*/