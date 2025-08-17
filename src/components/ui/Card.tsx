/**
 * @fileoverview Card - Production-ready card component
 * @description Flexible card container with header, content, and footer sections
 * @accessibility WCAG AA+ compliant with proper heading hierarchy and landmarks
 * @version 1.0.0
 */

import React from 'react'

export interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
  'aria-label'?: string
  'aria-labelledby'?: string
  role?: string
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'md',
  className = '',
  onClick,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  role,
  ...props
}: CardProps) {
  
  const baseClasses = [
    'bg-surface-2 border border-surface-4',
    'transition-all duration-200',
  ]

  // Variant styles
  const variantClasses = {
    default: [],
    outlined: [
      'border-2 border-surface-4',
      'bg-transparent'
    ],
    elevated: [
      'shadow-lg',
      'hover:shadow-xl'
    ],
    interactive: [
      'cursor-pointer',
      'hover:bg-surface-3 hover:border-primary-500/30',
      'hover:shadow-md hover:-translate-y-0.5',
      'active:translate-y-0 active:shadow-sm',
      'focus:outline-none focus:ring-4 focus:ring-primary-500/50',
      'focus:border-primary-500'
    ]
  }

  // Padding variants
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  // Border radius variants
  const roundedClasses = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl'
  }

  const combinedClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    className
  ].join(' ')

  const Element = onClick ? 'button' : 'div'
  const cardRole = role || (onClick ? 'button' : undefined)

  return (
    <Element
      className={combinedClasses}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      role={cardRole}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </Element>
  )
}

export function CardHeader({
  children,
  className = '',
  ...props
}: CardHeaderProps) {
  const headerClasses = [
    'flex flex-col space-y-1.5',
    'pb-4 border-b border-surface-4',
    className
  ].join(' ')

  return (
    <div className={headerClasses} {...props}>
      {children}
    </div>
  )
}

export function CardContent({
  children,
  className = '',
  ...props
}: CardContentProps) {
  const contentClasses = [
    'py-4',
    className
  ].join(' ')

  return (
    <div className={contentClasses} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className = '',
  ...props
}: CardFooterProps) {
  const footerClasses = [
    'pt-4 border-t border-surface-4',
    'flex items-center justify-between gap-4',
    className
  ].join(' ')

  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  )
}

// Card title component for proper heading hierarchy
export interface CardTitleProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

export function CardTitle({
  children,
  level = 2,
  className = '',
  ...props
}: CardTitleProps) {
  const titleClasses = [
    'text-xl font-semibold text-text leading-tight',
    className
  ].join(' ')

  const Element = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <Element className={titleClasses} {...props}>
      {children}
    </Element>
  )
}

// Card description component
export interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function CardDescription({
  children,
  className = '',
  ...props
}: CardDescriptionProps) {
  const descriptionClasses = [
    'text-base text-muted leading-relaxed',
    className
  ].join(' ')

  return (
    <p className={descriptionClasses} {...props}>
      {children}
    </p>
  )
}

// Specialized card variants for common use cases
export interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    trend: 'up' | 'down' | 'neutral'
  }
  icon?: React.ReactNode
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  className = ''
}: StatsCardProps) {
  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-muted'
  }

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→'
  }

  return (
    <Card variant="elevated" className={className}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-text">
              {value}
            </p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trendColors[change.trend]}`}>
                <span aria-hidden="true">{trendIcons[change.trend]}</span>
                <span>{change.value}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <div className="w-6 h-6 text-primary-400">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Usage examples for documentation:
/*
<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle level={2}>Project Overview</CardTitle>
    <CardDescription>
      Manage your project settings and team members
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your project content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save Changes</Button>
  </CardFooter>
</Card>

<Card 
  variant="interactive" 
  onClick={() => console.log('Card clicked')}
  aria-label="Navigate to project details"
>
  <CardContent>
    <h3>Interactive Card</h3>
    <p>Click to navigate</p>
  </CardContent>
</Card>

<StatsCard
  title="Total Users"
  value="12,543"
  change={{ value: "+12.5%", trend: "up" }}
  icon={<UsersIcon />}
/>
*/