/**
 * @fileoverview Logo - Professional PILLAR logo component
 * @description Animated SVG logo with modern CSS animations and accessibility
 * @accessibility WCAG AA+ compliant with proper alt text and reduced motion support
 * @version 1.0.0
 */

import React from 'react'

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  variant?: 'default' | 'white' | 'monochrome'
  animated?: boolean
  showText?: boolean
  className?: string
  onClick?: () => void
}

const sizeMap = {
  xs: { width: 24, height: 24, fontSize: 'text-xs' },
  sm: { width: 32, height: 32, fontSize: 'text-sm' },
  md: { width: 48, height: 48, fontSize: 'text-base' },
  lg: { width: 64, height: 64, fontSize: 'text-lg' },
  xl: { width: 96, height: 96, fontSize: 'text-xl' },
  hero: { width: 128, height: 128, fontSize: 'text-2xl' }
}

export function Logo({ 
  size = 'md', 
  variant = 'default', 
  animated = true, 
  showText = true,
  className = '',
  onClick 
}: LogoProps) {
  const { width, height, fontSize } = sizeMap[size]
  const isClickable = Boolean(onClick)
  
  // Color schemes based on variant
  const colors = {
    default: {
      pillar: '#1f2937', // charcoal
      accent: '#3b82f6', // electric blue
      text: '#1f2937'
    },
    white: {
      pillar: '#ffffff',
      accent: '#60a5fa', // lighter blue for contrast
      text: '#ffffff'
    },
    monochrome: {
      pillar: 'currentColor',
      accent: 'currentColor',
      text: 'currentColor'
    }
  }
  
  const colorScheme = colors[variant]
  
  const containerClasses = [
    'inline-flex items-center gap-3',
    isClickable ? 'cursor-pointer group transition-transform duration-300 hover:scale-105' : '',
    animated ? 'animate-fade-in' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={containerClasses}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.() : undefined}
    >
      {/* PILLAR Logo SVG */}
      <div className="relative">
        <svg 
          width={width} 
          height={height} 
          viewBox="0 0 128 128" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={animated ? 'logo-animate' : ''}
          aria-label="PILLAR Logo"
        >
          {/* Main Pillar Structure */}
          <g className={animated ? 'pillar-main animate-slide-up' : 'pillar-main'}>
            {/* Base */}
            <rect 
              x="20" 
              y="100" 
              width="88" 
              height="12" 
              rx="6" 
              fill={colorScheme.pillar}
              className={animated ? 'animate-fade-in-delay-1' : ''}
            />
            
            {/* Columns */}
            <rect 
              x="30" 
              y="24" 
              width="12" 
              height="76" 
              rx="2" 
              fill={colorScheme.pillar}
              className={animated ? 'animate-slide-up-delay-2' : ''}
            />
            <rect 
              x="58" 
              y="24" 
              width="12" 
              height="76" 
              rx="2" 
              fill={colorScheme.pillar}
              className={animated ? 'animate-slide-up-delay-3' : ''}
            />
            <rect 
              x="86" 
              y="24" 
              width="12" 
              height="76" 
              rx="2" 
              fill={colorScheme.pillar}
              className={animated ? 'animate-slide-up-delay-4' : ''}
            />
            
            {/* Top Capital */}
            <rect 
              x="24" 
              y="16" 
              width="80" 
              height="16" 
              rx="8" 
              fill={colorScheme.pillar}
              className={animated ? 'animate-fade-in-delay-5' : ''}
            />
          </g>
          
          {/* Electric Blue Accent Elements */}
          <g className={animated ? 'accent-elements animate-pulse-glow' : 'accent-elements'}>
            {/* Left accent */}
            <path 
              d="M8 32 L24 16 L24 48 L16 56 L8 48 Z" 
              fill={colorScheme.accent}
              className={animated ? 'animate-float-left' : ''}
            />
            
            {/* Right accent */}
            <path 
              d="M120 32 L104 16 L104 48 L112 56 L120 48 Z" 
              fill={colorScheme.accent}
              className={animated ? 'animate-float-right' : ''}
            />
            
            {/* Bottom accent triangle */}
            <path 
              d="M64 116 L56 108 L72 108 Z" 
              fill={colorScheme.accent}
              className={animated ? 'animate-pulse-slow' : ''}
            />
          </g>
          
          {/* Subtle gradient overlay for depth */}
          <defs>
            <linearGradient id="pillarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorScheme.pillar} stopOpacity="1"/>
              <stop offset="100%" stopColor={colorScheme.pillar} stopOpacity="0.8"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
        
        {/* Hover glow effect */}
        {isClickable && (
          <div className="absolute inset-0 rounded-full bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        )}
      </div>
      
      {/* PILLAR Text */}
      {showText && (
        <div className="flex flex-col">
          <span 
            className={`font-bold tracking-wider ${fontSize} ${animated ? 'animate-fade-in-delay-6' : ''}`}
            style={{ color: colorScheme.text }}
          >
            PILLAR
          </span>
          {size === 'hero' && (
            <span 
              className={`text-xs font-medium tracking-wide opacity-80 ${animated ? 'animate-fade-in-delay-7' : ''}`}
              style={{ color: colorScheme.text }}
            >
              CHANGING THE GAME
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Logo
