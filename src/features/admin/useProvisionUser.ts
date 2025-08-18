import { api } from '@/lib/http'

export type ProvisionPayload = { email: string; password: string; roles: string[] }

export async function provisionUser(payload: ProvisionPayload) {
  return api<{ ok: true; id: string }>(`/api/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

