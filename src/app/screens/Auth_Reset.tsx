import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { resetPassword } from '@/app/actions/auth'
import Logo from '@/components/common/Logo'

export function Auth_Reset() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Animated Logo Header */}
        <div className="text-center">
          <Logo size="lg" variant="default" animated={true} showText={true} className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-text">Reset Password</h1>
          <p className="text-sm text-muted mt-2">We'll send you a secure reset link</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle level={2}>Password reset</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div role="alert" className="mb-4 p-3 rounded border border-error/20 bg-error/10 text-error">{error}</div>
            )}
            {sent ? (
              <p className="text-sm text-muted">Check your email for a reset link.</p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <Input id="email" label="Email" type="email" value={email} onChange={setEmail} required />
                <Button type="submit" variant="primary" loading={loading} disabled={loading} className="w-full">Send reset link</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Auth_Reset
