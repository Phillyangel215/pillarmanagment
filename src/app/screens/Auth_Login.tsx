/**
 * @fileoverview Login Screen - Authentication interface
 * @description Secure login form with enterprise branding and accessibility
 * @accessibility WCAG AA+ compliant with proper form labeling and error handling
 * @version 1.0.0
 */

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { login } from '@/app/actions/auth'

export function Auth_Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    
    // Basic validation
    const newErrors: { email?: string; password?: string } = {}
    
    if (!formData.email) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await login(formData.email, formData.password)
      if (error) {
        setErrors({ general: 'Invalid email or password. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: 'email' | 'password' | 'rememberMe', value: string | boolean) => {
    if (field === 'email') setFormData(prev => ({ ...prev, email: String(value) }))
    if (field === 'password') setFormData(prev => ({ ...prev, password: String(value) }))
    if (field === 'rememberMe') setFormData(prev => ({ ...prev, rememberMe: Boolean(value) }))
    
    // Clear field error when user starts typing
    if (field === 'email' && errors.email) setErrors(prev => ({ ...prev, email: undefined }))
    if (field === 'password' && errors.password) setErrors(prev => ({ ...prev, password: undefined }))
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header with logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(8, 6)">
                  <rect x="2" y="0" width="4" height="28" fill="white" rx="1"/>
                  <rect x="6" y="2" width="12" height="3" fill="white" rx="1.5"/>
                  <rect x="6" y="11" width="10" height="3" fill="white" rx="1.5"/>
                  <rect x="16" y="2" width="3" height="12" fill="white" rx="1"/>
                  <rect x="0" y="25" width="8" height="3" fill="white" rx="1.5"/>
                  <circle cx="10" cy="22" r="1" fill="white" opacity="0.8"/>
                  <circle cx="13" cy="24" r="1" fill="white" opacity="0.8"/>
                  <circle cx="16" cy="22" r="1" fill="white" opacity="0.8"/>
                </g>
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-text">Welcome to PILLAR</h1>
          <p className="text-muted mt-2">
            Sign in to your nonprofit management account
          </p>
        </div>

        {/* Login form */}
        <Card>
          <CardHeader>
            <CardTitle level={2}>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            {/* General error message */}
            {errors.general && (
              <div 
                className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-error flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-error font-medium">{errors.general}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={errors.email || undefined}
                required
                autoComplete="email"
                placeholder="Enter your work email"
                helpText="Use your organization email address"
              />

              {/* Password field */}
              <div className="relative">
                <Input
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                  error={errors.password || undefined}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                
                {/* Show/hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted hover:text-text transition-colors focus:outline-none focus:text-primary-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Remember me checkbox */}
              <Checkbox
                id="remember-me"
                label="Remember me on this device"
                checked={formData.rememberMe}
                onChange={(checked) => handleInputChange('rememberMe', checked)}
                helpText="Keep me signed in for 30 days"
              />

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                className="w-full"
                aria-describedby="login-help"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Forgot password link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded"
                  aria-describedby="login-help"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help text */}
        <div className="text-center space-y-4">
          <p id="login-help" className="text-sm text-muted">
            Need help? Contact your system administrator or call the support helpline.
          </p>
          
          {/* Demo credentials for development */}
          <div className="p-4 bg-surface-2 rounded-lg border border-surface-4">
            <h3 className="text-sm font-medium text-text mb-2">Demo Credentials</h3>
            <div className="text-xs text-muted space-y-1" aria-live="polite" id="login-help">
              <p><strong>Email:</strong> admin@pillar.demo</p>
              <p><strong>Password:</strong> demo123!</p>
            </div>
          </div>
        </div>

        {/* Security notice */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-muted">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Your connection is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth_Login