/**
 * @fileoverview Toggle - Production-ready toggle/switch component
 * @description Accessible toggle switch with smooth animations and proper ARIA
 * @accessibility WCAG AA+ compliant with proper role and state announcements
 * @version 1.0.0
 */

import React from 'react'

export interface ToggleProps {
  id: string
  label: string
  checked?: boolean
  defaultChecked?: boolean
  required?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  error?: string
  helpText?: string
  onChange?: (checked: boolean) => void
  onBlur?: () => void
  onFocus?: () => void
  className?: string
  'aria-describedby'?: string
}

export function Toggle({
  id,
  label,
  checked,
  defaultChecked,
  required = false,
  disabled = false,
  size = 'md',
  error,
  helpText,
  onChange,
  onBlur,
  onFocus,
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...props
}: ToggleProps) {
  const hasError = Boolean(error)
  
  const helpTextId = helpText ? `${id}-help` : undefined
  const errorId = hasError ? `${id}-error` : undefined
  
  // Combine all describedby IDs
  const describedByIds = [
    ariaDescribedBy,
    helpTextId,
    errorId
  ].filter(Boolean).join(' ')

  // Size variants
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  }

  const containerClasses = [
    'flex items-start gap-3',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className
  ].join(' ')

  const trackClasses = [
    // Base track styling
    sizeClasses[size].track,
    'relative inline-flex flex-shrink-0 cursor-pointer rounded-full',
    'border-2 border-transparent transition-colors duration-200 ease-in-out',
    'focus:outline-none focus:ring-4 focus:ring-primary-500/50',
    
    // Background colors
    checked ? 'bg-primary-500' : 'bg-surface-4',
    
    // Hover states
    !disabled && (checked 
      ? 'hover:bg-primary-600' 
      : 'hover:bg-gray-400'
    ),
    
    // Disabled states
    disabled ? 'cursor-not-allowed opacity-50' : '',
    
    // Error states
    hasError ? 'ring-2 ring-error/50' : ''
  ].filter(Boolean).join(' ')

  const thumbClasses = [
    // Base thumb styling
    sizeClasses[size].thumb,
    'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0',
    'transition duration-200 ease-in-out',
    
    // Position based on checked state
    checked ? sizeClasses[size].translate : 'translate-x-0'
  ].join(' ')

  const labelClasses = [
    'text-base text-text leading-relaxed',
    'cursor-pointer select-none',
    hasError ? 'text-error' : '',
    disabled ? 'cursor-not-allowed' : ''
  ].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  const handleClick = () => {
    if (!disabled) {
      const input = document.getElementById(id) as HTMLInputElement
      if (input) {
        input.click()
      }
    }
  }

  return (
    <div className="w-full">
      <div className={containerClasses}>
        {/* Hidden input for form submission and accessibility */}
        <input
          id={id}
          type="checkbox"
          className="sr-only"
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

        {/* Toggle track */}
        <button
          type="button"
          className={trackClasses}
          role="switch"
          aria-checked={checked}
          aria-labelledby={`${id}-label`}
          aria-describedby={describedByIds || undefined}
          disabled={disabled}
          onClick={handleClick}
        >
          {/* Toggle thumb */}
          <span className={thumbClasses} />
          
          {/* Screen reader state announcement */}
          <span className="sr-only">
            {checked ? 'Enabled' : 'Disabled'}
          </span>
        </button>

        {/* Label and content */}
        <div className="flex-1 min-w-0">
          <label 
            id={`${id}-label`}
            htmlFor={id} 
            className={labelClasses}
            onClick={handleClick}
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
<Toggle
  id="dark-mode"
  label="Dark Mode"
  checked={isDarkMode}
  onChange={setIsDarkMode}
  helpText="Toggle between light and dark themes"
/>

<Toggle
  id="notifications"
  label="Push Notifications"
  size="lg"
  required
  helpText="Allow notifications to stay updated"
/>

<Toggle
  id="auto-save"
  label="Auto-save Changes"
  defaultChecked
  disabled
  helpText="Automatically save your work (Premium feature)"
/>

<Toggle
  id="email-marketing"
  label="Email Marketing"
  checked={emailMarketing}
  onChange={setEmailMarketing}
  size="sm"
  error="You must opt-in to continue"
/>
*/