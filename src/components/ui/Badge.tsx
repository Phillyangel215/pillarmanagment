/**
 * @fileoverview Badge - Production-ready badge component  
 * @description Status badges with semantic variants and accessibility features
 * @accessibility WCAG AA+ compliant with proper color contrast and screen reader support
 * @version 1.0.0
 */

import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  removable?: boolean
  icon?: React.ReactNode
  onRemove?: () => void
  className?: string
  'aria-label'?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  removable = false,
  icon,
  onRemove,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: BadgeProps) {
  
  // Base badge classes
  const baseClasses = [
    'inline-flex items-center gap-1.5 font-medium',
    'transition-all duration-200',
    rounded ? 'rounded-full' : 'rounded-md',
  ]

  // Size variants
  const sizeClasses = {
    sm: [
      'px-2 py-1 text-xs',
      'min-h-[20px]'
    ],
    md: [
      'px-2.5 py-1.5 text-sm',
      'min-h-[24px]'
    ],
    lg: [
      'px-3 py-2 text-base',
      'min-h-[32px]'
    ]
  }

  // Variant color schemes - ensuring AA+ contrast
  const variantClasses = {
    default: [
      'bg-surface-3 text-text-secondary',
      'border border-surface-4'
    ],
    primary: [
      'bg-primary-500/10 text-primary-400',
      'border border-primary-500/20'
    ],
    secondary: [
      'bg-surface-2 text-text-secondary',
      'border border-surface-4'
    ],
    success: [
      'bg-green-500/10 text-green-400',
      'border border-green-500/20'
    ],
    warning: [
      'bg-amber-500/10 text-amber-400',
      'border border-amber-500/20'
    ],
    error: [
      'bg-red-500/10 text-red-400',
      'border border-red-500/20'
    ],
    info: [
      'bg-blue-500/10 text-blue-400',
      'border border-blue-500/20'
    ]
  }

  const combinedClasses = [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses[variant],
    className
  ].join(' ')

  // Icon size based on badge size
  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  }

  // Remove button size
  const removeButtonSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove?.()
  }

  return (
    <span 
      className={combinedClasses}
      role="status"
      aria-label={ariaLabel}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <span className={iconSize[size]} aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Badge content */}
      <span>{children}</span>

      {/* Remove button */}
      {removable && (
        <button
          type="button"
          className={[
            removeButtonSize[size],
            'inline-flex items-center justify-center',
            'rounded-full transition-colors duration-200',
            'hover:bg-current hover:bg-opacity-20',
            'focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50',
            'ml-1'
          ].join(' ')}
          onClick={handleRemove}
          aria-label="Remove badge"
        >
          <svg 
            className="w-full h-full" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" 
            />
          </svg>
        </button>
      )}
    </span>
  )
}

// Predefined status badges for common use cases
export function StatusBadge({ 
  status, 
  ...props 
}: Omit<BadgeProps, 'variant' | 'children'> & { 
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'draft' 
}) {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active', icon: '●' },
    inactive: { variant: 'default' as const, label: 'Inactive', icon: '○' },
    pending: { variant: 'warning' as const, label: 'Pending', icon: '◐' },
    approved: { variant: 'success' as const, label: 'Approved', icon: '✓' },
    rejected: { variant: 'error' as const, label: 'Rejected', icon: '✗' },
    draft: { variant: 'secondary' as const, label: 'Draft', icon: '◯' }
  }

  const config = statusConfig[status]

  return (
    <Badge 
      variant={config.variant}
      aria-label={`Status: ${config.label}`}
      {...props}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </Badge>
  )
}

// Priority badge for tasks/issues
export function PriorityBadge({ 
  priority, 
  ...props 
}: Omit<BadgeProps, 'variant' | 'children'> & { 
  priority: 'low' | 'medium' | 'high' | 'urgent' 
}) {
  const priorityConfig = {
    low: { variant: 'secondary' as const, label: 'Low' },
    medium: { variant: 'info' as const, label: 'Medium' },
    high: { variant: 'warning' as const, label: 'High' },
    urgent: { variant: 'error' as const, label: 'Urgent' }
  }

  const config = priorityConfig[priority]

  return (
    <Badge 
      variant={config.variant}
      aria-label={`Priority: ${config.label}`}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

// Usage examples for documentation:
/*
<Badge variant="primary" size="md">
  New Feature
</Badge>

<Badge variant="success" size="sm" rounded>
  ✓ Completed
</Badge>

<Badge 
  variant="warning" 
  removable 
  onRemove={() => console.log('Removed')}
>
  Pending Review
</Badge>

<StatusBadge status="active" size="lg" />

<PriorityBadge priority="urgent" />

<Badge variant="error" icon={<AlertIcon />}>
  Critical Issue
</Badge>
*/