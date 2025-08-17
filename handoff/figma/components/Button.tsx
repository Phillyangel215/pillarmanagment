/**
 * @fileoverview Button - Production-ready button component
 * @description Accessible button with variants, sizes, and loading states
 * @accessibility WCAG AA+ compliant with keyboard navigation and screen reader support
 * @version 1.0.0
 */

import React from 'react'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
  'aria-label'?: string
  'aria-describedby'?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}: ButtonProps) {
  const baseClasses = [
    // Base button styling
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-all duration-200',
    'focus:outline-none focus:ring-4 focus:ring-primary-500/60', // Enhanced focus ring opacity
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'relative overflow-hidden',
    
    // Motion support
    'motion-safe:transform motion-safe:active:scale-95',
  ]

  // Size variants with proper touch targets
  const sizeClasses = {
    sm: [
      'px-3 py-2 text-sm',
      'min-h-[36px]', // 36px for small buttons
      'rounded-md'
    ],
    md: [
      'px-4 py-3 text-base',
      'min-h-[44px]', // 44px minimum touch target
      'rounded-md'
    ],
    lg: [
      'px-6 py-4 text-lg',
      'min-h-[56px]', // 56px for large buttons
      'rounded-lg'
    ]
  }

  // Variant styles with AA+ contrast
  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-primary-500 to-primary-600',
      'text-white shadow-md',
      'hover:from-primary-600 hover:to-primary-700',
      'hover:shadow-lg hover:-translate-y-0.5',
      'active:shadow-md active:translate-y-0',
      'focus:ring-primary-500/60', // Consistent focus ring
      'disabled:from-gray-400 disabled:to-gray-500',
      'disabled:hover:shadow-md disabled:hover:translate-y-0'
    ],
    secondary: [
      'bg-surface-2 text-text border border-surface-4',
      'shadow-sm',
      'hover:bg-surface-3 hover:border-surface-4',
      'hover:shadow-md hover:-translate-y-0.5',
      'active:shadow-sm active:translate-y-0',
      'focus:ring-primary-500/60'
    ],
    ghost: [
      'bg-transparent text-text',
      'hover:bg-surface-2',
      'focus:bg-surface-2',
      'focus:ring-primary-500/60'
    ],
    danger: [
      'bg-gradient-to-r from-error-dark to-red-600',
      'text-white shadow-md',
      'hover:from-red-600 hover:to-red-700',
      'hover:shadow-lg hover:-translate-y-0.5',
      'active:shadow-md active:translate-y-0',
      'focus:ring-error/60' // Error focus ring
    ]
  }

  const combinedClasses = [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
    className
  ].join(' ')

  const isInteractionDisabled = disabled || loading

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={isInteractionDisabled ? undefined : onClick}
      disabled={isInteractionDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          aria-hidden="true"
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        </div>
      )}
      
      {/* Button content - hidden when loading */}
      <span className={loading ? 'invisible' : 'flex items-center gap-2'}>
        {children}
      </span>

      {/* Screen reader loading announcement */}
      {loading && (
        <span className="sr-only">Loading...</span>
      )}
    </button>
  )
}

// Usage examples for documentation:
/*
<Button variant="primary" size="md">
  Primary Action
</Button>

<Button variant="secondary" size="sm" loading>
  Loading...
</Button>

<Button 
  variant="danger" 
  onClick={() => console.log('Delete')}
  aria-label="Delete item permanently"
>
  Delete
</Button>
*/