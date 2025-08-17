/**
 * @fileoverview BadgeGrid - Production-ready achievement badge grid
 * @description Grid display for achievements with locked/unlocked states and celebration
 * @accessibility WCAG AA+ compliant with proper focus management and announcements
 * @version 1.0.0
 */

import React, { useState } from 'react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  isUnlocked: boolean
  unlockedAt?: string
  progress?: number // 0-100 for partially completed achievements
  maxProgress?: number
  category?: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  points?: number
}

export interface BadgeGridProps {
  achievements: Achievement[]
  columns?: 3 | 4 | 5 | 6
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  showTooltips?: boolean
  onAchievementClick?: (achievement: Achievement) => void
  className?: string
}

export function BadgeGrid({
  achievements,
  columns = 4,
  size = 'md',
  showProgress = true,
  showTooltips = true,
  onAchievementClick,
  className = ''
}: BadgeGridProps) {
  const [hoveredAchievement, setHoveredAchievement] = useState<string | null>(null)
  const [focusedAchievement, setFocusedAchievement] = useState<string | null>(null)

  // Size configurations
  const sizeConfig = {
    sm: {
      badge: 'w-16 h-16',
      icon: 'w-6 h-6',
      grid: 'gap-3',
      text: 'text-xs'
    },
    md: {
      badge: 'w-20 h-20',
      icon: 'w-8 h-8',
      grid: 'gap-4',
      text: 'text-sm'
    },
    lg: {
      badge: 'w-24 h-24',
      icon: 'w-10 h-10',
      grid: 'gap-6',
      text: 'text-base'
    }
  }

  // Rarity color schemes
  const rarityColors = {
    common: {
      border: 'border-surface-4',
      bg: 'bg-surface-2',
      glow: ''
    },
    rare: {
      border: 'border-blue-500/50',
      bg: 'bg-blue-500/10',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
    },
    epic: {
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/10',
      glow: 'shadow-[0_0_15px_rgba(147,51,234,0.3)]'
    },
    legendary: {
      border: 'border-amber-500/50',
      bg: 'bg-amber-500/10',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]'
    }
  }

  const config = sizeConfig[size]

  // Format unlock date
  const formatUnlockDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Handle achievement interaction
  const handleAchievementClick = (achievement: Achievement) => {
    onAchievementClick?.(achievement)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, achievement: Achievement) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleAchievementClick(achievement)
    }
  }

  const gridClasses = [
    'grid',
    `grid-cols-${columns}`,
    config.grid,
    className
  ].join(' ')

  return (
    <div className={gridClasses} role="grid" aria-label="Achievement badges">
      {achievements.map((achievement) => {
        const rarity = achievement.rarity || 'common'
        const colors = rarityColors[rarity]
        const isHovered = hoveredAchievement === achievement.id
        const isFocused = focusedAchievement === achievement.id
        const showTooltip = showTooltips && (isHovered || isFocused)

        const badgeClasses = [
          'relative group',
          config.badge,
          'rounded-lg border-2 transition-all duration-300',
          'flex flex-col items-center justify-center',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
          achievement.isUnlocked ? [
            colors.bg,
            colors.border,
            'cursor-pointer hover:scale-105',
            isHovered && achievement.rarity !== 'common' ? colors.glow : '',
            'hover:border-primary-500/50'
          ] : [
            'bg-surface border-surface-3',
            'cursor-default opacity-60'
          ]
        ].flat().join(' ')

        return (
          <div key={achievement.id} className="relative">
            {/* Achievement badge */}
            <button
              className={badgeClasses}
              onClick={() => achievement.isUnlocked && handleAchievementClick(achievement)}
              onMouseEnter={() => setHoveredAchievement(achievement.id)}
              onMouseLeave={() => setHoveredAchievement(null)}
              onFocus={() => setFocusedAchievement(achievement.id)}
              onBlur={() => setFocusedAchievement(null)}
              onKeyDown={(e) => handleKeyDown(e, achievement)}
              disabled={!achievement.isUnlocked}
              aria-label={`${achievement.title}: ${achievement.description} ${achievement.isUnlocked ? 'Unlocked' : 'Locked'}`}
              aria-describedby={showTooltip ? `tooltip-${achievement.id}` : undefined}
              role="gridcell"
            >
              {/* Achievement icon */}
              <div className={`${config.icon} mb-1 ${achievement.isUnlocked ? 'text-text' : 'text-muted'}`}>
                {achievement.isUnlocked ? achievement.icon : (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Progress indicator for partial achievements */}
              {showProgress && achievement.progress !== undefined && !achievement.isUnlocked && (
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="w-full bg-surface-3 rounded-full h-1">
                    <div 
                      className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Unlock celebration sparkles */}
              {achievement.isUnlocked && achievement.rarity !== 'common' && isHovered && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-primary-400 rounded-full animate-ping"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 200}ms`,
                        animationDuration: '1s'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Rarity indicator */}
              {achievement.isUnlocked && achievement.rarity !== 'common' && (
                <div className="absolute top-1 right-1">
                  <div className={`w-2 h-2 rounded-full ${
                    achievement.rarity === 'rare' ? 'bg-blue-500' :
                    achievement.rarity === 'epic' ? 'bg-purple-500' :
                    'bg-amber-500'
                  }`} />
                </div>
              )}
            </button>

            {/* Tooltip */}
            {showTooltip && (
              <div
                id={`tooltip-${achievement.id}`}
                className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2"
                role="tooltip"
              >
                <div className="bg-surface-3 border border-surface-4 rounded-lg shadow-lg p-3 min-w-48 max-w-64">
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-surface-3" />
                  </div>

                  {/* Achievement info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-text">{achievement.title}</h4>
                      {achievement.points && (
                        <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded">
                          {achievement.points} pts
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted">{achievement.description}</p>
                    
                    {achievement.isUnlocked ? (
                      <div className="text-xs text-success">
                        ✓ Unlocked {achievement.unlockedAt && `on ${formatUnlockDate(achievement.unlockedAt)}`}
                      </div>
                    ) : achievement.progress !== undefined ? (
                      <div className="text-xs text-muted">
                        Progress: {achievement.progress}%
                        {achievement.maxProgress && ` (${Math.floor(achievement.progress * achievement.maxProgress / 100)}/${achievement.maxProgress})`}
                      </div>
                    ) : (
                      <div className="text-xs text-muted">🔒 Locked</div>
                    )}

                    {achievement.category && (
                      <div className="text-xs text-muted">
                        Category: {achievement.category}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Achievement category filter component
export interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  className?: string
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className = ''
}: CategoryFilterProps) {
  const filterClasses = [
    'flex flex-wrap gap-2',
    className
  ].join(' ')

  return (
    <div className={filterClasses} role="tablist">
      <button
        onClick={() => onCategoryChange(null)}
        className={[
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
          selectedCategory === null
            ? 'bg-primary-500 text-white'
            : 'bg-surface-2 text-muted hover:text-text hover:bg-surface-3'
        ].join(' ')}
        role="tab"
        aria-selected={selectedCategory === null}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
            selectedCategory === category
              ? 'bg-primary-500 text-white'
              : 'bg-surface-2 text-muted hover:text-text hover:bg-surface-3'
          ].join(' ')}
          role="tab"
          aria-selected={selectedCategory === category}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

// Usage examples for documentation:
/*
<BadgeGrid
  achievements={[
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first training module',
      icon: <StarIcon />,
      isUnlocked: true,
      unlockedAt: '2024-01-15T10:30:00Z',
      category: 'Training',
      rarity: 'common',
      points: 10
    },
    {
      id: '2',
      title: 'Helper',
      description: 'Assist 10 clients successfully',
      icon: <HeartIcon />,
      isUnlocked: false,
      progress: 60,
      maxProgress: 10,
      category: 'Service',
      rarity: 'rare',
      points: 50
    }
  ]}
  columns={4}
  size="md"
  onAchievementClick={(achievement) => console.log(achievement)}
/>

<CategoryFilter
  categories={['Training', 'Service', 'Leadership']}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
/>
*/