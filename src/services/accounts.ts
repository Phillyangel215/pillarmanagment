import { apiJson } from '@/lib/http'
import { IS_DEMO } from '@/config/appConfig'

export async function createAccount(input: { email: string; password?: string; roles?: string[] }): Promise<{ id: string }> {
  if (IS_DEMO) {
    const data = await apiJson<{ ok: boolean; id: string }>(`/accounts`, { method: 'POST', body: input })
    return { id: data.id ?? 'demo-id' }
  }
  const data = await apiJson<{ id: string }>(`/accounts`, { method: 'POST', body: input })
  return { id: data.id }
}
