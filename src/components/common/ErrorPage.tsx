/**
 * @fileoverview ErrorPage - Professional error page with PILLAR branding
 * @description Full-page error component with logo and recovery options
 * @accessibility WCAG AA+ compliant with proper error announcements
 * @version 1.0.0
 */

import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/Button'

export interface ErrorPageProps {
  title?: string
  message?: string
  showRetry?: boolean
  showHome?: boolean
  onRetry?: () => void
  onHome?: () => void
  className?: string
}

export function ErrorPage({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again or contact support if the problem persists.',
  showRetry = true,
  showHome = true,
  onRetry,
  onHome,
  className = ''
}: ErrorPageProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }
  
  const handleHome = () => {
    if (onHome) {
      onHome()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className={`min-h-screen bg-surface flex items-center justify-center p-6 ${className}`}>
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Logo */}
        <div className="flex justify-center">
          <Logo 
            size="hero" 
            variant="default" 
            animated={true} 
            showText={true}
            className="opacity-80"
          />
        </div>
        
        {/* Error Content */}
        <div className="space-y-4">
          <div className="text-6xl">⚠️</div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text">
              {title}
            </h1>
            <p className="text-muted leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && (
            <Button 
              variant="primary" 
              onClick={handleRetry}
              className="min-w-[120px]"
            >
              Try Again
            </Button>
          )}
          {showHome && (
            <Button 
              variant="secondary" 
              onClick={handleHome}
              className="min-w-[120px]"
            >
              Go Home
            </Button>
          )}
        </div>
        
        {/* Support Info */}
        <div className="pt-8 border-t border-surface-4">
          <p className="text-sm text-muted">
            Need help? Contact your system administrator or{' '}
            <a 
              href="mailto:support@pillar.org" 
              className="text-primary-500 hover:text-primary-400 transition-colors underline"
            >
              reach out to support
            </a>
          </p>
        </div>
        
        {/* PILLAR Tagline */}
        <div className="text-xs text-muted opacity-60">
          PILLAR - Changing the game, one good deed at a time
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
