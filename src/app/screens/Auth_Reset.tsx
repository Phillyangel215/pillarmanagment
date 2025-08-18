import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { resetPassword } from '@/app/actions/auth'

export default function Auth_Reset() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!email) return setErrors({ email: 'Email is required' })
    setIsLoading(true)
    try {
      const { error } = await resetPassword(email)
      if (error) setErrors({ general: 'Failed to send reset email' })
      else setSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader>
            <CardTitle level={2}>Reset password</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-success">Check your email for a reset link.</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && <div className="mb-4 text-error">{errors.general}</div>}
                <Input id="email" label="Email" type="email" value={email} onChange={setEmail} error={errors.email} required />
                <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading} className="w-full">Send reset link</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

