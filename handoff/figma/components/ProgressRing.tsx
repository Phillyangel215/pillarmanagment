/**
 * @fileoverview ProgressRing - Production-ready circular progress component
 * @description Animated circular progress indicator with gamification features
 * @accessibility WCAG AA+ compliant with proper ARIA attributes and announcements
 * @version 1.0.0
 */

import React from 'react'

export interface ProgressRingProps {
  value: number // 0-100
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  thickness?: 'thin' | 'medium' | 'thick'
  variant?: 'primary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  showLabel?: boolean
  label?: string
  animated?: boolean
  children?: React.ReactNode
  className?: string
  'aria-label'?: string
}

export function ProgressRing({
  value,
  max = 100,
  size = 'md',
  thickness = 'medium',
  variant = 'primary',
  showValue = true,
  showLabel = false,
  label,
  animated = true,
  children,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: ProgressRingProps) {
  
  // Ensure value is within bounds
  const clampedValue = Math.max(0, Math.min(value, max))
  const percentage = (clampedValue / max) * 100

  // Size configurations
  const sizeConfig = {
    sm: { size: 48, strokeWidth: 4, fontSize: 'text-xs' },
    md: { size: 80, strokeWidth: 6, fontSize: 'text-sm' },
    lg: { size: 120, strokeWidth: 8, fontSize: 'text-base' },
    xl: { size: 160, strokeWidth: 10, fontSize: 'text-lg' }
  }

  // Thickness variations
  const thicknessMultiplier = {
    thin: 0.7,
    medium: 1,
    thick: 1.4
  }

  const config = sizeConfig[size]
  const strokeWidth = config.strokeWidth * thicknessMultiplier[thickness]
  const radius = (config.size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Color variants
  const colorClasses = {
    primary: {
      track: 'stroke-surface-4',
      progress: 'stroke-primary-500',
      glow: 'drop-shadow-[0_0_6px_rgba(47,123,255,0.4)]'
    },
    success: {
      track: 'stroke-surface-4',
      progress: 'stroke-success',
      glow: 'drop-shadow-[0_0_6px_rgba(45,190,123,0.4)]'
    },
    warning: {
      track: 'stroke-surface-4',
      progress: 'stroke-warning',
      glow: 'drop-shadow-[0_0_6px_rgba(246,167,35,0.4)]'
    },
    error: {
      track: 'stroke-surface-4',
      progress: 'stroke-error',
      glow: 'drop-shadow-[0_0_6px_rgba(224,68,126,0.4)]'
    }
  }

  const colors = colorClasses[variant]

  const containerClasses = [
    'relative inline-flex flex-col items-center gap-2',
    className
  ].join(' ')

  return (
    <div 
      className={containerClasses}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel || label || `Progress: ${percentage.toFixed(0)}%`}
      {...props}
    >
      {/* SVG Progress Ring */}
      <div className="relative">
        <svg
          width={config.size}
          height={config.size}
          className="transform -rotate-90"
          style={{ filter: animated && percentage > 0 ? colors.glow : 'none' }}
        >
          {/* Background track */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={`fill-none ${colors.track}`}
          />
          
          {/* Progress arc */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={`fill-none ${colors.progress} transition-all duration-500 ease-out`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: animated ? strokeDashoffset : circumference - (percentage / 100) * circumference,
              opacity: percentage > 0 ? 1 : 0
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children ? (
            children
          ) : showValue ? (
            <div className="text-center">
              <div className={`font-bold text-text ${config.fontSize}`}>
                {Math.round(percentage)}%
              </div>
              {showLabel && label && (
                <div className="text-xs text-muted">
                  {label}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* External label */}
      {showLabel && label && !showValue && (
        <span className="text-sm text-muted text-center">
          {label}
        </span>
      )}

      {/* Screen reader progress announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Progress: ${percentage.toFixed(0)}% complete`}
      </div>
    </div>
  )
}

// Specialized progress ring for XP/skill systems
export interface XPRingProps extends Omit<ProgressRingProps, 'children' | 'showValue'> {
  currentXP: number
  requiredXP: number
  level?: number
  showLevel?: boolean
}

export function XPRing({
  currentXP,
  requiredXP,
  level,
  showLevel = true,
  variant = 'primary',
  ...props
}: XPRingProps) {
  const percentage = (currentXP / requiredXP) * 100

  return (
    <ProgressRing
      value={percentage}
      variant={variant}
      {...props}
    >
      <div className="text-center">
        {showLevel && level !== undefined && (
          <div className="text-xs text-muted font-medium">
            Level
          </div>
        )}
        <div className="text-lg font-bold text-text">
          {level || Math.floor(percentage)}
        </div>
        <div className="text-xs text-muted">
          {currentXP}/{requiredXP} XP
        </div>
      </div>
    </ProgressRing>
  )
}

// Achievement progress ring
export interface AchievementRingProps extends Omit<ProgressRingProps, 'children'> {
  achieved: boolean
  icon?: React.ReactNode
  title?: string
}

export function AchievementRing({
  achieved,
  icon,
  title,
  value,
  variant = achieved ? 'success' : 'primary',
  ...props
}: AchievementRingProps) {
  return (
    <ProgressRing
      value={achieved ? 100 : value}
      variant={variant}
      animated={!achieved}
      {...props}
    >
      <div className="text-center">
        {icon && (
          <div className={`w-6 h-6 mx-auto mb-1 ${achieved ? 'text-success' : 'text-muted'}`}>
            {icon}
          </div>
        )}
        {achieved && (
          <div className="text-success">
            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {title && (
          <div className="text-xs text-muted mt-1 max-w-16 truncate">
            {title}
          </div>
        )}
      </div>
    </ProgressRing>
  )
}

// Usage examples for documentation:
/*
<ProgressRing
  value={75}
  size="lg"
  variant="primary"
  label="Course Progress"
  showLabel
/>

<XPRing
  currentXP={850}
  requiredXP={1000}
  level={5}
  size="md"
  thickness="thick"
/>

<AchievementRing
  value={80}
  achieved={false}
  title="First Login"
  icon={<StarIcon />}
  size="sm"
/>

<ProgressRing value={100} variant="success" size="sm">
  <div className="text-center">
    <CheckIcon className="w-6 h-6 text-success mx-auto" />
    <div className="text-xs text-success">Complete</div>
  </div>
</ProgressRing>
*/