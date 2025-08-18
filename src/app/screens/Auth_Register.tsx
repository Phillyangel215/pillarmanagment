import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { register } from '@/app/actions/auth'

export default function Auth_Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!email) return setErrors({ email: 'Email is required' })
    if (!password) return setErrors({ password: 'Password is required' })
    setIsLoading(true)
    try {
      const { error } = await register(email, password)
      if (error) setErrors({ general: 'Registration failed' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader>
            <CardTitle level={2}>Create account</CardTitle>
          </CardHeader>
          <CardContent>
            {errors.general && <div className="mb-4 text-error">{errors.general}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input id="email" label="Email" type="email" value={email} onChange={setEmail} error={errors.email} required />
              <Input id="password" label="Password" type="password" value={password} onChange={setPassword} error={errors.password} required />
              <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading} className="w-full">Register</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

