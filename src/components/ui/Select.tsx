/**
 * @fileoverview Select - Production-ready select dropdown component
 * @description Accessible select with custom styling and keyboard navigation
 * @accessibility WCAG AA+ compliant with proper ARIA attributes and announcements
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  label: string
  id: string
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  className?: string
  'aria-describedby'?: string
}

export function Select({
  label,
  id,
  options,
  value,
  defaultValue,
  placeholder = 'Select an option...',
  required = false,
  disabled = false,
  error,
  helpText,
  onChange,
  onBlur,
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  
  const selectRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  
  const hasError = Boolean(error)
  const helpTextId = helpText ? `${id}-help` : undefined
  const errorId = hasError ? `${id}-error` : undefined
  
  // Combine all describedby IDs
  const describedByIds = [
    ariaDescribedBy,
    helpTextId,
    errorId
  ].filter(Boolean).join(' ')

  // Find selected option
  const selectedOption = options.find(option => option.value === selectedValue)
  
  // Filter out disabled options for keyboard navigation
  const enabledOptions = options.filter(option => !option.disabled)
  
  const buttonClasses = [
    // Base styling
    'w-full px-4 py-3 text-base text-left',
    'bg-surface-2 text-text',
    'border border-surface-4 rounded-md',
    'min-h-[44px]', // 44px minimum touch target
    'transition-all duration-200',
    'flex items-center justify-between gap-2',
    
    // Focus states - Enhanced for visibility
    'focus:outline-none focus:ring-4 focus:ring-primary-500/60',
    'focus:border-primary-500',
    
    // Hover states
    'hover:border-surface-4',
    
    // Disabled states
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:bg-surface disabled:border-surface-3',
    
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

  // Handle option selection
  const handleOptionSelect = (optionValue: string) => {
    setSelectedValue(optionValue)
    setIsOpen(false)
    onChange?.(optionValue)
    selectRef.current?.focus()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && focusedIndex >= 0) {
          handleOptionSelect(enabledOptions[focusedIndex].value)
        } else {
          setIsOpen(!isOpen)
          setFocusedIndex(selectedValue ? 
            enabledOptions.findIndex(opt => opt.value === selectedValue) : 0
          )
        }
        break
        
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else {
          setFocusedIndex(prev => 
            prev < enabledOptions.length - 1 ? prev + 1 : prev
          )
        }
        break
        
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(enabledOptions.length - 1)
        } else {
          setFocusedIndex(prev => prev > 0 ? prev - 1 : prev)
        }
        break
        
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        break
        
      case 'Tab':
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement
      focusedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [isOpen, focusedIndex])

  return (
    <div className="relative w-full">
      {/* Label */}
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && (
          <span className="text-error ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Select button */}
      <button
        ref={selectRef}
        id={id}
        type="button"
        className={buttonClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-describedby={describedByIds || undefined}
        aria-invalid={hasError}
        aria-required={required}
        {...props}
      >
        <span className={selectedOption ? 'text-text' : 'text-muted'}>
          {selectedOption?.label || placeholder}
        </span>
        
        {/* Chevron icon */}
        <svg 
          className={`h-5 w-5 text-muted transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-labelledby={id}
          className="absolute z-50 w-full mt-1 bg-surface-2 border border-surface-4 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {options.map((option, index) => {
            const enabledIndex = enabledOptions.findIndex(opt => opt.value === option.value)
            const isFocused = enabledIndex === focusedIndex
            const isSelected = option.value === selectedValue
            
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={[
                  'px-4 py-3 text-base cursor-pointer transition-colors',
                  'min-h-[44px] flex items-center',
                  option.disabled ? [
                    'opacity-50 cursor-not-allowed text-muted'
                  ] : [
                    'hover:bg-surface-3',
                    isFocused ? 'bg-primary-500/10 text-primary-400' : '',
                    isSelected ? 'bg-primary-500/20 text-primary-300 font-medium' : 'text-text'
                  ]
                ].flat().join(' ')}
                onClick={() => !option.disabled && handleOptionSelect(option.value)}
              >
                {option.label}
                
                {/* Selected indicator */}
                {isSelected && (
                  <svg 
                    className="ml-auto h-5 w-5 text-primary-400" 
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
              </li>
            )
          })}
        </ul>
      )}

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
<Select
  id="country"
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico', disabled: true }
  ]}
  placeholder="Choose a country"
  required
/>

<Select
  id="role"
  label="User Role"
  options={roleOptions}
  value={selectedRole}
  onChange={setSelectedRole}
  error="Please select a valid role"
/>
*/