import { useState } from 'react'
import { apiJson } from '@/lib/http'
import { IS_DEMO } from '@/config/appConfig'

export type ProvisionInput = { email: string; password: string; roles: string[] }

export function useProvisionUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function provision(input: ProvisionInput) {
    setLoading(true)
    setError(null)
    try {
      if (IS_DEMO) {
        await apiJson<{ ok: boolean; id: string }>(`/accounts`, { method: 'POST', body: input })
        return { id: 'demo' }
      }
      const res = await apiJson<{ id: string }>(`/accounts`, { method: 'POST', body: input })
      return res
    } catch (e) {
      setError((e as Error).message)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { provision, loading, error }
}
