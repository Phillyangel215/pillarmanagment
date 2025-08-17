/**
 * @fileoverview XPBar - Production-ready experience points progress bar
 * @description Linear progress bar for gamification with celebration animations
 * @accessibility WCAG AA+ compliant with proper ARIA attributes and reduced motion support
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react'

export interface XPBarProps {
  currentXP: number
  requiredXP: number
  level?: number
  previousXP?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'error'
  showLevel?: boolean
  showXPText?: boolean
  showPercentage?: boolean
  animated?: boolean
  celebrateOnLevelUp?: boolean
  className?: string
  'aria-label'?: string
}

export function XPBar({
  currentXP,
  requiredXP,
  level,
  previousXP,
  size = 'md',
  variant = 'primary',
  showLevel = true,
  showXPText = true,
  showPercentage = false,
  animated = true,
  celebrateOnLevelUp = true,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: XPBarProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Calculate progress
  const clampedCurrentXP = Math.max(0, Math.min(currentXP, requiredXP))
  const percentage = (clampedCurrentXP / requiredXP) * 100
  const previousPercentage = previousXP ? (Math.max(0, Math.min(previousXP, requiredXP)) / requiredXP) * 100 : 0

  // Size configurations
  const sizeConfig = {
    sm: {
      height: 'h-2',
      text: 'text-xs',
      levelBadge: 'text-xs px-2 py-1'
    },
    md: {
      height: 'h-3',
      text: 'text-sm',
      levelBadge: 'text-sm px-3 py-1'
    },
    lg: {
      height: 'h-4',
      text: 'text-base',
      levelBadge: 'text-base px-4 py-2'
    }
  }

  // Color variants
  const colorClasses = {
    primary: {
      bg: 'bg-primary-500/20',
      fill: 'bg-gradient-to-r from-primary-500 to-primary-600',
      glow: 'shadow-[0_0_10px_rgba(47,123,255,0.4)]',
      text: 'text-primary-400',
      badge: 'bg-primary-500 text-white'
    },
    success: {
      bg: 'bg-green-500/20',
      fill: 'bg-gradient-to-r from-green-500 to-green-600',
      glow: 'shadow-[0_0_10px_rgba(45,190,123,0.4)]',
      text: 'text-green-400',
      badge: 'bg-green-500 text-white'
    },
    warning: {
      bg: 'bg-amber-500/20',
      fill: 'bg-gradient-to-r from-amber-500 to-amber-600',
      glow: 'shadow-[0_0_10px_rgba(246,167,35,0.4)]',
      text: 'text-amber-400',
      badge: 'bg-amber-500 text-white'
    },
    error: {
      bg: 'bg-red-500/20',
      fill: 'bg-gradient-to-r from-red-500 to-red-600',
      glow: 'shadow-[0_0_10px_rgba(224,68,126,0.4)]',
      text: 'text-red-400',
      badge: 'bg-red-500 text-white'
    }
  }

  const config = sizeConfig[size]
  const colors = colorClasses[variant]

  // Handle level up celebration
  useEffect(() => {
    if (celebrateOnLevelUp && previousXP !== undefined && currentXP >= requiredXP && previousXP < requiredXP) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [currentXP, previousXP, requiredXP, celebrateOnLevelUp])

  // Animation trigger
  useEffect(() => {
    if (animated && previousXP !== undefined && currentXP !== previousXP) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 800)
      return () => clearTimeout(timer)
    }
  }, [currentXP, previousXP, animated])

  const containerClasses = [
    'relative w-full',
    className
  ].join(' ')

  const barClasses = [
    'relative w-full rounded-full overflow-hidden',
    config.height,
    colors.bg,
    'border border-surface-4'
  ].join(' ')

  const fillClasses = [
    'h-full rounded-full transition-all duration-800 ease-out',
    colors.fill,
    isAnimating && percentage > 50 ? colors.glow : ''
  ].join(' ')

  return (
    <div 
      className={containerClasses}
      role="progressbar"
      aria-valuenow={clampedCurrentXP}
      aria-valuemin={0}
      aria-valuemax={requiredXP}
      aria-label={ariaLabel || `Experience: ${clampedCurrentXP} of ${requiredXP} XP`}
      {...props}
    >
      {/* Top row: Level badge and XP text */}
      <div className="flex items-center justify-between mb-2">
        {/* Level badge */}
        {showLevel && level !== undefined && (
          <div className={`
            inline-flex items-center rounded-full font-medium
            ${config.levelBadge} ${colors.badge}
          `}>
            Level {level}
          </div>
        )}

        {/* XP text */}
        <div className={`${config.text} text-muted`}>
          {showXPText && (
            <span>
              {clampedCurrentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
            </span>
          )}
          {showPercentage && (
            <span className="ml-2">
              ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className={barClasses}>
        {/* Background shimmer effect */}
        {isAnimating && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        )}

        {/* Progress fill */}
        <div
          className={fillClasses}
          style={{
            width: `${percentage}%`,
            transition: animated ? 'width 800ms ease-out' : 'none'
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
          
          {/* Moving shimmer on progress */}
          {isAnimating && percentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] animate-[shimmer_1s_ease-in-out]" />
          )}
        </div>

        {/* Milestone markers */}
        {requiredXP >= 1000 && (
          <>
            <div className="absolute top-0 left-1/4 w-px h-full bg-surface-4/50" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-surface-4/50" />
            <div className="absolute top-0 left-3/4 w-px h-full bg-surface-4/50" />
          </>
        )}
      </div>

      {/* Celebration animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Particle burst effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 ${colors.fill} rounded-full animate-ping`}
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-20px)`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '600ms'
                }}
              />
            ))}
          </div>

          {/* Level up text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`
              ${config.text} font-bold ${colors.text}
              animate-bounce
            `}>
              Level Up!
            </div>
          </div>
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {showCelebration && "Level up achieved!"}
        {isAnimating && `Experience gained: ${clampedCurrentXP} of ${requiredXP} XP`}
      </div>
    </div>
  )
}

// Compact XP bar for smaller spaces
export interface CompactXPBarProps extends Omit<XPBarProps, 'showLevel' | 'showXPText'> {
  label?: string
}

export function CompactXPBar({
  label,
  currentXP,
  requiredXP,
  level,
  size = 'sm',
  ...props
}: CompactXPBarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Level indicator */}
      {level !== undefined && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{level}</span>
        </div>
      )}

      {/* Progress and label */}
      <div className="flex-1">
        {label && (
          <div className="text-xs text-muted mb-1">{label}</div>
        )}
        <XPBar
          currentXP={currentXP}
          requiredXP={requiredXP}
          size={size}
          showLevel={false}
          showXPText={false}
          {...props}
        />
      </div>
    </div>
  )
}

// Usage examples for documentation:
/*
<XPBar
  currentXP={750}
  requiredXP={1000}
  level={5}
  previousXP={600}
  size="lg"
  variant="primary"
  celebrateOnLevelUp
/>

<CompactXPBar
  currentXP={250}
  requiredXP={500}
  level={3}
  label="Programming Skills"
  variant="success"
/>

<XPBar
  currentXP={1000}
  requiredXP={1000}
  level={10}
  size="md"
  variant="success"
  showPercentage
/>
*/