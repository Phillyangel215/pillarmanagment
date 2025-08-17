/**
 * @fileoverview AuthenticationSystem - Enterprise authentication management
 * @description Handles secure login/logout with role-based access control and audit logging
 * @version 1.0.0 - Initial implementation with Supabase integration
 * @requires Supabase Auth configured
 * @hipaa Handles user authentication data - audit logging required
 */

import React, { useState, useCallback, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  permissions: string[]
  status: string
  lastLogin: string | null
}

interface AuthenticationSystemProps {
  onAuthChange: (user: User | null) => void
  className?: string
}

export default function AuthenticationSystem({ 
  onAuthChange, 
  className = '' 
}: AuthenticationSystemProps): React.ReactElement {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  // Create Supabase client
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  )

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Session check error:', error)
        return
      }

      if (session?.access_token) {
        // Get user profile from server
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f2563d1b/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUser(data.user)
            onAuthChange(data.user)
          }
        }
      }
    } catch (error) {
      console.error('Session check failed:', error)
    }
  }, [onAuthChange, projectId, publicAnonKey])

  const handleLogin = useCallback(async () => {
    if (loading) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })

      if (error) {
        console.error('Login error:', error)
        setError('Invalid email or password. Please check your credentials and try again.')
        return
      }

      if (data.session?.access_token) {
        // Get user profile from server
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-f2563d1b/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const profileData = await response.json()
          if (profileData.success) {
            console.info(`AUDIT: User login successful`, {
              timestamp: new Date().toISOString(),
              userId: profileData.user.id,
              userRole: profileData.user.role,
              action: 'USER_LOGIN'
            })

            setUser(profileData.user)
            onAuthChange(profileData.user)
          } else {
            setError('Failed to load user profile. Please contact your administrator.')
          }
        } else {
          setError('Authentication successful but profile loading failed. Please try again.')
        }
      }

    } catch (err) {
      console.error('Login failed:', err)
      setError('Login failed due to a system error. Please try again or contact support.')
    } finally {
      setLoading(false)
    }
  }, [loading, loginForm, onAuthChange, projectId, publicAnonKey])

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true)
      
      console.info(`AUDIT: User logout initiated`, {
        timestamp: new Date().toISOString(),
        userId: user?.id,
        userRole: user?.role,
        action: 'USER_LOGOUT'
      })

      await supabase.auth.signOut()
      setUser(null)
      onAuthChange(null)
      setLoginForm({ email: '', password: '' })
      setError(null)

    } catch (err) {
      console.error('Logout failed:', err)
      setError('Logout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [user, onAuthChange])

  // If user is logged in, show logout interface
  if (user) {
    return (
      <div 
        className={`enterprise-layout ${className}`}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--spacing-4)'
        }}
      >
        <Card className="card-base">
          <CardHeader style={{ marginBottom: 'var(--spacing-4)' }}>
            <CardTitle className="heading-3">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <p className="text-base body-base">
                <strong>{user.firstName} {user.lastName}</strong>
              </p>
              <p className="text-base" style={{ color: 'var(--color-slate-500)' }}>
                {user.email} • {user.role}
              </p>
              {user.lastLogin && (
                <p className="text-base" style={{ color: 'var(--color-slate-400)', fontSize: 'var(--font-size-sm)' }}>
                  Last login: {new Date(user.lastLogin).toLocaleDateString()} at {new Date(user.lastLogin).toLocaleTimeString()}
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleLogout}
              disabled={loading}
              className="btn-base btn-secondary"
              style={{ 
                minHeight: '2.75rem',
                fontSize: 'var(--font-size-base)',
                fontWeight: '500',
                padding: 'var(--spacing-3) var(--spacing-6)',
                backgroundColor: 'var(--color-slate-100)',
                color: 'var(--color-slate-700)',
                border: '1px solid var(--color-slate-300)',
                borderRadius: 'var(--radius-lg)',
                gap: 'var(--spacing-2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-start'
              }}
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>

        {/* HIPAA Compliance Notice */}
        <div
          className="hipaa-warning"
          data-hipaa="true"
          style={{
            fontSize: 'var(--font-size-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
            padding: 'var(--spacing-3)',
            backgroundColor: 'var(--color-warning-50)',
            border: '1px solid var(--color-accent-600)',
            color: 'var(--color-accent-600)',
            borderRadius: 'var(--radius-base)',
            borderLeft: '4px solid var(--color-accent-600)'
          }}
        >
          <span>🔒</span>
          <span>Authentication session active - All system access is logged for HIPAA compliance</span>
        </div>
      </div>
    )
  }

  // Login form
  return (
    <div 
      className={`enterprise-layout ${className}`}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--spacing-6)',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      {/* Error Display */}
      {error && (
        <Alert 
          className="bg-error"
          style={{ 
            border: '1px solid var(--color-error-600)', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--spacing-4)',
            backgroundColor: 'var(--color-error-50)'
          }}
        >
          <AlertDescription style={{ color: 'var(--color-error-600)', fontWeight: '500' }}>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card className="card-base">
        <CardHeader style={{ marginBottom: 'var(--spacing-6)' }}>
          <CardTitle className="heading-2" style={{ textAlign: 'center' }}>
            Nonprofit Management System
          </CardTitle>
          <p className="text-base body-base" style={{ textAlign: 'center', color: 'var(--color-slate-500)' }}>
            Sign in to access your dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin()
            }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--spacing-4)' 
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label 
                htmlFor="email"
                style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '500',
                  color: 'var(--color-slate-700)'
                }}
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                required
                className="input-base"
                style={{
                  minHeight: '2.75rem',
                  fontSize: 'var(--font-size-base)',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-slate-300)',
                  backgroundColor: 'white'
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Label 
                htmlFor="password"
                style={{ 
                  fontSize: 'var(--font-size-base)',
                  fontWeight: '500',
                  color: 'var(--color-slate-700)'
                }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
                className="input-base"
                style={{
                  minHeight: '2.75rem',
                  fontSize: 'var(--font-size-base)',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-slate-300)',
                  backgroundColor: 'white'
                }}
                placeholder="Enter your password"
              />
            </div>

            <Button 
              type="submit"
              disabled={loading || !loginForm.email || !loginForm.password}
              className="btn-base btn-primary"
              style={{ 
                minHeight: '2.75rem',
                fontSize: 'var(--font-size-base)',
                fontWeight: '500',
                padding: 'var(--spacing-3) var(--spacing-6)',
                backgroundColor: 'var(--color-primary-600)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                gap: 'var(--spacing-2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* System Information */}
      <div
        style={{
          fontSize: 'var(--font-size-sm)',
          textAlign: 'center',
          color: 'var(--color-slate-400)',
          padding: 'var(--spacing-4)',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-slate-200)'
        }}
      >
        <p>Secure authentication system with role-based access control</p>
        <p style={{ marginTop: 'var(--spacing-2)' }}>
          Need an account? Contact your system administrator
        </p>
      </div>

      {/* HIPAA Compliance Notice */}
      <div
        className="hipaa-warning"
        data-hipaa="true"
        style={{
          fontSize: 'var(--font-size-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--color-warning-50)',
          border: '1px solid var(--color-accent-600)',
          color: 'var(--color-accent-600)',
          borderRadius: 'var(--radius-base)',
          borderLeft: '4px solid var(--color-accent-600)'
        }}
      >
        <span>🔒</span>
        <span>This system handles Protected Health Information (PHI) - All access is logged for HIPAA compliance</span>
      </div>
    </div>
  )
}